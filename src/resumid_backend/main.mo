import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Text "mo:base/Text";
import HistoryTypes "types/HistoryTypes";
import HistoryServices "services/HistoryServices";

actor Resumid {
 private var histories : HistoryTypes.Histories = HashMap.HashMap<Text, [HistoryTypes.History]>(
    10, Text.equal, Text.hash
  );

  // TODO: Change II fetched from Front-End
  private func getUserId() : Text {
    return Principal.toText(Principal.fromActor(Resumid)); // Use 'this' instead of 'Resumid'
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

  public func deleteHistory(input : HistoryTypes.HistoryIdInput) : async Result.Result<Text, Text> {
    let userId = getUserId();
    HistoryServices.deleteHistory(histories, userId, input.historyId);
  };
};
