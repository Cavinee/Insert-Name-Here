import Util "../Util";
import Types "../Types";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import TrieMap "mo:base/TrieMap";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Option "mo:base/Option";
import Error "mo:base/Error";


actor {
    type ClientProfile = Types.ClientProfile;

    var userProfiles = TrieMap.TrieMap<Principal, ClientProfile>(Principal.equal, Principal.hash);

    stable var stableUserProfile: [(Principal, ClientProfile)] = [];

    system func preupgrade() {
        stableUserProfile := Iter.toArray(userProfiles.entries());
    };

    system func postupgrade() {
        userProfiles := TrieMap.fromEntries<Principal, ClientProfile>(
        Iter.fromArray(stableUserProfile), Principal.equal, Principal.hash);
    };

   public func createClientProfile(
    fullName: Text,
    email: Text,
    bio: Text,
    profilePictureUrl: Text,
    phoneNumber: Text,
    location: Text,
    dateOfBirth: Text, // Changed to non-optional to match type definition
    balance: Float,
    ) : async Bool {
    try {
        let clientId = await Util.generatePrincipal();
        let newProfile : ClientProfile = {
            id = clientId;
            fullName = fullName;
            email = email;
            bio = bio;
            profilePictureUrl = profilePictureUrl;
            phoneNumber = phoneNumber;
            location = location;
            rating = null; // Optional until they get reviews
            createdAt = await Util.getCurrentTime();
            password = ""; // Password should be handled securely
            role = "Client";
            isVerified = false; // For email or phone verification
            isSuspended = false; // For admin actions
            balance = balance;
            dateOfBirth = dateOfBirth;
            // Note: walletAddress, postedProjects, and activeContracts are not in ClientProfile type
            // You might need to adjust your type definition if these fields are needed
        };

        userProfiles.put(clientId, newProfile);
        return true; // Changed to return boolean instead of number

    } catch (e) {
        Debug.print("Error creating client profile: " # Error.message(e));  
        return false; // Changed to return boolean instead of number
    };
    };

    public query func getClientProfile(id: Principal): async ?ClientProfile {
        switch(userProfiles.get(id)) {
            case (?profile) {
                return ?profile;
            };
            case (null) {
                return null; // Profile not found
            };
        };
    };

    public func updateClientProfile(
        id : Principal,
        fullName : ?Text,
        email : ?Text,
        bio : ?Text,
        profilePictureUrl : ?Text,
        phoneNumber : ?Text,
        location : ?Text,
        password: ?Text,
        isVerified : ?Bool, // For email or phone verification
        isSuspended : ?Bool, // For admin actions
        balance : ?Float,
        dateOfBirth : ?Text
    ) : async Bool {

        switch(userProfiles.get(id)) {
            case (?clientProfile) {
                let updatedProfile = {
                    clientProfile with

                    fullName = Option.get(fullName, clientProfile.fullName);
                    email = Option.get(email, clientProfile.email);
                    bio = Option.get(bio, clientProfile.bio);
                    profilePictureUrl = Option.get(profilePictureUrl, clientProfile.profilePictureUrl);
                    phoneNumber = Option.get(phoneNumber, clientProfile.phoneNumber);
                    location = Option.get(location, clientProfile.location);
                    dateOfBirth = Option.get(dateOfBirth, clientProfile.dateOfBirth);
                    password = Option.get(password, clientProfile.password);
                    isVerified = Option.get(isVerified, clientProfile.isVerified);
                    isSuspended = Option.get(isSuspended, clientProfile.isSuspended);
                    
                    balance = Option.get(balance, clientProfile.balance);
                    
                    rating = clientProfile.rating; // Keep existing rating
                    createdAt = clientProfile.createdAt // Keep existing createdAt - FIXED HERE
                };

                userProfiles.put(id, updatedProfile);
                return true; // Update successful

            };
            case (null) {
                return false; // Profile not found
            };
        };
    };

    public func deleteClientProfile(id: Principal) : async Bool {
        switch (userProfiles.get(id)) {
            case (?profile) {
                userProfiles.delete(id); // Use delete instead of remove
                return true; // Deletion successful
            };
            case (null) {
                return false; // Profile not found
            };
        };
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

    public func getRole(id: Principal): async Text {
        switch(userProfiles.get(id)){
            case (?profile) {
                return profile.role; // Return the role of the user
            };
            case (null) {
                return "Guest"; // Profile not found
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


    public shared func getAllUsers() : async [(Principal, ClientProfile)] {
        return Iter.toArray(userProfiles.entries());
    };

    public shared func getUserById(id: Principal) : async ?ClientProfile {
        switch (userProfiles.get(id)) {
            case (?profile) {
                return ?profile;
            };
            case (null) {
                return null; // Profile not found
            };
        };
    };
}