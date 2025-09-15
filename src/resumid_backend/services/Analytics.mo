import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

// Assuming you have your types imported
import TransactionTypes "../types/TransactionTypes";
import PackageTypes "../types/PackageTypes";
import UserTypes "../types/UserTypes";

module Analytics {

  public func getTotalMembers(users : UserTypes.User) : Int64 {
    var count : Int64 = 0;
    for ((_, userData) in users.entries()) {
      switch (userData.role) {
        case (#user) { count += 1 };
        case _ {}; // role lain di-skip
      };
    };
    return count;
  };

  public func getPackagePurchaseDataCached(
    transactions : TransactionTypes.Transactions,
    packages : PackageTypes.Packages,
  ) : TransactionTypes.PackagePurchaseData {
    let packageStats = HashMap.HashMap<Text, { purchases : Int64; amount : Nat }>(10, Text.equal, Text.hash);
    let packageNameCache = HashMap.HashMap<Text, Text>(10, Text.equal, Text.hash);

    for ((principal, userTransactions) in transactions.entries()) {
      for (transaction in userTransactions.vals()) {
        let packageId = transaction.package;

        if (packageNameCache.get(packageId) == null) {
          let packageName = switch (packages.get(packageId)) {
            case (?pkg) { pkg.title };
            case null { packageId };
          };
          packageNameCache.put(packageId, packageName);
        };

        switch (packageStats.get(packageId)) {
          case (?existing) {
            packageStats.put(
              packageId,
              {
                purchases = existing.purchases + 1;
                amount = existing.amount + transaction.amount;
              },
            );
          };
          case null {
            packageStats.put(
              packageId,
              {
                purchases = 1;
                amount = transaction.amount;
              },
            );
          };
        };
      };
    };

    let packageDataArray = Array.map<(Text, { purchases : Int64; amount : Nat }), TransactionTypes.PackageData>(
      Iter.toArray(packageStats.entries()),
      func((packageId, stats)) : TransactionTypes.PackageData {
        let packageName = switch (packageNameCache.get(packageId)) {
          case (?name) { name };
          case null { packageId }; // This shouldn't happen
        };

        {
          package = packageName;
          totalPurchases = stats.purchases;
          totalAmount = stats.amount;
        };
      },
    );

    packageDataArray;
  };

  // public func getMonthlyAnalyzeData(tokenEntries : TransactionTypes.TokenEntries) : TransactionTypes.MonthlyAnalyzeDataArray {
  //   let monthlyStats = HashMap.HashMap<Text, { quantity : Int64 }>(12, Text.equal, Text.hash);
  //   for ((principal, userEntries) in tokenEntries.entries()) {
  //     for (entry in userEntries.vals()) {
  //       switch (entry.entryType) {
  //         case (#analyze) {

  //           let parts = Text.split(entry.timestamp, #char '-');
  //           let partsArray = Iter.toArray(parts);
  //           let month = if (partsArray.size() >= 2) {
  //             partsArray[0] # "-" # partsArray[1];
  //           } else {
  //             "unknown";
  //           };

  //           switch (monthlyStats.get(month)) {
  //             case (?existing) {
  //               monthlyStats.put(
  //                 month,
  //                 {
  //                   quantity = existing.quantity + entry.quantity;
  //                 },
  //               );
  //             };
  //             case null {
  //               monthlyStats.put(
  //                 month,
  //                 {
  //                   quantity = entry.quantity;
  //                 },
  //               );
  //             };
  //           };
  //         };
  //         case (_) {};
  //       };
  //     };
  //   };

  //   let monthlyDataArray = Array.map<(Text, { quantity : Int64 }), TransactionTypes.MonthlyAnalyzeData>(
  //     Iter.toArray(monthlyStats.entries()),
  //     func((month, stats)) : TransactionTypes.MonthlyAnalyzeData {
  //       {
  //         month = month;
  //         totalQuantity = stats.quantity;
  //       };
  //     },
  //   );

  //   Array.sort<TransactionTypes.MonthlyAnalyzeData>(
  //     monthlyDataArray,
  //     func(a, b) {
  //       Text.compare(a.month, b.month);
  //     },
  //   );
  // };

  public func getMonthlyAnalyzeData(tokenEntries : TransactionTypes.TokenEntries) : TransactionTypes.MonthlyAnalyzeDataArray {
    let monthlyStats = HashMap.HashMap<Text, Int64>(12, Text.equal, Text.hash);

    for ((principal, userEntries) in tokenEntries.entries()) {
      for (entry in userEntries.vals()) {
        switch (entry.entryType) {
          case (#analyze) {
            let parts = Text.split(entry.timestamp, #char '-');
            let partsArray = Iter.toArray(parts);
            let month = if (partsArray.size() >= 2) {
              partsArray[0] # "-" # partsArray[1];
            } else {
              "unknown";
            };

            switch (monthlyStats.get(month)) {
              case (?existing) {
                monthlyStats.put(month, existing + entry.quantity);
              };
              case null {
                monthlyStats.put(month, entry.quantity);
              };
            };
          };
          case (_) {};
        };
      };
    };

    let monthlyDataArray = Array.map<(Text, Int64), TransactionTypes.MonthlyAnalyzeData>(
      Iter.toArray(monthlyStats.entries()),
      func((month, quantity)) : TransactionTypes.MonthlyAnalyzeData {
        {
          month = month;
          totalQuantity = quantity;
        };
      },
    );

    Array.sort<TransactionTypes.MonthlyAnalyzeData>(
      monthlyDataArray,
      func(a, b) {
        Text.compare(a.month, b.month);
      },
    );
  };
};
