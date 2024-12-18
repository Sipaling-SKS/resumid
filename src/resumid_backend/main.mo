import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Debug "mo:base/Debug";


// import HistoryTypes "types/HistoryTypes";
// import HistoryServices "services/HistoryServices";
import UserTypes "types/UserTypes";
import UserServices "services/UserServices";

actor Resumid {
  // private var histories : HistoryTypes.Histories = HashMap.HashMap<Text, [HistoryTypes.History]>(
  //   10, Text.equal, Text.hash
  // );
  private var users : HashMap.HashMap<Principal, UserTypes.UserData> = HashMap.HashMap(0, Principal.equal, Principal.hash);


  // TODO: Change 'getUserId' to use II fetched from Front-End
  private func getUserId() : Text {
    return Principal.toText(Principal.fromActor(Resumid));
  };

  // public func addHistory(input : HistoryTypes.AddHistoryInput) : async HistoryTypes.History {
  //   let userId = getUserId();
  //   return await HistoryServices.addHistory(
  //     histories,
  //     userId,
  //     input.summary,
  //     input.score,
  //     input.strengths,
  //     input.weaknesses,
  //     input.gaps,
  //     input.suggestions
  //   );
  // };

  // public query func getHistories() : async [HistoryTypes.History] {
  //   let userId = getUserId();
  //   HistoryServices.getHistories(histories, userId);
  // };

  // public query func getHistoryById(input : HistoryTypes.HistoryIdInput) : async ?HistoryTypes.History {
  //   let userId = getUserId();
  //   HistoryServices.getHistoryById(histories, userId, input.historyId);
  // };

  // public func deleteHistory(input : HistoryTypes.HistoryIdInput) : async Result.Result<Text, Text> {
  //   let userId = getUserId();
  //   HistoryServices.deleteHistory(histories, userId, input.historyId);
  // };


  //user
  public shared(msg) func whoami() : async Principal {
    Debug.print("Caller Principal: " # Principal.toText(msg.caller));  
    return msg.caller;
  };

  public shared(msg) func authenticateUser() : async ?UserTypes.UserData { // Convert Principal to Text
    return await UserServices.authenticateUser(users, msg.caller); 
  };

  public shared(msg) func getUserById(userId : Principal) : async ?UserTypes.UserData {
    return users.get(userId); 
  };

  
};
