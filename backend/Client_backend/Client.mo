import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import TrieMap "mo:base/TrieMap";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Array "mo:base/Array";
import Types "../Types";


actor {

    var userProfiles = TrieMap.TrieMap<Principal, Types.ClientProfile>(Principal.equal, Principal.hash);

    stable var stableUserProfile: [(Principal, Types.ClientProfile)] = [];

    system func preupgrade() {
        stableUserProfile := Iter.toArray(userProfiles.entries());
    };

    system func postupgrade() {
        userProfiles := TrieMap.fromEntries<Principal, Types.ClientProfile>(
        Iter.fromArray(stableUserProfile), Principal.equal, Principal.hash);
    };

   public func registerUser(profile: Types.ClientProfile) : async Nat {
        try {
            userProfiles.put(profile.id, profile);
            return 1;

        } catch (e: Error) {
            Debug.print("Error creating client profile: " # Error.message(e));  
            return 0; 
        };
    };

    public shared func updateUser(prof : Types.ClientProfile) : async Nat {
        
        try {
            userProfiles.put(prof.id, prof);
            return 1;
        } catch (e: Error) {
            Debug.print("Error updating user: " # Error.message(e));
            return 0;
        };
        return 0;
    };

    // public func deleteClientProfile(id: Principal) : async Bool {
    //     switch (userProfiles.get(id)) {
    //         case (?profile) {
    //             userProfiles.delete(id); // Use delete instead of remove
    //             return true; // Deletion successful
    //         };
    //         case (null) {
    //             return false; // Profile not found
    //         };
    //     };
    // };

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

    public shared func getUserById(id: Principal) : async ?Types.ClientProfile {
        switch (userProfiles.get(id)) {
            case (?profile) {
                return ?profile;
            };
            case (null) {
                return null; // Profile not found
            };
        };
    };


    public func getRole(id: Principal): async Types.UserRole {
        switch(userProfiles.get(id)){
            case (?profile) {
                return profile.role; // Return the role of the user
            };
            case (null) {
                return #Client; // Profile not found
            };
        }
    };

    public func getUserBalance(id: Principal): async ?Float {
        switch(userProfiles.get(id)){
            case (?profile) {
                return ?profile.balance; // Return the balance of the client
            };
            case (null) {
                return null; // Profile not found
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