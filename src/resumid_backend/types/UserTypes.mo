import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int64 "mo:base/Int64";

module {
  public type User = HashMap.HashMap<Principal, UserData>;

  public type UserData = {
    id : Principal;
    name : Text;
    role : Role;
    createdAt : Text;
    depositAddr: Text;
    token : Int64;
  };

  public type Role = {
    #admin;
    #user;
  }
};
