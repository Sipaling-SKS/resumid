import UserTypes "../types/UserTypes";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import UUID "mo:idempotency-keys/idempotency-keys";
import Random "mo:base/Random";
import Result "mo:base/Result";
import DateHelper "../helpers/DateHelper";
import TransactionTypes "../types/TransactionTypes";
import ledger "canister:icp_ledger_canister";
import TransactionServices "TransactionServices";

module UserService {
  public func authenticateUser(
    users : UserTypes.User,
    tokenEntries : TransactionTypes.TokenEntries,
    depositAddr : Text,
    userId : Principal,
  ) : async Result.Result<UserTypes.UserData, Text> {
    if (Principal.isAnonymous(userId)) {
      return #err("Anonymous users are not allowed to authenticate.");
    };

    switch (users.get(userId)) {
      case (?existingUser) {
        return #ok(existingUser);
      };
      case null {
        let entropy = await Random.blob();
        let uid = UUID.generateV4(entropy);
        let name = "user-" # uid;

        let timestamp = Time.now();
        let createdAt = DateHelper.formatTimestamp(timestamp);
        let qtyToken: Int64 = 3;

        let newUser : UserTypes.UserData = {
          id = userId;
          name = name;
          role = #user;
          depositAddr = depositAddr;
          token = qtyToken;
          createdAt = createdAt;
        };

        TransactionServices.createTokenEntry(tokenEntries, userId, "Initial trial token", #initial, qtyToken);

        // Create new user data
        users.put(userId, newUser);

        return #ok(newUser);
      };
    };
  };

  public func getBalance(principalId : Principal) : async Nat {
    let currBalance = await ledger.icrc1_balance_of({
      owner = principalId;
      subaccount = null;
    });
    return currBalance;
  };
};
