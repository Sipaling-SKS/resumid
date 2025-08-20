import UserTypes "../types/UserTypes";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import UUID "mo:idempotency-keys/idempotency-keys";
import Random "mo:base/Random";
import Int "mo:base/Int";
import Result "mo:base/Result";
import DateHelper "../helpers/DateHelper";

module UserService {
  public func authenticateUser(
    users : UserTypes.User,
    depositAddr: Text,
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

        let newUser : UserTypes.UserData = {
          id = userId;
          name = name;
          role = #user;
          depositAddr = depositAddr;
          token = 3;
          createdAt = createdAt;
        };

        // Create new user data
        users.put(userId, newUser);

        return #ok(newUser);
      };
    };
  };

  // public func getBalance(principalId: Principal) : async Nat {
  //   let currBalance = await ledger.icrc1_balance_of({
  //     owner = principalId;
  //     subaccount = null;
  //   });
  //   return currBalance;
  // };
};
