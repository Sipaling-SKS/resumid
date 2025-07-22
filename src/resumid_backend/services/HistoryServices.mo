import Text "mo:base/Text";
import Result "mo:base/Result";
import Random "mo:base/Random";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import HistoryTypes "../types/HistoryTypes";
import UUID "mo:idempotency-keys/idempotency-keys";
import DateHelper "../helpers/DateHelper";
import Order "mo:base/Order";
import Iter "mo:base/Iter";
import Option "mo:base/Option";


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
      jobTitle = input.jobTitle;
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


  public func getHistoriesPaginated(
  histories : HistoryTypes.Histories,
  userId : Text,
  page : Nat,
  pageSize : Nat,
  sortBys : ?[(Text, Bool)],
  filterBys : ?[(Text, Text)],
  globalFilter : Text,
  ) : Result.Result<HistoryTypes.PaginatedResult, Text> {

    if (pageSize == 0) {
      return #err("Page size must be greater than 0.");
    };

    let allHistories = switch (histories.get(userId)) {
      case null { return #err("No records found."); };
      case (?hs) {
        var h = hs;
        switch (filterBys) {
          case null {};
          case (?filters) {
            for ((field, keyword) in filters.vals()) {
              h := Array.filter<HistoryTypes.History>(h, func(hist) {
                switch (field) {
                  case ("fileName") { Text.contains(hist.fileName, #text keyword) };
                  case ("jobTitle") { Text.contains(hist.jobTitle, #text keyword) };
                  case ("historyId") { Text.contains(hist.historyId, #text keyword) };
                  case _ { true };
                }
              });
            };
          };
        };

          switch (sortBys) {
          case null {};
          case (?sortFields) {
            h := Array.sort<HistoryTypes.History>(h, func(a, b) : Order.Order {
              for ((field, desc) in sortFields.vals()) {
                let cmp = switch (field) {
                  case ("createdAt") {
                    if (a.createdAt < b.createdAt) { -1 }
                    else if (a.createdAt > b.createdAt) { 1 }
                    else { 0 }
                  };
                  case ("score") {
                    if (a.score < b.score) { -1 }
                    else if (a.score > b.score) { 1 }
                    else { 0 }
                  };
                  case _ { 0 };
                };

                if (cmp != 0) {
                  return if (desc) {
                    if (cmp < 0) { #greater } else { #less }
                  } else {
                    if (cmp < 0) { #less } else { #greater }
                  };
                };
              };
              return #equal;
            });
          };
        };

        if (globalFilter != "") {
          let lower = Text.toLowercase(globalFilter);
          h := Array.filter<HistoryTypes.History>(h, func(hist) {
            Text.contains(Text.toLowercase(hist.fileName), #text lower)
            or Text.contains(Text.toLowercase(hist.jobTitle), #text lower)
            or Text.contains(Text.toLowercase(hist.historyId), #text lower)
            or Text.contains(Text.toLowercase(hist.summary), #text lower)
            or Option.isSome(Array.find(hist.strengths, func(x: Text) : Bool = Text.contains(Text.toLowercase(x),#text lower)))
            or Option.isSome(Array.find(hist.weaknesses, func(x: Text) : Bool = Text.contains(Text.toLowercase(x),#text lower)))
            or Option.isSome(Array.find(hist.gaps, func(x: Text) : Bool = Text.contains(Text.toLowercase(x),#text lower)))
            or Option.isSome(Array.find(hist.suggestions, func(x: Text) : Bool = Text.contains(Text.toLowercase(x),#text lower)))
                      
          });
          // let lower = Text.trim(Text.toLowercase(globalFilter));

          // h := Array.filter<HistoryTypes.History>(h, func(hist) {
          //   Text.contains(Text.trim(Text.toLowercase(hist.fileName)), #text lower)
          //   or Text.contains(Text.trim(Text.toLowercase(hist.jobTitle)), #text lower)
          //   or Text.contains(Text.trim(Text.toLowercase(hist.historyId)), #text lower)
          //   or Text.contains(Text.trim(Text.toLowercase(hist.summary)), #text lower)
          //   or Option.isSome(Array.find(hist.strengths, func(x: Text) : Bool = Text.contains(Text.trim(Text.toLowercase(x)),#text lower)))
          //   or Option.isSome(Array.find(hist.weaknesses, func(x: Text) : Bool = Text.contains(Text.trim(Text.toLowercase(x)),#text lower)))
          //   or Option.isSome(Array.find(hist.gaps, func(x: Text) : Bool = Text.contains(Text.trim(Text.toLowercase(x)),#text lower)))
          //   or Option.isSome(Array.find(hist.suggestions, func(x: Text) : Bool = Text.contains(Text.trim(Text.toLowercase(x)),#text lower)))
          // });
        
        

        };
       

             


        let total = h.size();
        let startIdx = page * pageSize;
        let endIdx = if (startIdx + pageSize < total) startIdx + pageSize else total; 
        let sliced : [HistoryTypes.History] = if (startIdx >= total) ([] : [HistoryTypes.History]) else Iter.toArray(Array.slice(h, startIdx, endIdx));
        let totalPages = (total + pageSize - 1) / pageSize;

        return #ok({
          totalRowCount = total;
          totalPages = totalPages;
          currentPage = page;
          pageSize = pageSize;
          data = sliced;
        });
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