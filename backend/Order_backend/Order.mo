import Array "mo:base/Array";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Util "../Util";
import Types "../Types";
import Service "canister:Service_backend";
import Freelancer "canister:Freelancer_backend";

actor {
  // Stable storage
  stable var ordersData : [(Text, [Types.Order])] = [];

  // Normal HashMap (NOT automatically stable)
  var ordersByClient = HashMap.HashMap<Text, [Types.Order]>(10, Text.equal, Text.hash);

  // Preupgrade: save all entries to stable var
  system func preupgrade() {
    ordersData := Iter.toArray(ordersByClient.entries());
  };

  // Postupgrade: rebuild the HashMap
  system func postupgrade() {
    ordersByClient := HashMap.HashMap<Text, [Types.Order]>(10, Text.equal, Text.hash);
    for ((key, value) in ordersData.vals()) {
      ordersByClient.put(key, value);
    };
  };
  
  public func createOrder(
    clientId : Principal,
    freelancerId : Principal,
    serviceId : Text,
    packageId : Text,
    paymentStatus : Text,
    currency : Text,
    deliveryDeadline : Int
  ) : async ?Types.Order {
     let packageChosen = await Service.getPackage(serviceId, packageId);

    switch (packageChosen) {
      case (?packageExists) {
        let id = await Util.generateUUID();
        let newOrder : Types.Order = {
          id;
          clientId = clientId;
          freelancerId = freelancerId;
          serviceId = serviceId;
          packageId = packageId;
          orderStatus = "Undecided";
          jobStatus = "In Progress";
          createdAt = Time.now();
          updatedAt = Time.now();
          paymentStatus = paymentStatus;
          currency = currency;
          deliveryDeadline = deliveryDeadline;
          cancellationReason = null;
          revisions = [];
          revisionMaxLimit = packageExists.revisions;
        };

        let existingOrders = switch (ordersByClient.get(id)) {
          case (?orders) { orders };
          case (null) { [] };
        };

        let updatedOrders = Array.append(existingOrders, [newOrder]);
        ordersByClient.put(id, updatedOrders);

        return ?newOrder;
      };
      case (null) {
        return null;
      };
    };
  };

  public query func getOrdersForFreelancer(freelancerId : Principal) : async [Types.Order] {
    var matchedOrders: [Types.Order] = [];

    for ((_, clientOrders) in ordersByClient.entries()) {
      for (order in clientOrders.vals()) {
        if (Principal.equal(order.freelancerId, freelancerId)) {
          matchedOrders := Array.append(matchedOrders, [order]);
        };
      };
    };

    return matchedOrders;
  };

  public query func getExistingClientOrders(clientId : Principal) : async [Types.Order] {
    var matchedOrders: [Types.Order] = [];

    for ((_, clientOrders) in ordersByClient.entries()) {
      for (order in clientOrders.vals()) {
        if (order.clientId == clientId) {
          matchedOrders := Array.append(matchedOrders, [order]);
        };
      };
    };

    return matchedOrders;
  };

  public func getOrder(orderId : Text) : async ?Types.Order {
    for ((id, order) in ordersByClient.entries()) {
      
        if (Text.equal(id, orderId)) {
          return ?order[0];
        };
      
    };
    return null;
  };

  public shared func getOrderStatus(orderId : Text) : async ?Text {
    let order = await getOrder(orderId);
    switch (order) {
      case (?o) {
        return ?o.orderStatus;
      };
      case (_) {
        return null; // Order not found
      };
    };
  };

  public shared func getOrderJobStatus(orderId : Text) : async ?Text {
    let order = await getOrder(orderId);
    switch (order) {
      case (?o) {
        return ?o.jobStatus;
      };
      case (_) {
        return null; // Order not found
      };
    };
  };

  public func updateOrder(orderId : Text, updatedOrder : Types.Order) : async Bool {
    switch (ordersByClient.get(orderId)) {
      case (?orders) {
        if (orders.size() > 0) {
          let existingOrder = orders[0];
          let updatedOrderObject : Types.Order = {
            id = existingOrder.id;
            clientId = updatedOrder.clientId;
            freelancerId = updatedOrder.freelancerId;
            serviceId = updatedOrder.serviceId;
            packageId = updatedOrder.packageId;
            orderStatus = updatedOrder.orderStatus;
            jobStatus = updatedOrder.jobStatus;
            createdAt = existingOrder.createdAt;
            updatedAt = Time.now();
            paymentStatus = updatedOrder.paymentStatus;
            currency = updatedOrder.currency;
            deliveryDeadline = updatedOrder.deliveryDeadline;
            cancellationReason = updatedOrder.cancellationReason;
            revisions = updatedOrder.revisions;
            revisionMaxLimit = updatedOrder.revisionMaxLimit;
          };
          
          ordersByClient.put(orderId, [updatedOrderObject]);
          return true;
        };
      };
      case (null) {};
    };
    
    return false;
  };

  public shared func deleteOrder(orderId : Text) : async Result.Result<(), Text> {
    for ((clientId, orders) in ordersByClient.entries()) {
      var foundOrder = false;
      let filteredOrders = Array.filter<Types.Order>(
        orders,
        func(order) {
          if (Text.equal(order.id, orderId)) {
            foundOrder := true;
            return false; // Exclude this order
          };
          return true; // Keep all other orders
        }
      );
      
      if (foundOrder) {
        ordersByClient.put(clientId, filteredOrders);
        return #ok();
      };
    };
    
    return #err("Order not found");
  };

  public shared func acceptOrder(orderId : Text, freelancerId : Principal) : async Result.Result<Text, Text> {
    try {
      let orderResult = await getOrder(orderId);
      switch (orderResult) {
        case (?orderExists) {
          // Check if the order belongs to this freelancer
          if (not Principal.equal(orderExists.freelancerId, freelancerId)) {
            return #err("This order is not assigned to you!");
          };
          
          // Check if the order is already in progress
          if (orderExists.orderStatus == "Accepted") {
            return #err("Order already accepted!");
          };
          
          let updatedOrder : Types.Order = {
            orderExists with
            orderStatus = "Accepted";
            updatedAt = Time.now(); // Update the timestamp
          };
          
          try {
            // Update the order in the database
            let updateResult = await updateOrder(orderId, updatedOrder);
            if (updateResult) {
              // Update the freelancer's profile to reflect the accepted order
              let freelancerProfile = await Freelancer.getFreelancerProfile(freelancerId);
              switch (freelancerProfile) {
                case (?profileExists) {
                  let updatedFreelancerProfile : Types.FreelancerProfile = {
                    profileExists with
                    orderedServicesId = Array.append<Text>(profileExists.orderedServicesId, [orderId]); // Add the orderId to the freelancer's profile
                  };
                  // Update the freelancer profile in the database
        
                  let profileUpdateSuccessful = await Freelancer.updateFreelancerProfile(
                    updatedFreelancerProfile
                    );
                    
                  if (profileUpdateSuccessful) {
                    return #ok("Order accepted successfully!");
                  } else {
                    return #err("Failed to update freelancer profile!");
                  };
                };
                case null {
                  return #err("Freelancer profile not found!");
                };
              };
            } else {
              return #err("Error updating order");
            };
          } catch (e) {
            Debug.print("Error updating order: " # Error.message(e));
            return #err("Error updating order: " # Error.message(e));
          };
        };
        case null {
          return #err("Order not found!");
        };
      };
    } catch (e) {
      Debug.print("Error accepting order: " # Error.message(e));
      return #err("Error accepting order: " # Error.message(e));
    };
  };


  public shared func rejectOrder(orderId : Text, freelancerId : Principal) : async Text {
    try {
      let orderResult = await getOrder(orderId);
      switch (orderResult) {
        case (?orderExists) {
          // Check if the order belongs to this freelancer
          if (not Principal.equal(orderExists.freelancerId, freelancerId)) {
            return "This order is not assigned to you!";
          };
          
          // Check if the order can be rejected
          if (orderExists.orderStatus == "Accepted") {
            return "Cannot reject an order that is already in progress or delivered!";
          };
          
          // Update the order status to rejected
          let updatedOrder : Types.Order = {
            orderExists with
            orderStatus = "Rejected";
            updatedAt = Time.now(); // Update the timestamp
          };
          
          try {
            // Update the order in the database
            let updateResult = await updateOrder(orderId, updatedOrder);
            switch (updateResult) {
              case (_) {
                // Update the freelancer's profile
                let freelancerProfile = await Freelancer.getFreelancerProfile(freelancerId);
                switch (freelancerProfile) {
                  case (?profileExists) {
                    let updatedFreelancerProfile : Types.FreelancerProfile = {
                      profileExists with
                      orderedServicesId = Array.filter<Text>(
                        profileExists.orderedServicesId,
                        func(id) {
                            id != orderId // Remove the rejected orderId from the freelancer's profile
                        },
                      );
                    };
                    // Update the freelancer profile in the database and handle the returned boolean
                    let profileUpdateSuccessful = await Freelancer.updateFreelancerProfile(
                      updatedFreelancerProfile
                      );
                    if (profileUpdateSuccessful) {
                      return"Order rejected successfully!";
                    } else {
                      return "Failed to update freelancer profile!";
                    };
                  };
                  case null {
                    return "Freelancer profile not found!";
                  };
                };
              };
              case (false) {
                return "Error updating order: ";
              };
            };
          } catch (e) {
            Debug.print("Error updating order: " # Error.message(e));
            return "Error updating order: " # Error.message(e);
          };
        };
        case null {
          return "Order not found!";
        };
      };
    } catch (e) {
      Debug.print("Error rejecting order: " # Error.message(e));
      return "Error rejecting order: " # Error.message(e);
    };
  };

  public shared func deliverOrder(orderId : Text, freelancerId : Principal) : async Result.Result<Text, Text> {
    try {
      let orderResult = await getOrder(orderId);
      switch (orderResult) {
        case (?orderExists) {
          // Check if the order belongs to this freelancer
          if (not Principal.equal(orderExists.freelancerId, freelancerId)) {
            return #err("This order is not assigned to you!");
          };
          
          // Check if the order is in progress
          if (orderExists.jobStatus != "In Progress") {
            return #err("Only orders in progress can be delivered!");
          };
          
          // Update the order status to delivered
          let updatedOrder : Types.Order = {
            orderExists with
            jobStatus = "Delivered";
            updatedAt = Time.now(); // Update the timestamp
          };
          
          try {
            // Update the order in the database
            let updateResult = await updateOrder(orderId, updatedOrder);
            switch (updateResult) {
              case (_) {
                return #ok("Order delivered successfully!");
              };
              
            };
          } catch (e) {
            Debug.print("Error updating order: " # Error.message(e));
            return #err("Error updating order: " # Error.message(e));
          };
        };
        case null {
          return #err("Order not found!");
        };
      };
    } catch (e) {
      Debug.print("Error delivering order: " # Error.message(e));
      return #err("Error delivering order: " # Error.message(e));
    };
  };

  public shared func completeOrder(orderId : Text, clientId : Principal) : async Result.Result<Text, Text> {
    try {
      let orderResult = await getOrder(orderId);
      switch (orderResult) {
        case (?orderExists) {
          // Check if the order belongs to this client
          if (not Principal.equal(orderExists.clientId, clientId)) {
            return #err("This order is not associated with your account!");
          };
          
          // Check if the order is delivered and can be completed
          if (orderExists.jobStatus != "Delivered") {
            return #err("Only delivered orders can be completed!");
          };
          
          // Update the order status to completed
          let updatedOrder : Types.Order = {
            orderExists with
            jobStatus = "Completed";
            updatedAt = Time.now(); // Update the timestamp
          };
          
          try {
            // Update the order in the database
            let updateResult = await updateOrder(orderId, updatedOrder);
            switch (updateResult) {
              case (_) {
                return #ok("Order completed successfully!");
              };
              
            };
          } catch (e) {
            Debug.print("Error updating order: " # Error.message(e));
            return #err("Error updating order: " # Error.message(e));
          };
        };
        case null {
          return #err("Order not found!");
        };
      };
    } catch (e) {
      Debug.print("Error completing order: " # Error.message(e));
      return #err("Error completing order: " # Error.message(e));
    };
  };

  public func processRevision(
    userId : Principal,
    orderId : Text,
    description : Text,
  ) : async Result.Result<Text, Text> {
    try {
      let orderResult = await getOrder(orderId);
      switch (orderResult) {
        case (?orderExists) {
          // Check if the client is the one requesting the revision
          if (not Principal.equal(orderExists.clientId, userId)) {
            return #err("Only the client can request revisions!");
          };
          
          // Check if order status allows revisions
          if (orderExists.jobStatus == "Completed") {
            return #err("Order already completed, cannot process revision.");
          } else if (orderExists.jobStatus == "In Progress") {
            return #err("Order is in progress, cannot process revision.");
          } else if (orderExists.jobStatus == "Cancelled") {
            return #err("Order is cancelled, cannot process revision.");
          } else if (orderExists.jobStatus == "Disputed") {
            return #err("Order is already undergoing revision.");
          };
          
          // Check if revision limit reached
          if (Array.size(orderExists.revisions) >= orderExists.revisionMaxLimit) {
            return #err("Maximum number of revisions reached for this order!");
          };
          
          // Generate a revision ID
          let revisionId = await Util.generateUUID();
          
          // Create the revision request
          let revisionRequest : Types.Revision = {
            id = revisionId;
            description = description;
            numberOfRevision = Array.size(orderExists.revisions) + 1;
          };
          
          // Add the revision to the order
          let updatedOrder : Types.Order = {
            orderExists with
            revisions = Array.append(orderExists.revisions, [revisionRequest]);
            jobStatus = "Disputed"; // Change status to disputed when revision is requested
            updatedAt = Time.now();
          };
          
          // Update the order in the database
          let updateResult = await updateOrder(orderId, updatedOrder);
          switch (updateResult) {
            case (_) {
              return #ok(revisionId);
            };
           
          };
        };
        case null {
          return #err("Order not found!");
        };
      };
    } catch (e) {
      Debug.print("Error processing revision: " # Error.message(e));
      return #err("Error processing revision: " # Error.message(e));
    };
  };
}