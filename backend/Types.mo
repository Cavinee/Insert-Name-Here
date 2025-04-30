import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";

module Types {

  // Base user profile shared by all users
  public type ClientProfile = {
    id: Principal;
    role: UserRole;
    fullName: Text;
    email: Text;
    dateOfBirth: Text;
    balance: Float;
    profilePictureUrl: Text;
    orderedServicesId: [Principal];
  };

  public type ClientProfileUpdateFormData = {
    role: UserRole;
    fullName: Text;
    email: Text;
    dateOfBirth: Text;
    balance: Float;
    profilePictureUrl: Text;
    orderedServicesId: [Principal];
  };

  // Freelancer-specific profile extension
  public type FreelancerProfile = {
    id: Principal;
    role: UserRole;
    fullName: Text;
    email: Text;
    dateOfBirth: Text;
    balance: Float;
    profilePictureUrl: Text;
    orderedServicesId: [Principal];
    skills : [Text];
    portfolioIds : ?[Text]; // Optional: Not all freelancers have a portfolio yet
    reputationScore : Float; // Based on reviews, orders, etc.
    completedProjects : Nat;
    tokenRewards : Float; // For gamification or loyalty points
    availabilityStatus : AvailabilityStatus; // "Available", "Busy", "On Vacation", etc.
  };

  public type PortfolioId = Text;
  // Main Portfolio Item type
  public type PortfolioItem = {
    id: PortfolioId;
    freelancerId: Principal;
    title: Text;
    description: Text;
    category: Text;
    images: [Text];  // URLs to images
    video: ?Text;    // URL to video if applicable
    link: ?Text;     // External link if applicable
  };

  // public type FreelancerProfileUpdateFormData = {
  //   fullName : ?Text;
  //   email : ?Text;
  //   bio : ?Text;
  //   profilePictureUrl : ?Text;
  //   phoneNumber : ?Text;
  //   location : ?Text;
  //   rating : ?Float; // Optional until they get reviews
  //   password: ?Text;
  //   role :  UserRole; // "Freelancer", "Client", "Admin"
  //   isVerified : ?Bool; // For email or phone verification
  //   isSuspended : ?Bool; // For admin actions
  //   balance : ?Float;
  //   dateOfBirth : ?Text;
  //   skills : [Text];
  //   portfolioIds : ?[Text]; // Optional: Not all freelancers have a portfolio yet
  //   reputationScore : Float; // Based on reviews, orders, etc.
  //   completedProjects : Nat;
  //   tokenRewards : Float; // For gamification or loyalty points
  //   availabilityStatus : AvailabilityStatus; // "Available", "Busy", "On Vacation", etc.
  // };

  // Admin-specific profile extension
  public type AdminProfile = {
    id: Text;
    permissions : [Text]; // Example: ["banUser", "resolveDispute"]
    managedDisputes : ?[Text]; // IDs of disputes they handled
  };

  public type Transaction = {
    id : Principal;
    jobId : Principal;
    senderId : Principal;
    receiverId : Principal;
    amount : Float;
    currency : Text;
    status : Text;
    createdAt : Text;
    smartContractId : ?Principal;
    transactionHash : ?Text;
    freelancerFeeDeduction : Float;
  };

  public type Escrow = {
    id : Principal;
    orderId : Principal; //might change to serviceId / orderId
    clientId : Principal;
    freelancerId: Principal;
    amount : Nat;
    currency : Text; 
    created_at : Int;
    deadline : Int; //Time based; if past a certain date, immediately transfer the money
    jobStatus: JobStatus; //whether its disputed, cancelled, or whatever, so it can decide to refund, etc
    released : Bool;
    subaccount : ?Blob;
    funded : Bool;
    refunded : Bool;
  };

  public type PaymentStatus = {
    #Pending;
    #Paid;
    #Refunded;
    #Disputed;
  };

  public type SavedFavorite = {
    id : Principal;
    userId : Principal;
    itemType : Text;
    itemId : Principal;
    createdAt : Text;
  };

  // CHAT SYSTEM START

  public type Chat = {
    id : Principal;
    participants : [Principal];
    isChatbot : Bool;
    messages : ?[Message];
    createdAt : Text;
    lastUpdated : Text;
    freelancerPrioritySupport : Bool;
  };

  public type Message = {
    id : Principal;
    senderId : Principal;
    content : Text;
    time : Int;
    messageHash : ?Text;
  };
  // CHAT SYSTEM END

  // JOBS SYSTEM START

  // Enum for job/service/order status
  public type JobStatus = {
    #InProgress;
    #Delivered;
    #Completed;
    #Cancelled;
    #Disputed;
  };

  public type OrderStatus = {
    #Accepted;
    #Rejected;
    #Undecided;
  };

  public type AvailabilityStatus = {
    #Available;
    #Busy;
    #OnVacation;
  };

  public type UserRole = {
    #Client;
    #Freelancer;
    #Admin;
  };

  // Enum for payment method
  public type PaymentMethod = {
    #Escrow;
    #Direct;
  };

  // Enum for contract type
  public type ContractType = {
    #FixedPrice;
    #Hourly;
  };

