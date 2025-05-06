import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Types "../Types";
import Error "mo:base/Error";
import Nat8 "mo:base/Nat8";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Util "../Util";
// import Char "mo:base/Char";

actor Reviews {
  type Review = Types.Review;
  type ReviewDisplay = Types.ReviewDisplay;
  type AddReviewParams = Types.AddReviewParams;

  // Storage
  private let reviews = TrieMap.TrieMap<Text, Review>(Text.equal, Text.hash);
  private let orderToReview = TrieMap.TrieMap<Text, Text>(Text.equal, Text.hash);

  // Add review with auto-generated metadata
  public shared ({ caller }) func addReview(params : AddReviewParams) : async Text {
    // Validationa
    if (orderToReview.get(params.orderId) != null) {
      throw Error.reject("This order already has a review");
    };
    if (params.rating < 1 or params.rating > 5) {
      throw Error.reject("Rating must be 1-5 stars");
    };
    if (Text.size(params.comment) > 1000) {
      throw Error.reject("Comment too long (max 1000 chars)");
    };
    if (
      params.reviewType != "client-to-freelancer" and
      params.reviewType != "freelancer-to-client"
    ) {
      throw Error.reject("Invalid review type");
    };

    // Generate review data
    let id = await Util.generateUUID();
    let newReview : Review = {
      id;
      orderId = params.orderId;
      serviceId = params.serviceId;
      reviewerId = caller; // Use actual caller
      recipientId = params.recipientId;
      rating = params.rating;
      comment = params.comment;
      createdAt = Time.now();
      freelancerResponse = null;
      reviewType = params.reviewType;
    };

    // Save to storage
    reviews.put(id, newReview);
    orderToReview.put(params.orderId, id);
    id;
  };

  // Get reviews with multiple filters
  public query func getReviews(
    serviceId : ?Principal,
    recipientId : ?Principal,
    minRating : ?Nat8,
    limit : ?Nat,
  ) : async [ReviewDisplay] {
    let allReviews = Iter.toArray(reviews.vals());

    let filtered = Array.filter<Review>(
      allReviews,
      func(r) {
        let serviceMatch = switch serviceId {
          case (?id) r.serviceId == id;
          case null true;
        };
        let recipientMatch = switch recipientId {
          case (?id) r.recipientId == id;
          case null true;
        };
        let ratingMatch = switch minRating {
          case (?min) r.rating >= min;
          case null true;
        };
        serviceMatch and recipientMatch and ratingMatch;
      },
    );

    let limited = switch limit {
      case (?l) Array.take(filtered, l);
      case null filtered;
    };

    Array.map<Review, ReviewDisplay>(limited, func(r) { { review = r; reviewerPrincipalShort = principalToShortText(r.reviewerId); createdAtDate = formatTimestamp(r.createdAt) } });
  };

  // Format principal for display
  private func principalToShortText(p : Principal) : Text {
    let full = Principal.toText(p);
    if (Text.size(full) <= 8) {
      full;
    } else {
      // Manual character iteration
      var result = "";
      var count = 0;
      for (c in Text.toIter(full)) {
        if (count < 5) {
          result := Text.concat(result, Text.fromChar(c));
          count += 1;
        };
      };
      Text.concat(result, "...");
    };
  };

  // Format timestamp to date
  private func formatTimestamp(t : Int) : Text {
    let secondsPerDay = 86400;
    let daysSinceEpoch = t / secondsPerDay;
    // Simple date formatting (can be improved)
    "Day ";
  };

  // Reply to review once
  public shared ({ caller }) func respondToReview(reviewId : Text, response : Text) : async () {
    switch (reviews.get(reviewId)) {
      case (?review) {
        if (review.recipientId != caller) {
          throw Error.reject("Only review recipient can respond");
        };
        if (review.freelancerResponse != null) {
          throw Error.reject("Already responded");
        };
        let updated = { review with freelancerResponse = ?response };
        reviews.put(reviewId, updated);
      };
      case null throw Error.reject("Review not found");
    };
  };

  // Calc avg rating
  public func getAverageRating(recipientId : Principal) : async Float {
    let relevantReviews = await getReviews(null, ?recipientId, null, null);
    if (relevantReviews.size() == 0) return 0.0;

    let total = Array.foldLeft<ReviewDisplay, Nat>(
      relevantReviews,
      0,
      func(acc, r) { acc + Nat8.toNat(r.review.rating) },
    );
    Float.fromInt(total) / Float.fromInt(relevantReviews.size());
  };
};