import Types "../Types";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Client "../Client_backend/Client";

actor{
    type ClientProfile = Types.ClientProfile;
    type FreelancerProfile = Types.FreelancerProfile;
    type UserProfileUpdate = Types.ClientProfileUpdateFormData;
    type FreelancerProfileUpdate = Types.FreelancerProfileUpdateFormData;

    // TrieMap to store freelancer profiles
    // Key: Principal (user ID), Value: FreelancerProfile
    var freelancers = TrieMap.TrieMap<Principal, FreelancerProfile>(Principal.equal, Principal.hash);



    public func registerFreelancerFromClient(
        profile: ClientProfile, 
        skills : [Text],
        portfolioIds : ?[Text], 

    ) {
        let freelancer: FreelancerProfile = {
            profile = profile;
            skills = skills;
            portfolioIds = null;
            reputationScore = 0.0;
            completedProjects = 0;
            tokenRewards = 0.0;
            availabilityStatus = "Available";
        };
        freelancers.put(profile.id, freelancer);
    };

   public func registerFreelancerFromSignup(
        fullName: Text,
        email: Text,
        bio: Text,
        profilePictureUrl: Text,
        phoneNumber: Text,
        location: Text,
        dateOfBirth: Text,
        balance: Float,
        skills: [Text],
        portfolioIds: ?[Text], 
    ) : async Bool {
        try {
            // Create new client profile
            let clientProfileCreated = await Client.createClientProfile(
                fullName,
                email,
                bio,
                profilePictureUrl,
                phoneNumber,
                location,
                dateOfBirth,
                balance
            );
            
            if (clientProfileCreated) {
                // Get the client profile that was just created
                // This assumes there's a way to get the client profile by email or another unique identifier
                let clientProfile = await Client.getClientProfileByEmail(email);
                
                // Create new freelancer profile
                let freelancerRegistered = await registerFreelancerFromClient(
                    clientProfile,
                    skills,
                    portfolioIds
                );
                
                return freelancerRegistered;
            } else {
                return false;
            }
        } catch(e) {
            Debug.print("Error creating freelancer profile: " # Error.message(e));
            return false;
        };
    };
    // Get freelancer profile
    public func getFreelancerProfile(userId: Principal) : async ?FreelancerProfile {
        return freelancers.get(userId);
    };

    public func updateFreelancerProfile(userId: Principal, updateData: UserProfileUpdate) : async Text {
        switch (freelancers.get(userId)) {
            case (?freelancer) {
            
            // Update each field if it's provided
            
            freelancers.put(userId, updatedFreelancer);
            return "Profile updated successfully!";
            };
            case (null) {
            return "Freelancer not found!";
            };
        };
    };

    // Delete freelancer account
    public func deleteAccount(userId: Principal) : async Result.Result<Text, Text> {
        switch (freelancers.remove(userId)) {
        case (?removedProfile) { return #ok("Account deleted successfully!"); };
        case null { return  #err("Freelancer not found!"); };
        }
    };

    // // Accept a client's request for work
    // public func acceptClientRequest(
    // userId: Principal,
    // requestId: RequestId
    // ) : async Result.Result<OrderId, Error>;

        
    // // Deliver completed work to client
    // public func deliverOrder(
    // userId: Principal,
    // orderId: OrderId,
    // message: Text,
    // deliverables: [DeliverableFile],
    // isPartialDelivery: Bool
    // ) : async Result.Result<DeliveryId, Error>;

    // // Process a revision request from client
    // public func processRevision(
    // userId: Principal,
    // orderId: OrderId,
    // revisionRequest: RevisionRequest,
    // response: Text,
    // isAccepted: Bool,
    // counterOffer: ?RevisionCounterOffer
    // ) : async Result.Result<RevisionId, Error>;

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

    // // Update availability status
    // public func updateAvailability(
    // userId: Principal,
    // isAvailable: Bool,
    // vacationMode: Bool,
    // returnDate: ?Int,
    // autoReplyMessage: ?Text
    // ) : async Result.Result<Bool, Error>;

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
    // ) : async Result.Result<TransactionId, Error>;

}