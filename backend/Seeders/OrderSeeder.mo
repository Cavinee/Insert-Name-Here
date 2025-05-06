import Principal "mo:base/Principal";
import Types "../Types";
import Order "canister:Order_backend";

actor {
    public func run() : async () {
        let orders : [Types.UnregisteredOrder] = [
            {
                clientId = Principal.fromText("aaaaa-aa");
                freelancerId = Principal.fromText("aaaaa-ab");
                serviceId = "bbbb-bbbbbb";
                packageId = "Basic";
                orderStatus = "Accepted";
                jobStatus = "In Progress";
                paymentStatus = "Pending";
                currency = "btc";
                deliveryDeadline = 1697644800;
                cancellationReason = null;
                revisions = [];
                revisionMaxLimit = 3;
            },
            {
                clientId = Principal.fromText("aaaaa-aa");
                freelancerId = Principal.fromText("aaaaa-ab");
                serviceId = "bbbb-bbbbbc";
                packageId = "Premium";
                orderStatus = "Undecided";
                jobStatus = "In Progress";
                paymentStatus = "Paid";
                currency = "eth";
                deliveryDeadline = 1697644800;
                cancellationReason = null;
                revisions = [
                    { id = "1"; description = "Initial revision"; numberOfRevision = 1 }
                ];
                revisionMaxLimit = 5;
            }
        ];
        for (o in orders.vals()) {
            let _ = await Order.createOrder(
                o.clientId,
                o.freelancerId,
                o.serviceId,
                o.packageId,
                o.paymentStatus,
                o.currency,
                o.deliveryDeadline
            )
        };
    };
};