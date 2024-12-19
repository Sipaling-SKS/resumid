import UserTypes "../types/UserTypes";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import UUID "mo:idempotency-keys/idempotency-keys";
import Random "mo:base/Random";
import DateHelper "../helpers/DateHelper";

module UserService {
    public func authenticateUser(
        users: UserTypes.User,  
        userId: Principal,
    ) : async ?UserTypes.UserData {  
        if (Principal.isAnonymous(userId)) {
            return null; 
        };
        let entropy = await Random.blob();  
                let uid = UUID.generateV4(entropy);  
                let name = "user-" # uid; 

                let timestamp = Time.now();
                // let createdAt = await Utils.getHumanReadableTime();
                let createdAt = DateHelper.formatTimestamp(timestamp);

                let role = 1; 

                let newUser: UserTypes.UserData = {
                    id = userId; 
                    name = name;  
                    role = role;  
                    createdAt = createdAt; 
                };

        switch (users.get(userId)) {
            case (?existingUser) {
                return ?existingUser;  
            };
            case null {
                users.put(userId, newUser);  
                return ?newUser;  
            };
        };
    };
};