  // Order represents a transaction between client and freelancer
  public type Order = {
    id : Principal;
    clientId : Principal;
    freelancerId : Principal;
    serviceId : Text;
    packageId : Text;
    orderStatus : OrderStatus; // "Accepted", "Rejected", "Undecided"
    jobStatus : JobStatus; // "InProgress", "Delivered", "Completed", "Cancelled", "Disputed"
    createdAt : Int;
    updatedAt : Int;
    paymentStatus : PaymentStatus; // "Pending", "Paid", "Refunded", "Disputed"
    currency : Text; // btc,eth
    deliveryDeadline : Int; // Timestamp deadline
    cancellationReason : ?Text; // Optional if order is cancelled
    revisions: [Revision];
    revisionMaxLimit : Nat;
  };
  
  public type Image  = {
    imageUrl: Text;
    imageTag: Text;
  };

  // Service (like a Fiverr gig)
  public type Service = {
    id : Text;
    title : Text;
    description : Text;
    category : Text;
    subcategory : Text;
    startingPrice : Nat; // From the cheapest ServiceTier
    currency : Text;
    deliveryTimeMin : Int; // Fastest delivery option in days
    status : JobStatus;
    freelancerId : Principal;
    createdAt : Nat;
    updatedAt : Nat;
    tags : [Text];
    attachments : ?[Image]; // Optional portfolio or example files
    tiers : [ServiceTier]; // Multiple tiers (Basic, Standard, Premium)
    contractType : ContractType;
    paymentMethod : PaymentMethod;
    averageRating : ?Float; // Auto-calculated
    totalReviews : Nat;
  };


  public type UnregisteredServiceFormData = {
    title : Text;
    description : Text;
    category : Text;
    subcategory : Text;
    startingPrice : Nat; // From the cheapest ServiceTier
    currency : Text;
    deliveryTimeMin : Int; // Fastest delivery option in days
    status : JobStatus;
    tags : [Text];
    attachments : ?[Image]; // Optional portfolio or example files
    tiers : [ServiceTier]; // Multiple tiers (Basic, Standard, Premium)
    contractType : ContractType;
    paymentMethod : PaymentMethod;
  };

  public type ServiceUpdateFormData = {
    title : ?Text;
    description : ?Text;
    category : ?Text;
    subcategory : ?Text;
    startingPrice : ?Nat; // From the cheapest ServiceTier
    currency : ?Text;
    deliveryTimeMin : ?Int; // Fastest delivery option in days
    status : ?JobStatus;
    tags : ?[Text];
    attachments : ?[Image]; // Optional portfolio or example files
    tiers : ?[ServiceTier]; // Multiple tiers (Basic, Standard, Premium)
    contractType : ?ContractType;
    paymentMethod : ?PaymentMethod;
  };

  // Each ServiceTier inside a Service
  public type ServiceTier = {
    id : Text; // Each tier can have an ID (for ordering)
    name : Text; // Basic, Standard, Premium
    description : Text;
    price : Nat; // In smallest unit (e.g., cents)
    deliveryDays : Nat;
    revisions : Nat;
    features : [Text];
  };

  public type Revision = {
    id : Text; // Each revision can have an ID (for ordering)
    description : Text;
    numberOfRevision : Nat;
  };
  
  public type UnregisteredServiceTierFormData = {
    name : Text; // Basic, Standard, Premium
    description : Text;
    price : Nat; // In smallest unit (e.g., cents)
    deliveryDays : Nat;
    revisions : Nat;
    features : [Text];
  };

  public type ServiceTierUpdateFormData = {
    name : ?Text; // Basic, Standard, Premium
    description : ?Text;
    price : ?Nat; // In smallest unit (e.g., cents)
    deliveryDays : ?Nat;
    revisions : ?Nat;
    features : ?[Text];
  };

  // JOBS SYSTEM END

  // CLIENT ACTIONS
  // Review type
  public type Review = {
    id : Principal;
    orderId : Text;
    serviceId : Text;
    reviewerId : Principal;
    recipientId : Principal;
    rating : Nat8; // 1 to 5 stars (validated)
    comment : Text;
    createdAt : Int; // timestamp (seconds since epoch)
    freelancerResponse : ?Text; // freelancer can respond once
    reviewType : Text; // "client-to-freelancer" or "freelancer-to-client"
  };

    public type ReviewDisplay = {
    review : Review;
    reviewerPrincipalShort : Text; // First 5 chars of principal
    createdAtDate : Text; // Human-readable date
  };

  public type AddReviewParams = {
    orderId : Text;
    serviceId : Text;
    recipientId : Principal;
    rating : Nat8;
    comment : Text;
    reviewType : Text;
  };

  public type Cancellation = {
    orderId : Text;
    cancelledBy : Principal;
    reason : Text;
    cancelledAt : Nat;
  };

  public type Dispute = {
    orderId : Text;
    raisedBy : Principal;
    reason : Text;
    status : Text; // "Open", "Resolved", "Rejected"
    createdAt : Nat;
    resolvedAt : ?Nat;
  };

  // public func generateUUID() : async Text {
  //   var id = Source.Source();          // create a random source
  //   return UUID.toText(await id.new());     // convert UUID to text
  // };

};
