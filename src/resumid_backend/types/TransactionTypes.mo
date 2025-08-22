import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int32 "mo:base/Int32";
import PackageTypes "PackageTypes";

module TransactionTypes {
  public type Transactions = HashMap.HashMap<Principal, Transaction>;
  public type TokenEntries = HashMap.HashMap<Principal, [TokenEntry]>;

  public type Transaction = {
    id : Text;
    from : Principal;
    to : Principal;
    package : PackageTypes.Package;
    amount : Nat;
    timestamp : Text;
  };

  public type TokenEntry = {
    entryNo: Nat;
    entryType: TokenEntryType;
    description : Text;
    timestamp: Text;
    quantity: Int32;
  };
  
  public type TokenEntryType = {
    #initial;
    #analyze;
    #buy;
    #sub;
  }
};
