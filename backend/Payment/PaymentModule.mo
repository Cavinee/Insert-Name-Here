// Define the types for the ledger
module LedgerTypes {
  public type AccountIdentifier = Blob;
  
  public type ICPTs = {
    e8s : Nat64;
  };
  
  public type Account = {
    owner : Principal;
    subaccount : ?[Nat8];
  };
  
  public type TransferArgs = {
    from_subaccount : ?[Nat8];
    to : Account;
    amount : Nat;
    fee : ?Nat;
    memo : ?[Nat8];
    created_at_time : ?Nat64;
  };
  
  public type TransferError = {
    #BadFee : { expected_fee : Nat };
    #InsufficientFunds : { balance : Nat };
    #TxTooOld : { allowed_window_nanos : Nat64 };
    #TxCreatedInFuture;
    #TxDuplicate : { duplicate_of : Nat };
  };
  
  public type TransferResult = {
    #Ok : Nat;
    #Err : TransferError;
  };
  
  public type ICPLedger = actor {
    icrc1_transfer : TransferArgs -> async TransferResult;
    icrc1_balance_of : Account -> async Nat;
  };
};