import Text "mo:base/Text";
import Result "mo:base/Result";
import Random "mo:base/Random";
import Time "mo:base/Time";
import Array "mo:base/Array";
import HistoryTypes "../types/HistoryTypes";
import UUID "mo:idempotency-keys/idempotency-keys";
import LocalDateTime "mo:datetime/LocalDateTime";

module {
  public func addHistory(
    histories : HistoryTypes.Histories,
    userId : Text,
    summary : Text,
    score : Int,
    strengths : Text,
    weaknesses : Text,
    gaps : Text,
    suggestions : Text,
  ) : async HistoryTypes.History {
    let entropy = await Random.blob();
    let historyId = UUID.generateV4(entropy);

    let timestamp = Time.now();
    let timeZone = #fixed(#hours(7));
    let localDateTime = LocalDateTime.fromTime(timestamp, timeZone);
    let createdAt = LocalDateTime.toTextFormatted(
      localDateTime,
      #iso
    );

    // Create the new History entry
    let newHistory : HistoryTypes.History = {
      userId = userId;
      historyId = historyId;
      summary = summary;
      score = score;
      strengths = strengths;
      weaknesses = weaknesses;
      gaps = gaps;
      suggestions = suggestions;
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

    return newHistory;
  };

  public func getHistories(histories : HistoryTypes.Histories, userId : Text) : [HistoryTypes.History] {
    switch (histories.get(userId)) {
      case null { [] };
      case (?userHistories) { userHistories };
    };
  };

  public func getHistoryById(
    histories : HistoryTypes.Histories,
    userId : Text,
    historyId : Text,
  ) : ?HistoryTypes.History {
    switch (histories.get(userId)) {
      case null { null };
      case (?userHistories) {
        for (history in userHistories.vals()) {
          if (history.historyId == historyId) {
            return ?history;
          };
        };
        null;
      };
    };
  };

  public func deleteHistory(
    histories : HistoryTypes.Histories,
    userId : Text,
    historyId : Text,
  ) : Result.Result<Text, Text> {
    switch (histories.get(userId)) {
      case null { return #err("User not found") };
      case (?userHistories) {
        // Explicitly specify the type for the history variable
        let updatedHistories = Array.filter<HistoryTypes.History>(
          userHistories,
          func(history : HistoryTypes.History) : Bool {
            history.historyId != historyId;
          },
        );

        if (Array.size(userHistories) == Array.size(updatedHistories)) {
          return #err("History not found");
        };

        histories.put(userId, updatedHistories);
        #ok("History successfully deleted");
      };
    };
  };
};
