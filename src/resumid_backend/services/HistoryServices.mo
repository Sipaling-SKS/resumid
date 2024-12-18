import Text "mo:base/Text";
import Result "mo:base/Result";
import Random "mo:base/Random";
import Time "mo:base/Time";
import Array "mo:base/Array";
import HistoryTypes "../types/HistoryTypes";
import UUID "mo:idempotency-keys/idempotency-keys";
import DateHelper "../helpers/DateHelper";

module {
  public func addHistory(
    histories : HistoryTypes.Histories,
    userId : Text,
    input : HistoryTypes.AddHistoryInput,
  ) : async Result.Result<HistoryTypes.History, Text> {
    let entropy = await Random.blob();
    let historyId = UUID.generateV4(entropy);

    let timestamp = Time.now();
    let createdAt = DateHelper.formatTimestamp(timestamp);

    // Create the new History entry
    let newHistory : HistoryTypes.History = {
      userId = userId;
      historyId = historyId;
      fileName = input.fileName;
      summary = input.summary;
      score = input.score;
      strengths = input.strengths;
      weaknesses = input.weaknesses;
      gaps = input.gaps;
      suggestions = input.suggestions;
      createdAt = createdAt;
    };

    // Add history to the user's history list
    switch (histories.get(userId)) {
      case null {
        histories.put(userId, [newHistory]);
      };
      case (?existingHistories) {
        histories.put(userId, Array.append([newHistory], existingHistories));
      };
    };

    return #ok(newHistory);
  };

  public func getHistories(histories : HistoryTypes.Histories, userId : Text) : Result.Result<[HistoryTypes.History], Text> {
    switch (histories.get(userId)) {
      case null {
        return #err("No analysis records found. Please upload a resume for analysis.");
      };
      case (?userHistories) {
        if (Array.size(userHistories) == 0) {
          return #err("You have no history records. Please analyze a resume to generate history.");
        };
        return #ok(userHistories);
      };
    };
  };

  public func getHistoryById(
    histories : HistoryTypes.Histories,
    userId : Text,
    historyId : Text,
  ) : Result.Result<HistoryTypes.History, Text> {
    switch (histories.get(userId)) {
      case null { return #err("No analysis records found for your account.") };
      case (?userHistories) {
        for (history in userHistories.vals()) {
          if (history.historyId == historyId) {
            return #ok(history);
          };
        };
        return #err("No record found with the analysis ID: " # historyId # ". Please check and try again.");
      };
    };
  };

  public func deleteHistory(
    histories : HistoryTypes.Histories,
    userId : Text,
    historyId : Text,
  ) : Result.Result<Text, Text> {
    switch (histories.get(userId)) {
      case null {
        return #err("You don't have any analysis records yet. Please upload a resume for analysis.");
      };
      case (?userHistories) {
        let updatedHistories = Array.filter<HistoryTypes.History>(
          userHistories,
          func(history : HistoryTypes.History) : Bool {
            history.historyId != historyId;
          },
        );

        if (Array.size(userHistories) == Array.size(updatedHistories)) {
          return #err("No record found for the specified analysis ID. Please check and try again.");
        };

        histories.put(userId, updatedHistories);
        #ok("The resume analysis record has been successfully deleted.");
      };
    };
  };
};
