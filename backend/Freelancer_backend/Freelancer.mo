import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Iter "mo:base/Iter";
import Types "../Types";

actor {
  // TrieMap to store freelancer profiles
  var freelancerProfiles = TrieMap.TrieMap<Principal, Types.FreelancerProfile>(Principal.equal, Principal.hash);

  stable var stableUserProfile : [(Principal, Types.FreelancerProfile)] = [];

  system func preupgrade() {
    stableUserProfile := Iter.toArray(freelancerProfiles.entries());
  };

  system func postupgrade() {
    freelancerProfiles := TrieMap.fromEntries<Principal, Types.FreelancerProfile>(
      Iter.fromArray(stableUserProfile),
      Principal.equal,
      Principal.hash,
    );
  };

  // Register a freelancer from client
  public shared func registerFreelancerFromClient(
    profile : Types.FreelancerProfile,
    skills : [Text],
    portfolioIds : ?[Text],
  ) : async Bool {
    try {
      let freelancer : Types.FreelancerProfile = {
        id = profile.id;
        role = #Freelancer;
        fullName = profile.fullName;
        email = profile.email;
        dateOfBirth = profile.dateOfBirth;
        balance = profile.balance;
        profilePictureUrl = profile.profilePictureUrl;
        orderedServicesId = profile.orderedServicesId;
        skills = skills;
        portfolioIds = portfolioIds; // Fixed: Use the provided portfolioIds
        reputationScore = 0.0;
        completedProjects = 0;
        tokenRewards = 0.0;
        availabilityStatus = #Available;
      };
      freelancerProfiles.put(profile.id, freelancer);
      return true;
    } catch (e) {
      Debug.print("Error registering freelancer: " # Error.message(e));
      return false;
    };
  };

  // Register a freelancer from signup
  public shared func registerFreelancerFromSignup(profile : Types.FreelancerProfile) : async Bool {
    try {
      freelancerProfiles.put(profile.id, profile);
      return true;
    } catch (e) {
      Debug.print("Error creating freelancer profile: " # Error.message(e));
      return false;
    };
  };

  // Get freelancer profile
  public shared query func getFreelancerProfile(userId : Principal) : async ?Types.FreelancerProfile {
    return freelancerProfiles.get(userId);
  };

  // Update freelancer profile
  public shared func updateFreelancerProfile(freelancerId: Principal, updatedFreelancerData : Types.FreelancerProfile) : async Bool {
    try {
      switch (freelancerProfiles.get(freelancerId)) {
        case (?_currProfile) {
          // Create a new profile with updated fields, handling optional values
          let newProfile : Types.FreelancerProfile = {
            id = freelancerId;
            fullName = updatedFreelancerData.fullName; // Always update fullName
            email = updatedFreelancerData.email;
            dateOfBirth = updatedFreelancerData.dateOfBirth;
            balance = updatedFreelancerData.balance;
            profilePictureUrl = updatedFreelancerData.profilePictureUrl;
            orderedServicesId = updatedFreelancerData.orderedServicesId; // Maintain the original value
            skills = updatedFreelancerData.skills; // Always update skills
            portfolioIds = updatedFreelancerData.portfolioIds; // Always update portfolioIds
            reputationScore = updatedFreelancerData.reputationScore; // Always update reputationScore
            completedProjects = updatedFreelancerData.completedProjects; // Always update completedProjects
            tokenRewards = updatedFreelancerData.tokenRewards; // Always update tokenRewards
            role = updatedFreelancerData.role; // Always update role
            availabilityStatus = updatedFreelancerData.availabilityStatus; // Always update availabilityStatus
          };

          freelancerProfiles.put(freelancerId, newProfile);
          return true;
          
        };
        case (null) {
          Debug.print("Freelancer not found with id: " # Principal.toText(freelancerId));
          return false;
        };
      };
    } catch (e) {
      Debug.print("Error updating freelancer profile: " # Error.message(e));
      return false;
    };
  };

  // Delete freelancer account
  public shared func deleteAccount(userId : Principal) : async Result.Result<Text, Text> {
    switch (freelancerProfiles.remove(userId)) {
      case (?_removedProfile) { return #ok("Account deleted successfully!") };
      case null { return #err("Freelancer not found!") };
    };
  };

  // Get all freelancers
  public query func getAllFreelancers() : async [Types.FreelancerProfile] {
    let profiles = Iter.toArray(freelancerProfiles.vals());
    return profiles;
  };

  // Get freelancer id from name
  public shared query func getFreelancerIdByName(name : Text) : async ?Principal {
    for ((id, freelancer) in freelancerProfiles.entries()) {
      if (Text.equal(freelancer.fullName, name)) {
        return ?id;
      };
    };
    return null; // Return null if not found
  };

  // Update availability status
  public shared func isBusy(freelancerId : Principal) : async Bool {
    switch (freelancerProfiles.get(freelancerId)) {
      case (?currProfile) {
        let updatedProfile : Types.FreelancerProfile = {
          currProfile with
          availabilityStatus = #Busy;
        };
        // Update the freelancerProfiles map with the new profile
        freelancerProfiles.put(freelancerId, updatedProfile);
        return true;
      };
      case null {
        // Handle the case where the freelancerId is not found
        return false;
      };
    };
  };
  public shared func isAvailable(freelancerId : Principal) : async Bool {
    switch (freelancerProfiles.get(freelancerId)) {
      case (?currProfile) {
        let updatedProfile : Types.FreelancerProfile = {
          currProfile with
          availabilityStatus = #Available;
        };
        // Update the freelancerProfiles map with the new profile
        freelancerProfiles.put(freelancerId, updatedProfile);
        return true;
      };
      case null {
        // Handle the case where the freelancerId is not found
        return false;
      };
    };
  };
// freelancers get order, then decide to accept or reject the order

//   public func processRevision(
//     userId : Principal,
//     orderId : Principal,
//     description : Text,
//   ) : async Result.Result<Text, Text> {
//     try {
//       let orderResult = await Order.getOrder(orderId);
//       switch (orderResult) {
//         case (?orderExists) {
//           // Check if the client is the one requesting the revision
//           if (not Principal.equal(orderExists.clientId, userId)) {
//             return #err("Only the client can request revisions!");
//           };
          
//           // Check if order status allows revisions
//           if (orderExists.jobStatus == #Completed) {
//             return #err("Order already completed, cannot process revision.");
//           } else if (orderExists.jobStatus == #InProgress) {
//             return #err("Order is in progress, cannot process revision.");
//           } else if (orderExists.jobStatus == #Cancelled) {
//             return #err("Order is cancelled, cannot process revision.");
//           } else if (orderExists.jobStatus == #Disputed) {
//             return #err("Order is already undergoing revision.");
//           };
          
//           // Check if revision limit reached
//           if (Array.size(orderExists.revisions) >= orderExists.revisionMaxLimit) {
//             return #err("Maximum number of revisions reached for this order!");
//           };
          
//           // Generate a revision ID
//           let revisionId = await Util.generateUUID();
          
//           // Create the revision request
//           let revisionRequest : Types.Revision = {
//             id = revisionId;
//             description = description;
//             numberOfRevision = Array.size(orderExists.revisions) + 1;
//           };
          
//           // Add the revision to the order
//           let updatedOrder : Types.Order = {
//             orderExists with
//             revisions = Array.append(orderExists.revisions, [revisionRequest]);
//             jobStatus = #Disputed; // Change status to disputed when revision is requested
//             updatedAt = Time.now();
//           };
          
//           // Update the order in the database
//           let updateResult = await Order.updateOrder(orderId, updatedOrder);
//           switch (updateResult) {
//             case (#ok()) {
//               return #ok(revisionId);
//             };
//             case (#err(error)) {
//               return #err("Error updating order with revision: " # error);
//             };
//           };
//         };
//         case null {
//           return #err("Order not found!");
//         };
//       };
//     } catch (e) {
//       Debug.print("Error processing revision: " # Error.message(e));
//       return #err("Error processing revision: " # Error.message(e));
//     };
//   };
};

// // Process a revision request from client

// // ----- Profile Management Functions -----

// // Add a portfolio item
// public func addPortfolioItem(
// freelancerId: Principal,
// title: Text,
// description: Text,
// category: Text,
// images: [Text],
// video: ?Text,
// link: ?Text
// ) : async Result.Result<PortfolioId, Error>;
// // ----- Order and Payment Functions -----

// // Request payment for completed work
// public func requestPayment(
// userId: Principal,
// orderId: OrderId
// ) : async Result.Result<PaymentId, Error>;

// // Withdraw earnings to external account
// public func withdrawEarnings(
// userId: Principal,
// amount: Float,
// paymentMethod: PaymentMethod,
// accountDetails: PaymentAccountDetails
// ) : async Result.Result<TransactionId, Error>{

// }
