import Random "mo:base/Random";
import UUID "mo:idempotency-keys/idempotency-keys";
import TransactionTypes "../types/TransactionTypes";

module GlobalHelper {
  public func GenerateUUID() : async Text {
    let entropy = await Random.blob();
    let uuid : Text = UUID.generateV4(entropy);

    return uuid;
  };

  public func GetNextEntryNo(tokenEntries : TransactionTypes.TokenEntries, userId : Principal) : Nat {
    switch (tokenEntries.get(userId)) {
      case null {
        return 100;
      };
      case (?entries) {
        if (entries.size() == 0) {
          100;
        } else {
          let last = entries[entries.size() - 1];
          last.entryNo + 100;
        };
      };
    };
  };
};
