import HashMap "mo:base/HashMap";
import Text "mo:base/Text";

module PackageTypes{
  public type Packages = HashMap.HashMap<Text, Package>;

  public type Package = {
    title: Text;
    subtitle: Text;
    price: Nat;
    token: Nat;
    description: [Text];
  }
};
