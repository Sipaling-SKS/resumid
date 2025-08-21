// import TransactionTypes "../types/TransactionTypes";
// import UserTypes "../types/UserTypes";
// import PackageTypes "../types/PackageTypes";
// import Result "mo:base/Result";
// import UserServices "UserServices";
// import Principal "mo:base/Principal";
// import Time "mo:base/Time";
// import HttpHelper "../helpers/HttpHelper";

// module {
//   private func createTransaction(
//     transactions : TransactionTypes.Transactions,
//     users : UserTypes.User,
//     from : Principal,
//     selectedPackage : PackageTypes.Packages,
//     amount : Nat,
//   ) : async Result.Result<TransactionTypes.Transaction, Text> {
//     let sender = users.get(from);
//     let recipient = users.get(to);
//     let balance = await UserServices.getBalance(from);

//     // Validate input
//     if (Principal.isAnonymous(from)) {
//       return #err("Anonymous principals cannot make donations");
//     };

//     switch (sender, recipient) {
//       case (null, _) { return #err("Sender not found") };
//       case (_, null) { return #err("Receiver not found") };
//       case (?fromUser, ?toUser) {
//         if (balance < amount) {
//           return #err("Insufficient balance");
//         };

//         let id = await HttpHelper._generateIdempotencyKey();
//         let tx : TransactionTypes.Transaction = {
//           id = id;
//           from = fromUser.id;
//           to = toUser.id;
//           amount = amount;
//           package = selectedPackage;
//           timestamp = Time.now();
//         };

//         transactions.put(Principal.fromText(id), tx);

//         return #ok(tx);
//       };
//     };
//   };

//   // private func getAdminPrincipalId() : {
//   //   let currBalance = await ledger.transfer({
//   //     owner = principalId;
//   //     subaccount = null;
//   //   });
//   //   return currBalance;
//   // };
// };
