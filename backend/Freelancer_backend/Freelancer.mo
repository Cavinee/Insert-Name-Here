import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Iter "mo:base/Iter";
import Types "../Types";
import Util "../Util";

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
      id: Principal,
      fullName: Text,
      email: Text,
      dateOfBirth: Text,
      balance: Float,
      profilePictureUrl: Text,
      orderedServicesId: [Principal],
      skills: [Text],
      portfolioIds: ?[Text]
  ) : async Bool {
    try {
      let freelancer : Types.FreelancerProfile = {
        id = id;
        role = "Freelancer";
        fullName = fullName;
        email = email;
        dateOfBirth = dateOfBirth;
        balance = balance;
        password = ""; // or handle password explicitly if needed
        profilePictureUrl = profilePictureUrl;
        orderedServicesId = orderedServicesId;
        skills = skills;
        portfolioIds = portfolioIds;
        reputationScore = 0.0;
        completedProjects = 0;
        tokenRewards = 0.0;
        availabilityStatus = "Available";
      };
      freelancerProfiles.put(id, freelancer);
      return true;
    } catch (e) {
      Debug.print("Error registering freelancer: " # Error.message(e));
      return false;
    };
  };


  // Register a freelancer from signup
  public shared func registerFreelancerFromSignup(
      unregisteredProfile: Types.FreelancerProfile,
  ) : async Bool {
    try {
     
      freelancerProfiles.put(unregisteredProfile.id, unregisteredProfile);
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
  public shared func updateFreelancerProfile(
    updatedProfileData: Types.FreelancerProfile,
) : async Bool {
  try {
    switch (freelancerProfiles.get(updatedProfileData.id)) {
      case (?currProfile) {
        let updatedProfile : Types.FreelancerProfile = {
          id = updatedProfileData.id;
          fullName = updatedProfileData.fullName;
          email = updatedProfileData.email;
          dateOfBirth = updatedProfileData.dateOfBirth;
          balance = updatedProfileData.balance;
          password = updatedProfileData.password;
          profilePictureUrl = updatedProfileData.profilePictureUrl;
          orderedServicesId = updatedProfileData.orderedServicesId;
          skills = updatedProfileData.skills;
          portfolioIds = updatedProfileData.portfolioIds;
          reputationScore = updatedProfileData.reputationScore;
          completedProjects = updatedProfileData.completedProjects;
          tokenRewards = updatedProfileData.tokenRewards;
          role = currProfile.role;
          availabilityStatus = currProfile.availabilityStatus;
        };

        freelancerProfiles.put(updatedProfile.id, updatedProfile);
        return true;
      };
      case (null) {
        Debug.print("Freelancer not found with id: " # Principal.toText(updatedProfileData.id));
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
          availabilityStatus = "Busy";
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
          availabilityStatus = "Available";
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


};
