import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int64 "mo:base/Int64";

module TransactionTypes {
  public type Transactions = HashMap.HashMap<Principal, [Transaction]>;
  public type TokenEntries = HashMap.HashMap<Principal, [TokenEntry]>;

  public type Transaction = {
    id : Text;
    from : Principal;
    package : Text;
    amount : Nat;
    timestamp : Text;
  };

  public type TokenEntry = {
    entryNo: Nat;
    entryType: TokenEntryType;
    description : Text;
    timestamp: Text;
    quantity: Int64;
  };
  
  public type TokenEntryType = {
    #initial;
    #analyze;
    #buy;
    #sub;
  }
};
