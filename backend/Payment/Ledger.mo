module {
  // Types from ledger.did
  public type Tokens = { e8s : Nat64 };
  public type TimeStamp = { timestamp_nanos : Nat64 };
  public type AccountIdentifier = Blob;
  public type SubAccount = Blob;
  public type BlockIndex = Nat64;
  public type Memo = Nat64;
  public type Account = { owner : Principal; subaccount : ?Blob };
  public type Icrc1Tokens = Nat;
  public type Icrc1Timestamp = Nat64;
  public type Icrc1BlockIndex = Nat;

  public type Transaction = {
    memo : Memo;
    icrc1_memo : ?Blob;
    operation : ?Operation;
    created_at_time : TimeStamp;
  };

  public type Operation = {
    #Mint : { to : AccountIdentifier; amount : Tokens };
    #Burn : {
      from : AccountIdentifier;
      spender : ?AccountIdentifier;
      amount : Tokens;
    };
    #Transfer : {
      from : AccountIdentifier;
      to : AccountIdentifier;
      amount : Tokens;
      fee : Tokens;
    };
    #Approve : {
      from : AccountIdentifier;
      spender : AccountIdentifier;
      allowance_e8s : Int; // Deprecated
      allowance : Tokens;
      fee : Tokens;
      expires_at : ?TimeStamp;
    };
    #TransferFrom : {
      from : AccountIdentifier;
      to : AccountIdentifier;
      spender : AccountIdentifier;
      amount : Tokens;
      fee : Tokens;
    };
  };

  public type TransferArgs = {
    memo : Memo;
    amount : Tokens;
    fee : Tokens;
    from_subaccount : ?SubAccount;
    to : AccountIdentifier;
    created_at_time : ?TimeStamp;
  };

  public type TransferError = {
    #BadFee : { expected_fee : Tokens };
    #InsufficientFunds : { balance : Tokens };
    #TxTooOld : { allowed_window_nanos : Nat64 };
    #TxCreatedInFuture;
    #TxDuplicate : { duplicate_of : BlockIndex };
  };

  public type TransferResult = {
    #Ok : BlockIndex;
    #Err : TransferError;
  };

  public type AccountBalanceArgs = { account : AccountIdentifier };
  public type TransferFeeArg = {};
  public type TransferFee = { transfer_fee : Tokens };

  public type GetBlocksArgs = {
    start : BlockIndex;
    length : Nat64;
  };

  public type Block = {
    parent_hash : ?Blob;
    transaction : Transaction;
    timestamp : TimeStamp;
  };

  public type BlockRange = { blocks : [Block] };

  public type QueryArchiveError = {
    #BadFirstBlockIndex : {
      requested_index : BlockIndex;
      first_valid_index : BlockIndex;
    };
    #Other : { error_code : Nat64; error_message : Text };
  };

  public type QueryArchiveResult = {
    #Ok : BlockRange;
    #Err : QueryArchiveError;
  };

  public type QueryArchiveFn = shared query (GetBlocksArgs) -> async QueryArchiveResult;

  public type QueryBlocksResponse = {
    chain_length : Nat64;
    certificate : ?Blob;
    blocks : [Block];
    first_block_index : BlockIndex;
    archived_blocks : [ArchivedBlocksRange];
  };

  public type ArchivedBlocksRange = {
    start : BlockIndex;
    length : Nat64;
    callback : QueryArchiveFn;
  };

  public type ArchivedEncodedBlocksRange = {
    callback : shared query (GetBlocksArgs) -> async {
      #Ok : [Blob];
      #Err : QueryArchiveError;
    };
    start : Nat64;
    length : Nat64;
  };

  public type QueryEncodedBlocksResponse = {
    certificate : ?Blob;
    blocks : [Blob];
    chain_length : Nat64;
    first_block_index : Nat64;
    archived_blocks : [ArchivedEncodedBlocksRange];
  };

  public type Archive = { canister_id : Principal };
  public type Archives = { archives : [Archive] };
  public type Duration = { secs : Nat64; nanos : Nat32 };
  public type ArchiveOptions = {
    trigger_threshold : Nat64;
    num_blocks_to_archive : Nat64;
    node_max_memory_size_bytes : ?Nat64;
    max_message_size_bytes : ?Nat64;
    controller_id : Principal;
    cycles_for_archive_creation : ?Nat64;
  };

  public type TextAccountIdentifier = Text;
  public type SendArgs = {
    memo : Memo;
    amount : Tokens;
    fee : Tokens;
    from_subaccount : ?SubAccount;
    to : TextAccountIdentifier;
    created_at_time : ?TimeStamp;
  };

  public type AccountBalanceArgsDfx = { account : TextAccountIdentifier };
  public type FeatureFlags = { icrc2 : Bool };
  public type InitArgs = {
    minting_account : TextAccountIdentifier;
    icrc1_minting_account : ?Account;
    initial_values : [(TextAccountIdentifier, Tokens)];
    max_message_size_bytes : ?Nat64;
    transaction_window : ?Duration;
    archive_options : ?ArchiveOptions;
    send_whitelist : [Principal];
    transfer_fee : ?Tokens;
    token_symbol : ?Text;
    token_name : ?Text;
    feature_flags : ?FeatureFlags;
    maximum_number_of_accounts : ?Nat64;
    accounts_overflow_trim_quantity : ?Nat64;
  };

  public type TransferArg = {
    from_subaccount : ?SubAccount;
    to : Account;
    amount : Icrc1Tokens;
    fee : ?Icrc1Tokens;
    memo : ?Blob;
    created_at_time : ?Icrc1Timestamp;
  };

  public type Icrc1TransferError = {
    #BadFee : { expected_fee : Icrc1Tokens };
    #BadBurn : { min_burn_amount : Icrc1Tokens };
    #InsufficientFunds : { balance : Icrc1Tokens };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #TemporarilyUnavailable;
    #Duplicate : { duplicate_of : Icrc1BlockIndex };
    #GenericError : { error_code : Nat; message : Text };
  };

  public type Icrc1TransferResult = {
    #Ok : Icrc1BlockIndex;
    #Err : Icrc1TransferError;
  };

  public type Value = {
    #Nat : Nat;
    #Int : Int;
    #Text : Text;
    #Blob : Blob;
  };

  public type UpgradeArgs = {
    maximum_number_of_accounts : ?Nat64;
    icrc1_minting_account : ?Account;
    feature_flags : ?FeatureFlags;
  };

  public type LedgerCanisterPayload = {
    #Init : InitArgs;
    #Upgrade : ?UpgradeArgs;
  };

  public type ApproveArgs = {
    from_subaccount : ?SubAccount;
    spender : Account;
    amount : Icrc1Tokens;
    expected_allowance : ?Icrc1Tokens;
    expires_at : ?TimeStamp;
    fee : ?Icrc1Tokens;
    memo : ?Blob;
    created_at_time : ?TimeStamp;
  };

  public type ApproveError = {
    #BadFee : { expected_fee : Icrc1Tokens };
    #InsufficientFunds : { balance : Icrc1Tokens };
    #AllowanceChanged : { current_allowance : Icrc1Tokens };
    #Expired : { ledger_time : Nat64 };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Icrc1BlockIndex };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };

  public type ApproveResult = {
    #Ok : Icrc1BlockIndex;
    #Err : ApproveError;
  };

  public type AllowanceArgs = { account : Account; spender : Account };
  public type Allowance = { allowance : Icrc1Tokens; expires_at : ?TimeStamp };

  // Ledger service interface
  public type Interface = actor {
    transfer : shared (TransferArgs) -> async TransferResult;
    account_balance : shared query (AccountBalanceArgs) -> async Tokens;
    transfer_fee : shared query (TransferFeeArg) -> async TransferFee;
    query_blocks : shared query (GetBlocksArgs) -> async QueryBlocksResponse;
    query_encoded_blocks : shared query (GetBlocksArgs) -> async QueryEncodedBlocksResponse;
    symbol : shared query () -> async { symbol : Text };
    name : shared query () -> async { name : Text };
    decimals : shared query () -> async { decimals : Nat32 };
    archives : shared query () -> async Archives;
    send_dfx : shared (SendArgs) -> async BlockIndex;
    account_balance_dfx : shared query (AccountBalanceArgsDfx) -> async Tokens;
    icrc1_name : shared query () -> async Text;
    icrc1_symbol : shared query () -> async Text;
    icrc1_decimals : shared query () -> async Nat8;
    icrc1_metadata : shared query () -> async [(Text, Value)];
    icrc1_total_supply : shared query () -> async Icrc1Tokens;
    icrc1_fee : shared query () -> async Icrc1Tokens;
    icrc1_minting_account : shared query () -> async ?Account;
    icrc1_balance_of : shared query (Account) -> async Icrc1Tokens;
    icrc1_transfer : shared (TransferArg) -> async Icrc1TransferResult;
    icrc1_supported_standards : shared query () -> async [(Text, Text)];
    icrc2_approve : shared (ApproveArgs) -> async ApproveResult;
    icrc2_allowance : shared query (AllowanceArgs) -> async Allowance;
  };
};
