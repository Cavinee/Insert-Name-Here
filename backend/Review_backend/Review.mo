import Types "../Types";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";
import Float "mo:base/Float";
import Iter "mo:base/Iter";

module ReviewBackend {
    public type State = TrieMap.TrieMap<Principal, [Types.Review]>;

    public func empty() : State {
        TrieMap.TrieMap(Principal.equal, Principal.hash);
    };

    public func submitReview(state : State, review : Types.Review) {
        switch (state.get(review.recipientId)) {
            case (?existingReviews) {
                state.put(review.recipientId, Array.append(existingReviews, [review]));
            };
            case (null) {
                state.put(review.recipientId, [review]);
            };
        };
    };

    public func getReviewsForRecipient(state : State, recipientId : Principal) : [Types.Review] {
        switch (state.get(recipientId)) {
            case (?recipientReviews) { return recipientReviews };
            case null { return [] };
        };
    };

    public func getAverageRatingForRecipient(state : State, recipientId : Principal) : Float {
        switch (state.get(recipientId)) {
            case (?recipientReviews) {
                var totalRating : Nat = 0;
                var count : Nat = 0;
                for (review in recipientReviews.vals()) {
                    totalRating += Nat8.toNat(review.rating);
                    count += 1;
                };
                if (count > 0) {
                    return Float.fromInt(totalRating) / Float.fromInt(count);
                } else {
                    return 0.0;
                };
            };
            case null { return 0.0 };
        };
    };

    public func toArray(state : State) : [(Principal, [Types.Review])] {
        Iter.toArray(state.entries()); // Untuk backup stable 
    };

    public func fromArray(entries : [(Principal, [Types.Review])]) : State {
        let map = empty();
        for ((k, v) in entries.vals()) {
            map.put(k, v);
        };
        map
    };
};

actor {
    // Stable backup
    stable var clientToFreelancerBackup : [(Principal, [Types.Review])] = [];
    stable var freelancerToClientBackup : [(Principal, [Types.Review])] = [];

    // Runtime TrieMap
    var clientToFreelancerReviews = ReviewBackend.empty();
    var freelancerToClientReviews = ReviewBackend.empty();

    system func preupgrade() {
        clientToFreelancerBackup := ReviewBackend.toArray(clientToFreelancerReviews);
        freelancerToClientBackup := ReviewBackend.toArray(freelancerToClientReviews);
    };

    system func postupgrade() {
        clientToFreelancerReviews := ReviewBackend.fromArray(clientToFreelancerBackup);
        freelancerToClientReviews := ReviewBackend.fromArray(freelancerToClientBackup);
    };

    public func submitClientToFreelancerReview(review: Types.Review) : async Result.Result<Text, Text> {
        ReviewBackend.submitReview(clientToFreelancerReviews, review);
        return #ok("Review submitted successfully!");
    };

    public func submitFreelancerToClientReview(review: Types.Review) : async Result.Result<Text, Text> {
        ReviewBackend.submitReview(freelancerToClientReviews, review);
        return #ok("Review submitted successfully!");
    };

    public func getClientToFreelancerReviews(freelancerId: Principal) : async [Types.Review] {
        return ReviewBackend.getReviewsForRecipient(clientToFreelancerReviews, freelancerId);
    };

    public func getFreelancerToClientReviews(clientId: Principal) : async [Types.Review] {
        return ReviewBackend.getReviewsForRecipient(freelancerToClientReviews, clientId);
    };

    public func getAverageClientToFreelancerRating(freelancerId: Principal) : async Float {
        return ReviewBackend.getAverageRatingForRecipient(clientToFreelancerReviews, freelancerId);
    };

    public func getAverageFreelancerToClientRating(clientId: Principal) : async Float {
        return ReviewBackend.getAverageRatingForRecipient(freelancerToClientReviews, clientId);
    };
};