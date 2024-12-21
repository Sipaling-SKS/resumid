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
        users: UserTypes.User,
        userId: Principal,
    ) : async Result.Result<UserTypes.UserData, Text> { // Menggunakan Result.Result
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

                let role = 1;

                let newUser: UserTypes.UserData = {
                    id = userId;
                    name = name;
                    role = role;
                    createdAt = createdAt;
                };

                users.put(userId, newUser); // Tambahkan pengguna baru
                return #ok(newUser); // Berhasil: kembalikan data pengguna baru
            };
        };
    };
};
