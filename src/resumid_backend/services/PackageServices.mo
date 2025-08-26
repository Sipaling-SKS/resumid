import PackagesTypes "../types/PackageTypes";
import HttpHelper "../helpers/HttpHelper";
import Iter "mo:base/Iter";
import GlobalHelper "../helpers/GlobalHelper";

module PackageServices {
  public func initDefaultPackage(
    packages : PackagesTypes.Packages
  ) : async [PackagesTypes.Package] {
    let package1Id = await GlobalHelper.GenerateUUID();
    let package1 : PackagesTypes.Package = {
      id = package1Id;
      title = "Basic";
      subtitle = "For individuals";
      price = 5;
      token = 10;
      description = [
        "Get 10 Tokens",
        "Great for first-time users to try the service.",
      ];
      order = 1;
      highlightPlan = false;
      highlightFirstItem = false;
    };
    packages.put(package1Id, package1);

    let package2Id = await HttpHelper._generateIdempotencyKey();
    let package2 : PackagesTypes.Package = {
      order = 2;
      id = package2Id;
      title = "Pro";
      subtitle = "For individuals or small teams";
      price = 10;
      token = 25;
      description = [
        "Get 25 Tokens",
        "Ideal for regular users who need consistent feedback",
      ];
      highlightPlan = true;
      highlightFirstItem = true;
    };

    packages.put(package2Id, package2);

    let package3Id = await GlobalHelper.GenerateUUID();
    let package3 : PackagesTypes.Package = {
      order = 3;
      id = package3Id;
      title = "Premium";
      subtitle = "For organization";
      price = 20;
      token = 60;
      description = [
        "Get 60 Tokens",
        "Bulk analysis, custom AI models, and dedicated support.",
      ];
      highlightPlan = false;
      highlightFirstItem = true;
    };

    packages.put(package3Id, package3);

    return Iter.toArray(packages.vals());
  };

  public func getPackageById(packages : PackagesTypes.Packages, packageId : Text) : async ?PackagesTypes.Package {
    return packages.get(packageId);
  };
};
