import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import TrieMap "mo:base/TrieMap";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Array "mo:base/Array";
import Types "../Types";
import Util "../Util";

actor {
    public type RegistrationResult = {
        #ok : Nat;
        #err : Text;
        };
    var userProfiles = TrieMap.TrieMap<Principal, Types.ClientProfile>(Principal.equal, Principal.hash);

    stable var stableUserProfile: [(Principal, Types.ClientProfile)] = [];

    system func preupgrade() {
        stableUserProfile := Iter.toArray(userProfiles.entries());
    };

    system func postupgrade() {
        userProfiles := TrieMap.fromEntries<Principal, Types.ClientProfile>(
        Iter.fromArray(stableUserProfile), Principal.equal, Principal.hash);
    };

    public shared func registerUser(
        unregisteredProfile: Types.ClientProfile
    ) : async RegistrationResult {
        try {
            userProfiles.put(unregisteredProfile.id, unregisteredProfile);
            return #ok(1);
        } catch (e: Error) {
            Debug.print("Error registering user: " # Error.message(e));
            return #err(Error.message(e));
        };
    };

    public shared func updateUser(
        updatedProfileData: Types.ClientProfile,
    ) : async Bool {

            switch (userProfiles.get(updatedProfileData.id)) {
            case (?currProfile) {
                let updatedProfile : Types.ClientProfile = {
                id = updatedProfileData.id;
                fullName = updatedProfileData.fullName;
                email = updatedProfileData.email;
                dateOfBirth = updatedProfileData.dateOfBirth;
                balance = updatedProfileData.balance;
                password = updatedProfileData.password;
                profilePictureUrl = updatedProfileData.profilePictureUrl;
                orderedServicesId = updatedProfileData.orderedServicesId;
                role = currProfile.role; // Keep the existing role
                };

                userProfiles.put(updatedProfile.id, updatedProfile);
                return true;
            };
            case (null) {
                Debug.print("Freelancer not found with id: " # Principal.toText(updatedProfileData.id));
                return false;
            };
            
        };
    
    };

    public query func getUser(id: Principal) : async ?Types.ClientProfile {
        return userProfiles.get(id);
    };


    public query func getAllUser(count: Nat) : async [Types.ClientProfile] {
        var userArray: [Types.ClientProfile] = [];
        for (user in userProfiles.vals()) {
            if (userArray.size() >= count) {
                return userArray;
            };
            userArray := Array.append<Types.ClientProfile>(userArray, [user]);
        };
        return userArray;
    };

    public query func getUserById(id: Principal) : async ?Types.ClientProfile {
        switch (userProfiles.get(id)) {
            case (?profile) {
                return ?profile;
            };
            case (null) {
                return null; // Profile not found
            };
        };
    };


    public query func getRole(id: Principal): async Text {
        switch(userProfiles.get(id)){
            case (?profile) {
                return profile.role; // Return the role of the user
            };
            case (null) {
                return "Client"; // Profile not found
            };
        }
    };

    public query func getUserBalance(id: Principal): async Float {
        switch(userProfiles.get(id)){
            case (?profile) {
                return profile.balance; // Return the balance of the client
            };
            case (null) {
                return 0; // Profile not found
            };
        }
    };

    public shared func updateUserBalance(id: Principal, newBalance: Float) : async Nat {
        switch (userProfiles.get(id)) {
            case null { return 0 };
            case (?user) {
                let updatedUser = {
                    user with
                    balance = newBalance;
                };
                
                try {
                    userProfiles.put(id, updatedUser);
                    return 1;
                } catch (e: Error) {
                    Debug.print("Error updating user balance: " # Error.message(e));
                    return 0;
                };
            };
        };
    };


};