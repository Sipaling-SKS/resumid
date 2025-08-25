import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Bool "mo:base/Bool";

module PackageTypes{
  public type Packages = HashMap.HashMap<Text, Package>;

  public type Package = {
    id: Text;
    order: Int32;
    title: Text;
    subtitle: Text;
    price: Nat;
    token: Int64;
    description: [Text];
    highlightFirstItem: Bool;
    highlightPlan: Bool;
  }
};
