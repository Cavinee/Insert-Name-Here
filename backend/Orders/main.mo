import Array "mo:base/Array";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Types "../Types";
import Util "../Util";


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
  public func createOrder(clientId : Principal, freelancerId : Principal, serviceId : Principal, packageId : Text, status : Types.JobStatus, paymentStatus : Types.PaymentStatus, currency : Text, deliveryDeadline : Int) : async () {
    let newOrder : Types.Order = {
      id = await Util.generatePrincipal();
      clientId = clientId;
      freelancerId = freelancerId;
      serviceId = serviceId;
      packageId = packageId;
      status = status;
      createdAt = Time.now();
      updatedAt = Time.now();
      paymentStatus = paymentStatus;
      currency = currency;
      deliveryDeadline = deliveryDeadline;
      cancellationReason = null;
    };
    let existingOrders = switch (ordersByClient.get(clientId)) {
      case (?orders) { orders };
      case (_) { [] };
    };
    let updatedOrders = Array.append(existingOrders, [newOrder]);
    ordersByClient.put(clientId, updatedOrders);
  };

  public func getOrder(clientId : Principal) : async ?[Types.Order] {
    switch (ordersByClient.get(clientId)) {
      case (?orders) { return ?orders };
      case (_) { return null };
    };
  };

  public func updateOrder(clientId: Principal, orderId: Principal, updatedOrder: Types.Order) : async Bool {
    switch (ordersByClient.get(clientId)) {
      case (?orders) {
        let updatedOrders = Array.map<Types.Order, Types.Order>(orders, func (order) {
          if (order.id == orderId) {
            return {
              id = order.id;
              clientId = updatedOrder.clientId;
              freelancerId = updatedOrder.freelancerId;
              serviceId = updatedOrder.serviceId;
              packageId = updatedOrder.packageId;
              status = updatedOrder.status;
              createdAt = order.createdAt;
              updatedAt = Time.now();
              paymentStatus = updatedOrder.paymentStatus;
              currency = updatedOrder.currency;
              deliveryDeadline = updatedOrder.deliveryDeadline;
              cancellationReason = updatedOrder.cancellationReason;
            };
          } else {
            return order;
          }
        });
        ordersByClient.put(clientId, updatedOrders);
        return true;
      };
      case (_) {
        return false;
      };
    };
  };

  public func deleteOrder(clientId: Principal, orderId: Principal) : async Bool {
    switch (ordersByClient.get(clientId)) {
      case (?orders) {
        let filteredOrders = Array.filter<Types.Order>(orders, func (order) {
          order.id != orderId
        });
        ordersByClient.put(clientId, filteredOrders);
        return true;
      };
      case (_) {
        return false;
      };
    };
  };



};