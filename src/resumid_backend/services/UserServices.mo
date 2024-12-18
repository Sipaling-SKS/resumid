import UserTypes "../Types/UserTypes";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import UUID "mo:idempotency-keys/idempotency-keys";
import Random "mo:base/Random";
import Int "mo:base/Int";

module UserService {
    public func authenticateUser(
        users: UserTypes.User,  
        userId: Principal,
    ) : async ?UserTypes.UserData {  
        if (Principal.isAnonymous(userId)) {
            return null; 
        };

        switch (users.get(userId)) {
            case (?existingUser) {
                return ?existingUser;  
            };
            case null {
                let entropy = await Random.blob();  
                let uid = UUID.generateV4(entropy);  
                let name = "user-" # uid; 

                let timestamp = Time.now();  
                let createdAt = await Utils.getHumanReadableTime();  

                let role = 1; 

                let newUser: UserTypes.UserData = {
                    id = userId; 
                    name = name;  
                    role = role;  
                    createdAt = createdAt; 
                };

                users.put(userId, newUser);  
                return ?newUser;  
            };
        };
    };
};
