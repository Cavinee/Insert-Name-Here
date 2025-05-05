import Array "mo:base/Array";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Util "../Util";
import Types "../Types";
import Service "canister:Service_backend";
import Freelancer "canister:Freelancer_backend";

actor {
  // Stable storage
  stable var ordersData : [(Principal, [Types.Order])] = [];

  // Normal HashMap (NOT automatically stable)
  var ordersByClient = HashMap.HashMap<Principal, [Types.Order]>(10, Principal.equal, Principal.hash);

  // Preupgrade: save all entries to stable var
  system func preupgrade() {
    ordersData := Iter.toArray(ordersByClient.entries());
  };

  // Postupgrade: rebuild the HashMap
  system func postupgrade() {
    ordersByClient := HashMap.HashMap<Principal, [Types.Order]>(10, Principal.equal, Principal.hash);
    for ((key, value) in ordersData.vals()) {
      ordersByClient.put(key, value);
    };
  };
  
  public func createOrder(
    clientId : Principal,
    freelancerId : Principal,
    serviceId : Principal,
    packageId : Text,
    paymentStatus : Text,
    currency : Text,
    deliveryDeadline : Int
  ) : async ?Types.Order {
    
    let serviceResult = await Service.getServiceDetails(serviceId);
    let packageChosen = await Service.getPackage(serviceId, packageId);

    switch (packageChosen) {
      case (?packageExists) {
        let newOrder : Types.Order = {
          id = await Util.generatePrincipal();
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

        let existingOrders = switch (ordersByClient.get(clientId)) {
          case (?orders) { orders };
          case (null) { [] };
        };

        let updatedOrders = Array.append(existingOrders, [newOrder]);
        ordersByClient.put(clientId, updatedOrders);

        return ?newOrder;
      };
      case (null) {
        return null;
      };
    };
  };

  

  public func getOrder(orderId : Principal) : async ?Types.Order {
    // We need to search through all clients' orders to find the one with the matching ID
    for ((clientId, orders) in ordersByClient.entries()) {
      for (order in orders.vals()) {
        if (Principal.equal(order.id, orderId)) {
          return ?order;
        };
      };
    };
    return null;
  };

  public shared func getOrderStatus(orderId : Principal) : async ?Text {
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

  public shared func getOrderJobStatus(orderId : Principal) : async ?Text {
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

  public func updateOrder(orderId : Principal, updatedOrder : Types.Order) : async Result.Result<(), Text> {
    // Find the client who owns this order
    for ((clientId, orders) in ordersByClient.entries()) {
      let orderIndex = Array.indexOf<Types.Order>(
        {
          id = orderId;
          clientId = updatedOrder.clientId;
          freelancerId = updatedOrder.freelancerId;
          serviceId = updatedOrder.serviceId;
          packageId = updatedOrder.packageId;
          orderStatus = updatedOrder.orderStatus;
          jobStatus = updatedOrder.jobStatus;
          createdAt = updatedOrder.createdAt;
          updatedAt = updatedOrder.updatedAt;
          paymentStatus = updatedOrder.paymentStatus;
          currency = updatedOrder.currency;
          deliveryDeadline = updatedOrder.deliveryDeadline;
          cancellationReason = updatedOrder.cancellationReason;
          revisions = updatedOrder.revisions;
          revisionMaxLimit = updatedOrder.revisionMaxLimit;
        },
        orders,
        func(a, b) { Principal.equal(a.id, b.id) },
      );

      switch (orderIndex) {
        case (?index) {
          // Found the order, update it
          let updatedOrders = Array.tabulate<Types.Order>(
            orders.size(),
            func(i) {
              if (i == index) {
                return {
                  id = orderId; // Keep the original ID
                  clientId = updatedOrder.clientId;
                  freelancerId = updatedOrder.freelancerId;
                  serviceId = updatedOrder.serviceId;
                  packageId = updatedOrder.packageId;
                  orderStatus = updatedOrder.orderStatus;
                  jobStatus = updatedOrder.jobStatus;
                  createdAt = orders[index].createdAt; // Keep original creation time
                  updatedAt = Time.now(); // Update the updatedAt time
                  paymentStatus = updatedOrder.paymentStatus;
                  currency = updatedOrder.currency;
                  deliveryDeadline = updatedOrder.deliveryDeadline;
                  cancellationReason = updatedOrder.cancellationReason;
                  revisions = updatedOrder.revisions;
                  revisionMaxLimit = updatedOrder.revisionMaxLimit;
                };
              } else {
                return orders[i];
              };
            },
          );

          ordersByClient.put(clientId, updatedOrders);
          return #ok();
        };
        case (null) {
          // Order not found in this client's orders, continue searching
        };
      };
    };

    return #err("Order not found");
  };

  public shared func deleteOrder(orderId : Principal) {
    switch (await getOrder(orderId)) {
      case (?_) {
        // Remove the order from the hashmap
        ordersByClient.delete(orderId);
        // Remove the order from the stable storage

      };
      case (_) {
        // Order not found, do nothing

      };
    };
  };

  public shared func acceptOrder(orderId : Principal, freelancerId : Principal) : async Result.Result<Text, Text> {
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
            switch (updateResult) {
              case (#ok()) {
                // Update the freelancer's profile to reflect the accepted order
                let freelancerProfile = await Freelancer.getFreelancerProfile(freelancerId);
                switch (freelancerProfile) {
                  case (?profileExists) {
                    let updatedFreelancerProfile : Types.FreelancerProfile = {
                      profileExists with
                      orderedServicesId = Array.append<Principal>(profileExists.orderedServicesId, [orderId]); // Add the orderId to the freelancer's profile
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
              };
              case (#err(error)) {
                return #err("Error updating order: " # error);
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
      Debug.print("Error accepting order: " # Error.message(e));
      return #err("Error accepting order: " # Error.message(e));
    };
  };

  public shared func rejectOrder(orderId : Principal, freelancerId : Principal) : async Result.Result<Text, Text> {
    try {
      let orderResult = await getOrder(orderId);
      switch (orderResult) {
        case (?orderExists) {
          // Check if the order belongs to this freelancer
          if (not Principal.equal(orderExists.freelancerId, freelancerId)) {
            return #err("This order is not assigned to you!");
          };
          
          // Check if the order can be rejected
          if (orderExists.orderStatus == "Accepted") {
            return #err("Cannot reject an order that is already in progress or delivered!");
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
              case (#ok()) {
                // Update the freelancer's profile
                let freelancerProfile = await Freelancer.getFreelancerProfile(freelancerId);
                switch (freelancerProfile) {
                  case (?profileExists) {
                    let updatedFreelancerProfile : Types.FreelancerProfile = {
                      profileExists with
                      orderedServicesId = Array.filter<Principal>(
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
                      return #ok("Order accepted successfully!");
                    } else {
                      return #err("Failed to update freelancer profile!");
                    };
                    return #ok("Order rejected successfully!");
                  };
                  case null {
                    return #err("Freelancer profile not found!");
                  };
                };
              };
              case (#err(error)) {
                return #err("Error updating order: " # error);
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
      Debug.print("Error rejecting order: " # Error.message(e));
      return #err("Error rejecting order: " # Error.message(e));
    };
  };

  public shared func deliverOrder(orderId : Principal, freelancerId : Principal) : async Result.Result<Text, Text> {
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
              case (#ok()) {
                return #ok("Order delivered successfully!");
              };
              case (#err(error)) {
                return #err("Error updating order: " # error);
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

  public shared func completeOrder(orderId : Principal, clientId : Principal) : async Result.Result<Text, Text> {
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
              case (#ok()) {
                return #ok("Order completed successfully!");
              };
              case (#err(error)) {
                return #err("Error updating order: " # error);
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
    orderId : Principal,
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
            case (#ok()) {
              return #ok(revisionId);
            };
            case (#err(error)) {
              return #err("Error updating order with revision: " # error);
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
};
