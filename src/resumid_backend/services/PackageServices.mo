import PackagesTypes "../types/PackageTypes";
import HttpHelper "../helpers/HttpHelper";
import Iter "mo:base/Iter";

module PackageServices {
  public func initDefaultPackage(
    packages : PackagesTypes.Packages
  ) : async [PackagesTypes.Package] {
    let result: [PackagesTypes.Package] = [];

    let package1 : PackagesTypes.Package = {
      title = "Starter";
      subtitle = "For individuals";
      price = 0;
      token = 0;
      description = [
        "Includes a summary of strengths and areas for improvement.",
        "Limited to only 3 resume analysis.",
      ];
    };

    let package1Id = await HttpHelper._generateIdempotencyKey();
    packages.put(package1Id, package1);

    let package2 : PackagesTypes.Package = {
      title = "Pro";
      subtitle = "For small teams";
      price = 5;
      token = 15;
      description = [
        "Everything in Starter.",
        "Unlimited analysis, detailed reports, and job-specific recommendations.",
      ];
    };

    let package2Id = await HttpHelper._generateIdempotencyKey();
    packages.put(package2Id, package2);

    let package3 : PackagesTypes.Package = {
      title = "Enterprise";
      subtitle = "For organization";
      price = 10;
      token = 30;
      description = [
        "Everything included in Pro Tier",
        "Bulk analysis, custom AI models, and dedicated support.",
      ];
    };

    let package3Id = await HttpHelper._generateIdempotencyKey();
    packages.put(package3Id, package3);

    return Iter.toArray(packages.vals());
  };
};
