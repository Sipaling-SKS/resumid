import TransactionTypes "../types/TransactionTypes";
import UserTypes "../types/UserTypes";
import PackageTypes "../types/PackageTypes";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HttpHelper "../helpers/HttpHelper";
import DateHelper "../helpers/DateHelper";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import GlobalHelper "../helpers/GlobalHelper";

module {
  public func createTransaction(
    transactions : TransactionTypes.Transactions,
    tokenEntries : TransactionTypes.TokenEntries,
    users : UserTypes.User,
    package : PackageTypes.Package,
    from : Principal,
  ) : async Result.Result<TransactionTypes.Transaction, Text> {
    let sender = users.get(from);

    // Validate input
    if (Principal.isAnonymous(from)) {
      return #err("Anonymous principals cannot make donations");
    };
    switch (sender) {
      case (null) { return #err("Sender not found") };
      case (?fromUser) {

        let id = await GlobalHelper.GenerateUUID();
        let tx : TransactionTypes.Transaction = {
          id = id;
          from = fromUser.id;
          amount = package.price;
          package = package.id;
          timestamp = DateHelper.formatTimestamp(Time.now());
        };

        switch (transactions.get(from)) {
          case (null) {
            transactions.put(from, [tx]);
          };
          case (?trans) {
            let updated = Array.append<TransactionTypes.Transaction>(trans, [tx]);
            transactions.put(from, updated);
          };
        };

        let result = addTokenToUserAccount(users, tokenEntries, from, "Positif Adj. from " # package.title, #buy, package.token);

        switch (result) {
          case (#err(msg)) {
            #err(msg);
          };
          case (#ok(msg)) {
            #ok(tx);
          };
        };
      };
    };
  };

  public func addTokenToUserAccount(
    users : UserTypes.User,
    tokenEntries : TransactionTypes.TokenEntries,
    user : Principal,
    description : Text,
    entryType : TransactionTypes.TokenEntryType,
    quantity : Int64,
  ) : Result.Result<Text, Text> {
    switch (users.get(user)) {
      case null {
        #err("User not found");
      };
      case (?u) {
        let updatedUser = {
          u with
          token = u.token + quantity
        };

        Debug.print(debug_show(updatedUser));

        users.put(user, updatedUser);

        createTokenEntry(tokenEntries, user, description, entryType, quantity);
        #ok("Success");
      };
    };
  };

  public func createTokenEntry(tokenEntries : TransactionTypes.TokenEntries, userId : Principal, description : Text, entryType : TransactionTypes.TokenEntryType, quantity : Int64) {
    let entryNo = GlobalHelper.GetNextEntryNo(tokenEntries, userId);
    let newEntry : TransactionTypes.TokenEntry = {
      entryNo = entryNo;
      description = description;
      timestamp = DateHelper.formatTimestamp(Time.now());
      entryType = entryType;
      quantity = quantity;
    };

    switch (tokenEntries.get(userId)) {
      case (null) {
        tokenEntries.put(userId, [newEntry]);
      };
      case (?entries) {
        let updated = Array.append<TransactionTypes.TokenEntry>(entries, [newEntry]);
        tokenEntries.put(userId, updated);
      };
    };
  }

  // private func getAdminPrincipalId() : {
  //   let currBalance = await ledger.transfer({
  //     owner = principalId;
  //     subaccount = null;
  //   });
  //   return currBalance;
  // };
};
