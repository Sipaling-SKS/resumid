import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Text "mo:base/Text";
import HistoryTypes "types/HistoryTypes";
import HistoryServices "services/HistoryServices";

actor Resumid {
  // Analyze History type
  private var histories : HistoryTypes.Histories = HashMap.HashMap<Text, [HistoryTypes.History]>(
    50,
    Text.equal,
    Text.hash,
  );

  // TODO: Change 'getUserId' to use II fetched from Front-End
  private func getUserId() : Text {
    return Principal.toText(Principal.fromActor(Resumid));
  };

  // Auth related method

  // Resume Analyzer related method

  // Analyze History related method
  public func addHistory(input : HistoryTypes.AddHistoryInput) : async Result.Result<HistoryTypes.History, Text> {
    let userId = getUserId();
    await HistoryServices.addHistory(
      histories,
      userId,
      input.fileName,
      input.summary,
      input.score,
      input.strengths,
      input.weaknesses,
      input.gaps,
      input.suggestions,
    );
  };

  public query func getHistories() : async Result.Result<[HistoryTypes.History], Text> {
    let userId = getUserId();
    HistoryServices.getHistories(histories, userId);
  };

  public query func getHistoryById(input : HistoryTypes.HistoryIdInput) : async Result.Result<HistoryTypes.History, Text> {
    let userId = getUserId();
    HistoryServices.getHistoryById(histories, userId, input.historyId);
  };

  public func deleteHistory(input : HistoryTypes.HistoryIdInput) : async Result.Result<Text, Text> {
    let userId = getUserId();
    HistoryServices.deleteHistory(histories, userId, input.historyId);
  };
};
