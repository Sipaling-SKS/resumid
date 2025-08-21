import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
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
    description : Text;
    timestamp: Text;
    quantity: Nat;
  };
};
