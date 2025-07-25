<<<<<<< Updated upstream
import Text "mo:base/Text";
import Result "mo:base/Result";
import Random "mo:base/Random";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import HistoryTypes "../types/HistoryTypes_new";
import UUID "mo:idempotency-keys/idempotency-keys";
import DateHelper "../helpers/DateHelper";
import Order "mo:base/Order";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Int "mo:base/Int";
import Debug "mo:base/Debug";
import Float "mo:base/Float";




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

    let newHistory : HistoryTypes.History = {
        userId = userId;
        historyId = historyId;
        fileName = input.fileName;
        jobTitle = input.jobTitle;
        summary = input.summary;
        conclusion = input.conclusion;
        content = input.content;
        createdAt = createdAt;
    };

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
        case null { 
          return #ok({
            totalRowCount = 0;
            totalPages = 0;
            currentPage = page;
            pageSize = pageSize;
            data = [];
        });
         };
        case (?hs) {
        var h = hs;

        // === Filter by Specific Fields ===
        switch (filterBys) {
        case null {};
        case (?filters) {
            for ((field, keyword) in filters.vals()) {
            h := Array.filter<HistoryTypes.History>(h, func(hist) {
                switch (field) {
                case ("fileName") {
                    Text.contains(hist.fileName, #text keyword)
                };
                case ("jobTitle") {
                    Text.contains(hist.jobTitle, #text keyword)
                };
                case _ {
                    true
                };
                }
            });
            };
        };
        };


        // === Sorting ===
      //  switch (sortBys) {
      //   case null {};
      //   case (?sortFields) {
      //       h := Array.sort<HistoryTypes.History>(h, func(a: HistoryTypes.History, b: HistoryTypes.History) : Order.Order {
      //       for ((field, desc) in sortFields.vals()) {

      //           let cmp : Int = switch (field) {
      //           case ("createdAt") {
      //               if (a.createdAt < b.createdAt) { -1 }
      //               else if (a.createdAt > b.createdAt) { 1 }
      //               else { 0 }
      //           };

      //           case ("score") {
      //               let scoreA : Int = switch (Array.find(a.content, func(c: HistoryTypes.ContentItem) : Bool {
      //               c.title == "Header"
      //               })) {
      //               case null { 0 };
      //               case (?c) { c.value.score };
      //               };

      //               let scoreB : Int = switch (Array.find(b.content, func(c: HistoryTypes.ContentItem) : Bool {
      //               c.title == "Header"
      //               })) {
      //               case null { 0 };
      //               case (?c) { c.value.score };
      //               };

      //               if (scoreA < scoreB) { -1 }
      //               else if (scoreA > scoreB) { 1 }
      //               else { 0 }
      //           };

      //           case _ { 0 };
      //           };

      //           if (cmp != 0) {
      //           return if (desc) {
      //               if (cmp < 0) { #greater } else { #less }
      //           } else {
      //               if (cmp < 0) { #less } else { #greater }
      //           };
      //           };
      //       };
      //       return #equal;
      //       });
      //   };
      //   };

      // === Sorting ===
      // switch (sortBys) {
      //   case null {};
      //   case (?sortFields) {
      //     h := Array.sort<HistoryTypes.History>(h, func(a: HistoryTypes.History, b: HistoryTypes.History) : Order.Order {
      //       for ((field, desc) in sortFields.vals()) {
      //         let cmp : Int = switch (field) {
      //           case ("score") {
      //             let scoreA : Int = switch (Array.find(a.content, func(c: HistoryTypes.ContentItem) : Bool {
      //               c.title == "Header"
      //             })) {
      //               case null { 0 };
      //               case (?c) { c.value.score };
      //             };

      //             let scoreB : Int = switch (Array.find(b.content, func(c: HistoryTypes.ContentItem) : Bool {
      //               c.title == "Header"
      //             })) {
      //               case null { 0 };
      //               case (?c) { c.value.score };
      //             };

      //             if (scoreA < scoreB) { -1 }
      //             else if (scoreA > scoreB) { 1 }
      //             else { 0 }
      //           };

      //           case ("createdAt") {
      //             if (a.createdAt < b.createdAt) { -1 }
      //             else if (a.createdAt > b.createdAt) { 1 }
      //             else { 0 }
      //           };

      //           // Add more sort fields here if needed
      //           case _ { 0 };
      //         };

      //         if (cmp != 0) {
      //           return if (desc) {
      //             if (cmp < 0) { #greater } else { #less }
      //           } else {
      //             if (cmp < 0) { #less } else { #greater }
      //           };
      //         };
      //       };

      //       return #equal; // all fields equal
      //     });
      //   };
      // };
      switch (sortBys) {
      case null {};
      case (?sortFields) {
        h := Array.sort<HistoryTypes.History>(h, func(a: HistoryTypes.History, b: HistoryTypes.History) : Order.Order {
          for ((field, desc) in sortFields.vals()) {
            let cmp : Int = switch (field) {
              case ("score") {
                let scoreA = a.summary.score;
                let scoreB = b.summary.score;

                if (scoreA < scoreB) { -1 }
                else if (scoreA > scoreB) { 1 }
                else { 0 }
              };

              case ("createdAt") {
                if (a.createdAt < b.createdAt) { -1 }
                else if (a.createdAt > b.createdAt) { 1 }
                else { 0 }
              };

              // Tambahkan field lain di sini kalau diperlukan
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




        // === Global Filter ===
        if (globalFilter != "") {
        let lower = Text.toLowercase(globalFilter);
        h := Array.filter<HistoryTypes.History>(h, func(hist) {
            Text.contains(Text.toLowercase(hist.fileName), #text lower)
            or Text.contains(Text.toLowercase(hist.jobTitle), #text lower)
            or Text.contains(Text.toLowercase(hist.historyId), #text lower)
            or Text.contains(Text.toLowercase(hist.summary.value), #text lower)
            or Option.isSome(Array.find(hist.content, func(c: HistoryTypes.ContentItem) : Bool {
            Text.contains(Text.toLowercase(c.title), #text lower)
            or Text.contains(Text.toLowercase(c.value.strength), #text lower)
            or Text.contains(Text.toLowercase(c.value.weaknesess), #text lower)
            or Option.isSome(Array.find(c.value.feedback, func(fb: HistoryTypes.Feedback) : Bool {
                return Text.contains(Text.toLowercase(fb.feedback_message), #text lower)
                or Text.contains(Text.toLowercase(fb.revision_example), #text lower);
            }));
            }));
        });
        };

        let total = h.size();
        let startIdx = page * pageSize;
        let endIdx = if (startIdx + pageSize < total) startIdx + pageSize else total;
        let sliced : [HistoryTypes.History] =
            if (startIdx >= total) ([] : [HistoryTypes.History])
            else Iter.toArray(Array.slice(h, startIdx, endIdx));

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
    ) : Result.Result<HistoryTypes.HistoryOutput, Text> {
    switch (histories.get(userId)) {
        case null { return #err("No analysis records found for your account.") };
        case (?userHistories) {
        for (history in userHistories.vals()) {
            if (history.historyId == historyId) {
            return #ok({
                fileName = history.fileName;
                jobTitle = history.jobTitle;
                summary = history.summary;
                conclusion = history.conclusion;
                content = history.content;
                createdAt = history.createdAt;
                userId = history.userId;
                historyId = history.historyId;
            });

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
      return #err("No analysis records found for your account. Please upload a resume first.");
    };
    case (?userHistories) {
      // Filter out the history with the specified ID
      let updatedHistories = Array.filter<HistoryTypes.History>(
        userHistories,
        func(history : HistoryTypes.History) : Bool {
          history.historyId != historyId;
        },
      );

      if (Array.size(userHistories) == Array.size(updatedHistories)) {
        return #err("No record found with the analysis ID: " # historyId # ". Please check and try again.");
      };

      histories.put(userId, updatedHistories);
      return #ok("Resume analysis with ID: " # historyId # " has been successfully deleted.");
    };
  };
};

//  public func addDummyHistoriesSync(histories: HistoryTypes.Histories, userId: Text) {
//   for (i in Iter.range(1, 10)) {
//     let dummyFeedback: HistoryTypes.Feedback = {
//       feedback_message = "Improve summary clarity.";
//       revision_example = "Add quantifiable achievements.";
//     };

//     let dummyValue: HistoryTypes.Value = {
//       feedback = [dummyFeedback];
//       pointer = ["summary"];
//       score = 80 + (i % 10);
//       strength = "Well-structured";
//       weaknesess = "Too generic";
//     };

//     let dummyContentItem: HistoryTypes.ContentItem = {
//       title = "Summary Section";
//       value = dummyValue;
//     };

//     let dummyConclusion: HistoryTypes.Conclusion = {
//       career_recomendation = ["Backend Developer", "Software Engineer"];
//       keyword_matching = ["Node.js", "React"];
//       section_to_add = ["Projects"];
//       section_to_remove = ["Objective"];
//     };
//     let timestamp = Time.now();
//     let dummyHistory: HistoryTypes.History = {
//       userId = userId;
//       historyId = "dummy-" # Nat.toText(i); // atau generate UUID jika tersedia
//       fileName = "CV_Dummy_" # Nat.toText(i) # ".pdf";
//       jobTitle = "Software Engineer " # Nat.toText(i);
//       summary = {
//         score = 85.0;
//         value = "This is a dummy summary";
//       };
//       conclusion = dummyConclusion;
//       content = [dummyContentItem];
//       createdAt = DateHelper.formatTimestamp(timestamp); // atau Time.fromInt(0) kalau default
//     };

//     // histories.put(dummyHistory.historyId, [dummyHistory]);
//      switch (histories.get(userId)) {
//       case null {
//         histories.put(userId, [dummyHistory]);
//       };
//       case (?existing) {
//         histories.put(userId, Array.append([dummyHistory], existing));
//       };
//     };
//     };
//  };

// public func addDummyHistoriesSync(histories: HistoryTypes.Histories, userId: Text) {
//   for (i in Iter.range(1, 10)) {
//     let dummyFeedback: HistoryTypes.Feedback = {
//       feedback_message = "Improve clarity.";
//       revision_example = "Add measurable results.";
//     };

//     // Section 1: Summary
//     let value1: HistoryTypes.Value = {
//       feedback = [dummyFeedback];
//       pointer = ["summary"];
//       score = 75 + (i % 5);
//       strength = "Concise";
//       weaknesess = "Lacks specificity";
//     };
//     let content1: HistoryTypes.ContentItem = {
//       title = "Summary";
//       value = value1;
//     };

//     // Section 2: Experience
//     let value2: HistoryTypes.Value = {
//       feedback = [dummyFeedback];
//       pointer = ["experience"];
//       score = 80 + (i % 5);
//       strength = "Relevant experience";
//       weaknesess = "Missing results";
//     };
//     let content2: HistoryTypes.ContentItem = {
//       title = "Experience";
//       value = value2;
//     };

//     // Section 3: Education
//     let value3: HistoryTypes.Value = {
//       feedback = [dummyFeedback];
//       pointer = ["education"];
//       score = 85 + (i % 5);
//       strength = "Prestigious institution";
//       weaknesess = "Too short";
//     };
//     let content3: HistoryTypes.ContentItem = {
//       title = "Education";
//       value = value3;
//     };

//     let dummyConclusion: HistoryTypes.Conclusion = {
//       career_recomendation = ["Backend Developer", "Software Engineer"];
//       keyword_matching = ["Node.js", "React"];
//       section_to_add = ["Projects"];
//       section_to_remove = ["Objective"];
//     };

//     let timestamp = Time.now();

//     let dummySummary: HistoryTypes.Summary = {
//         score = 81.0;
//         value = "Ini Resume shows good structure and relevant experience.";
//       };

//     let dummyHistory: HistoryTypes.History = {
//       userId = userId;
//       fileName = "CV_Dummy_" # Nat.toText(i) # ".pdf";
//       jobTitle = "Data Analyst" # Nat.toText(i);
//       summary = dummySummary;
//       conclusion = dummyConclusion;
//       content = [content1, content2, content3]; // <- 3 sections here
//       createdAt = DateHelper.formatTimestamp(timestamp);
//     };

//     switch (histories.get(userId)) {
//       case null {
//         histories.put(userId, [dummyHistory]);
//       };
//       case (?existing) {
//         histories.put(userId, Array.append([dummyHistory], existing));
//       };
//     };
//   };
// };

public func addDummyHistoriesSync(histories: HistoryTypes.Histories, userId: Text) : async () {
  for (i in Iter.range(1, 10)) {
    let dummyFeedback: HistoryTypes.Feedback = {
      feedback_message = "Improve clarity.";
      revision_example = "Add measurable results.";
    };

    let content1: HistoryTypes.ContentItem = {
      title = "Summary";
      value = {
        feedback = [dummyFeedback];
        pointer = ["summary"];
        score = 75 + (i % 5);
        strength = "Concise";
        weaknesess = "Lacks specificity";
      };
    };

    let dummyConclusion: HistoryTypes.Conclusion = {
      career_recomendation = ["Backend Developer", "Software Engineer"];
      keyword_matching = ["Node.js", "React"];
      section_to_add = ["Projects"];
      section_to_remove = ["Objective"];
    };

    let dummySummary: HistoryTypes.Summary = {
      score = 81.0 + Float.fromInt(i);
      value = "Resume shows good structure and relevant experience.";
    };

    let dummyInput: HistoryTypes.AddHistoryInput = {
      fileName = "CV_Dummy_" # Nat.toText(i) # ".pdf";
      jobTitle = "Data Analyst" # Nat.toText(i);
      summary = dummySummary;
      conclusion = dummyConclusion;
      content = [content1];
    };

    // 🔁 Cek hasil pemanggilan addHistory
    let result = await addHistory(histories, userId, dummyInput);
    switch (result) {
      case (#ok(history)) {
        Debug.print("✔️ Berhasil tambah dummy ke-" # Nat.toText(i));
      };
      case (#err(errMsg)) {
        Debug.print("❌ Gagal tambah dummy ke-" # Nat.toText(i) # ": " # errMsg);
      };
    };
  };
};


};
=======
import Text "mo:base/Text";
import Result "mo:base/Result";
import Random "mo:base/Random";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import HistoryTypes "../types/HistoryTypes_new";
import UUID "mo:idempotency-keys/idempotency-keys";
import DateHelper "../helpers/DateHelper";
import Order "mo:base/Order";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Int "mo:base/Int";


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

    let newHistory : HistoryTypes.History = {
      userId = userId;
      historyId = historyId;
      fileName = input.fileName;
      jobTitle = input.jobTitle;
      summary = input.summary;
      conclusion = input.conclusion;
      content = input.content;
      createdAt = createdAt;
    };

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
      case null {
        return #ok({
          totalRowCount = 0;
          totalPages = 0;
          currentPage = page;
          pageSize = pageSize;
          data = [];
        });
      };
      case (?hs) {
        var h = hs;
        switch (filterBys) {
          case null {};
          case (?filters) {
            for ((field, keyword) in filters.vals()) {
              h := Array.filter<HistoryTypes.History>(
                h,
                func(hist) {
                  switch (field) {
                    case ("fileName") {
                      Text.contains(hist.fileName, #text keyword);
                    };
                    case ("jobTitle") {
                      Text.contains(hist.jobTitle, #text keyword);
                    };
                    case _ {
                      true;
                    };
                  };
                },
              );
            };
          };
        };

        switch (sortBys) {
          case null {};
          case (?sortFields) {
            h := Array.sort<HistoryTypes.History>(
              h,
              func(a : HistoryTypes.History, b : HistoryTypes.History) : Order.Order {
                for ((field, desc) in sortFields.vals()) {
                  let cmp : Int = switch (field) {
                    case ("score") {
                      let scoreA = a.summary.score;
                      let scoreB = b.summary.score;

                      if (scoreA < scoreB) { -1 } else if (scoreA > scoreB) {
                        1;
                      } else { 0 };
                    };

                    case ("createdAt") {
                      if (a.createdAt < b.createdAt) { -1 } else if (a.createdAt > b.createdAt) {
                        1;
                      } else { 0 };
                    };
                    case _ { 0 };
                  };

                  if (cmp != 0) {
                    return if (desc) {
                      if (cmp < 0) { #greater } else { #less };
                    } else {
                      if (cmp < 0) { #less } else { #greater };
                    };
                  };
                };

                return #equal;
              },
            );
          };
        };

        if (globalFilter != "") {
          let lower = Text.toLowercase(globalFilter);
          h := Array.filter<HistoryTypes.History>(
            h,
            func(hist) {
              Text.contains(Text.toLowercase(hist.fileName), #text lower) or Text.contains(Text.toLowercase(hist.jobTitle), #text lower) or Text.contains(Text.toLowercase(hist.historyId), #text lower) or Text.contains(Text.toLowercase(hist.summary.value), #text lower) or Option.isSome(
                Array.find(
                  hist.content,
                  func(c : HistoryTypes.ContentItem) : Bool {
                    Text.contains(Text.toLowercase(c.title), #text lower) or Text.contains(Text.toLowercase(c.value.strength), #text lower) or Text.contains(Text.toLowercase(c.value.weaknesess), #text lower) or Option.isSome(
                      Array.find(
                        c.value.feedback,
                        func(fb : HistoryTypes.Feedback) : Bool {
                          return Text.contains(Text.toLowercase(fb.feedback_message), #text lower) or Text.contains(Text.toLowercase(fb.revision_example), #text lower);
                        },
                      )
                    );
                  },
                )
              );
            },
          );
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
  ) : Result.Result<HistoryTypes.HistoryOutput, Text> {
    switch (histories.get(userId)) {
      case null { return #err("No analysis records found for your account.") };
      case (?userHistories) {
        for (history in userHistories.vals()) {
          if (history.historyId == historyId) {
            return #ok({
              fileName = history.fileName;
              jobTitle = history.jobTitle;
              summary = history.summary;
              conclusion = history.conclusion;
              content = history.content;
              createdAt = history.createdAt;
              userId = history.userId;
              historyId = history.historyId;
            });

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
        return #err("No analysis records found for your account. Please upload a resume first.");
      };
      case (?userHistories) {
        let updatedHistories = Array.filter<HistoryTypes.History>(
          userHistories,
          func(history : HistoryTypes.History) : Bool {
            history.historyId != historyId;
          },
        );

        if (Array.size(userHistories) == Array.size(updatedHistories)) {
          return #err("No record found with the analysis ID: " # historyId # ". Please check and try again.");
        };

        histories.put(userId, updatedHistories);
        return #ok("Resume analysis with ID: " # historyId # " has been successfully deleted.");
      };
    };
  };

};
>>>>>>> Stashed changes
