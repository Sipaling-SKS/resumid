import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import GptTypes "types/GptTypes";
import GptServices "services/GptServices";
import HistoryTypes "types/HistoryTypes";
import HistoryServices "services/HistoryServices";
import UserTypes "types/UserTypes";
import UserServices "services/UserServices";

actor Resumid {
  // Analyze History type
  private var histories : HistoryTypes.Histories = HashMap.HashMap<Text, [HistoryTypes.History]>(0, Text.equal, Text.hash);

  // TODO: Change 'getUserId' to use II fetched from Front-End
  private func getUserId() : Text {
    return Principal.toText(Principal.fromActor(Resumid));
  };

  public func addHistory(input : HistoryTypes.AddHistoryInput) : async HistoryTypes.History {
    let userId = getUserId();
    return await HistoryServices.addHistory(
      histories,
      userId,
      input.summary,
      input.score,
      input.strengths,
      input.weaknesses,
      input.gaps,
      input.suggestions
    );
  };

  public query func getHistories() : async [HistoryTypes.History] {
    let userId = getUserId();
    HistoryServices.getHistories(histories, userId);
  };

  public query func getHistoryById(input : HistoryTypes.HistoryIdInput) : async ?HistoryTypes.History {
    let userId = getUserId();
    HistoryServices.getHistoryById(histories, userId, input.historyId);
  };

  public shared (msg) func deleteHistory(input : HistoryTypes.HistoryIdInput) : async Result.Result<Text, Text> {
    let userId = Principal.toText(msg.caller);
    HistoryServices.deleteHistory(histories, userId, input.historyId);
  };


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

  
  
  public shared func AnalyzeResume(resumeContent : Text, jobTitle : Text, jobDescription : Text) : async ?GptTypes.AnalyzeStructure {
      let analyzeResult = await GptServices.AnalyzeResume(resumeContent, jobTitle, jobDescription);
      Debug.print(debug_show(analyzeResult));
      analyzeResult;
  };
};
