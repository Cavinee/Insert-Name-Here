// Import necessary modules
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Blob "mo:base/Blob";
import Error "mo:base/Error";
import Ledger "canister:icp_ledger_canister";
import PaymentModule "PaymentModule";

actor PaymentSystem {
  type Account = PaymentModule.Account;
  type TransferArgs = PaymentModule.TransferArgs;
  type TransferResult = PaymentModule.TransferResult;
  
  // Connect to the ledger canister
  // For local development, use the local ledger canister ID
  let ledger : PaymentModule.ICPLedger = actor("ryjl3-tyaaa-aaaaa-aaaba-cai");
  
  // Example function to check balance
  public func checkBalance(owner : Principal) : async Nat {
    let account : Account = {
      owner = owner;
      subaccount = null;
    };
    
    return await ledger.icrc1_balance_of(account);
  };
  
  // Example function to process payment
  public shared func processPayment(to : Principal, amount : Nat64) : async Result.Result<Text, Text> {
    
    let transferArgs : TransferArgs = {
      from_subaccount = null;
      to = {
        owner = to;
        subaccount = null;
      };
      amount = Nat64.toNat(amount);
      fee = ?10000; // Standard fee for ICP transfers (0.0001 ICP)
      memo = ?Blob.toArray(Text.encodeUtf8("Payment transfer"));
      created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
    };
    
    try {
      let result = await ledger.icrc1_transfer(transferArgs);
      
      switch (result) {
        case (#Ok(blockIndex)) {
          return #ok("Payment successful: Block " # Nat.toText(blockIndex));
        };
        case (#Err(error)) {
          return #err("Payment failed: " # debug_show(error));
        };
      };
    } catch (error) {
      return #err("Unexpected error: " # Error.message(error));
    };
  };
  
  // Add your other payment system functions here
  // ...
}