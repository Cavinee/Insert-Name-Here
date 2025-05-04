// Import necessary modules
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Ledger "canister:icp_ledger_canister";
import Types "../Types";
import Util "../Util";

actor PaymentSystem {
  
  // Connect to the ledger canister
  // For local development, use the local ledger canister ID
  let ledger : actor {
    icrc1_balance_of : (Account) -> async Nat;
    icrc1_transfer : (TransferArgs) -> async TransferResult;
  } = actor ("ryjl3-tyaaa-aaaaa-aaaba-cai");

  stable var escrowList : [(Principal, [Types.Escrow])] = [];

  var escrowByClient = HashMap.HashMap<Principal, [Types.Escrow]>(10, Principal.equal, Principal.hash);

  type Account = Ledger.Account;
  type TransferArgs = Ledger.TransferArg;
  type TransferResult = Ledger.TransferResult;

  // Preupgrade: save all entries to stable var
  system func preupgrade() {
    escrowList := Iter.toArray(escrowByClient.entries());
  };

  // Postupgrade: rebuild the HashMap
  system func postupgrade() {
    escrowByClient := HashMap.HashMap<Principal, [Types.Escrow]>(10, Principal.equal, Principal.hash);
    for ((key, value) in escrowList.vals()) {
      escrowByClient.put(key, value);
    };
  };

  // get escrow
  public shared func getEscrow(clientId : Principal) : async ?[Types.Escrow] {
    switch (escrowByClient.get(clientId)) {
      case (?list) ?list;
      case null ?[];
    };
  };

  // updateEscrow
  public shared func updateEscrow(clientId : Principal, updatedEscrow : Types.Escrow) : async Result.Result<Text, Nat> {
    let maybeList = escrowByClient.get(clientId);

    switch (maybeList) {
      case null return #err(0);
      case (?list) {
        switch (findEscrowIndex(list, updatedEscrow.id)) {
          case null return #err(0);
          case (?i) {
            // Create a new list with the updated escrow
            var newList = Array.tabulate<Types.Escrow>(
              list.size(),
              func(j : Nat) {
                if (j == i) {
                  updatedEscrow;
                } else {
                  list[j];
                };
              },
            );
            // Update the HashMap
            escrowByClient.put(clientId, newList);
            return #ok(Nat.toText(i));
          };
        };
      };
    };
  };

  //createEscrow
  public shared func createEscrow(
    orderId : Principal,
    clientId : Principal,
    freelancerId : Principal,
    amount : Nat,
    currency : Text,
    deadline : Int,
    jobStatus : Types.JobStatus,
  ) : async () {

    // Generate a unique ID for the escrow
    let escrowId = await Util.generatePrincipal();
    // Create subaccount from the escrow ID for deterministic mapping
    let subaccount = await Util.toSubaccount(escrowId);
    let newEscrow : Types.Escrow = {
      id = await Util.generatePrincipal();
      orderId = orderId;
      clientId = clientId;
      freelancerId = freelancerId;
      amount = amount;
      currency = currency;
      created_at = Time.now();
      deadline = deadline;
      jobStatus = jobStatus;
      released = false;
      refunded = false;
      subaccount = ?subaccount;
      funded = false;
    };

    switch (await getEscrow(clientId)) {
      case (null) {
        // First escrow for this client
        escrowByClient.put(clientId, [newEscrow]);
      };
      case (?foundList) {
        escrowByClient.put(clientId, Array.append<Types.Escrow>(foundList, [newEscrow]));
      };
    };

  };

  public func checkEscrowFunding(clientId : Principal, escrowId : Principal) : async Result.Result<Text, Nat> {
    let maybeList = escrowByClient.get(clientId);

    switch (maybeList) {
      case null return #err(0);
      case (?list) {
        let maybeEscrow = Array.find<Types.Escrow>(list, func(e) { e.id == escrowId });
        switch (maybeEscrow) {
          case null return #err(0);
          case (?escrow) {
            let account : Ledger.Account = {
              owner = Principal.fromActor(PaymentSystem);
              subaccount = escrow.subaccount;
            };

            let bal = await ledger.icrc1_balance_of(account);
            return #ok(Nat.toText(bal));

          };
        };
      };
    };
  };

  func findEscrowIndex(list : [Types.Escrow], escrowId : Principal) : ?Nat {
    var i : Nat = 0;
    for (e in list.vals()) {
      if (e.id == escrowId) {
        return ?i;
      };
      i += 1;
    };
    return null; // not found
  };

  public type ReleaseType = {
    #Refund;
    #Release;
  };

  public shared func releaseFunds(clientId : Principal, escrowId : Principal, releaseType : ReleaseType) : async Result.Result<Text, Text> {
    let maybeList = escrowByClient.get(clientId);

    switch (maybeList) {
      case null return #err("Client not found");
      case (?list) {
        switch (findEscrowIndex(list, escrowId)) {
          case null return #err("Escrow not found");
          case (?i) {
            let escrow = list[i];

            if (escrow.released or escrow.refunded) return #err("Already processed");

            var toAccount : Account = switch (releaseType) {
              // To figure out who to send to
              case (#Refund) {
                {
                  owner = clientId;
                  subaccount = null;
                };
              };
              case (#Release) {
                {
                  owner = escrow.freelancerId;
                  subaccount = null;
                };
              };
            };

            let transferArgs : TransferArgs = {
              from_subaccount = escrow.subaccount;
              to = toAccount;
              amount = escrow.amount;
              fee = ?10000;
              memo = ?Text.encodeUtf8("Escrow release");
              created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
            };

            try {
              let result = await ledger.icrc1_transfer(transferArgs);
              switch (result) {
                case (#Ok(blockIndex)) {
                  return #ok("Transfer Succesful. Block Index : " # Nat.toText(blockIndex));
                };
                case (#Err(err)) {
                  return #err("Transfer Failed. Debug show : " # debug_show (err));
                };
              };
            } catch (e) {
              return #err("Failed: " # Error.message(e));
            };
          };
        };
      };
    };
  };

};