import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Float "mo:base/Float";

import GptTypes "types/GptTypes";
import GptServices "services/GptServices";
import HistoryTypes "types/HistoryTypes_new";
import HistoryServices "services/HistoryServices_new";
import UserTypes "types/UserTypes";
import UserServices "services/UserServices";
import GeminiTypes "types/GeminiTypes";
import GeminiServices "services/GeminiServices";
import DateHelper "helpers/DateHelper";


actor Resumid {
  // Storage for user data and analysis histories
  private var users : UserTypes.User = HashMap.HashMap<Principal, UserTypes.UserData>(0, Principal.equal, Principal.hash);
  private var histories : HistoryTypes.Histories = HashMap.HashMap<Text, [HistoryTypes.History]>(0, Text.equal, Text.hash);

  // ==============================
  // Authentication and User Methods
  // ==============================

  public shared (msg) func whoami() : async Principal {
    Debug.print("Caller Principal WHOAMI: " # Principal.toText(msg.caller));
    return msg.caller;
  };

  public shared (msg) func authenticateUser() : async Result.Result<UserTypes.UserData, Text> {
    let userId = msg.caller;

    Debug.print("Caller Principal for auth: " # Principal.toText(userId));
    return await UserServices.authenticateUser(users, userId);
  };

  public shared (msg) func getUserById() : async Result.Result<UserTypes.UserData, Text> {
    let userId = msg.caller;

    Debug.print("Caller Principal for getUserById: " # Principal.toText(userId));

    switch (users.get(userId)) {
      case (?userData) {
        return #ok(userData);
      };
      case null {
        return #err("User not found");
      };
    };
  };

  // ==============================
  // Resume Analysis Methods
  // ==============================

  // public shared (msg) func AnalyzeResume(fileName : Text, resumeContent : Text, jobTitle : Text, jobDescription : Text) : async ?GptTypes.AnalyzeStructure {
  //   let userId = Principal.toText(msg.caller);

  //   Debug.print("Caller Principal for AnalyzeResume: " # userId);

  //   let analyzeResult = await GptServices.AnalyzeResume(resumeContent, jobTitle, jobDescription);
  //   Debug.print(debug_show (analyzeResult));

  //   switch (analyzeResult) {
  //     case (null) {
  //       Debug.print("AnalyzeResult is null. Skipping HistoryServices processing.");
  //     };
  //     case (?result) {
  //       let addHistoryInput = {
  //         fileName = fileName;
  //         jobTitle = jobTitle;
  //         summary = result.summary;
  //         score = result.score;
  //         strengths = result.strengths;
  //         weaknesses = result.weakness;
  //         gaps = result.gaps;
  //         suggestions = result.suggestions;
  //       };

  //       let historyResult = await HistoryServices.addHistory(histories, userId, addHistoryInput);


  //       // Create logging for history result process
  //       switch (historyResult) {
  //         case (#ok(res)) {
  //           Debug.print(debug_show (res));
  //           Debug.print("History added successfully.");
  //         };
  //         case (#err(errorMessage)) {
  //           Debug.print("Failed to add history: " # errorMessage);
  //           Debug.print(errorMessage);
  //         };
  //       };
  //     };
  //   };

  //   analyzeResult;
  // };

  // public shared (msg) func AnalyzeResumeV2(fileName : Text, resumeContent : Text, jobTitle : Text) : async ?GeminiTypes.AnalyzeStructureResponse {
  //   let userId = Principal.toText(msg.caller);

  //   Debug.print("Caller Principal for AnalyzeResume: " # userId);

  //   let analyzeResult = await GeminiServices.AnalyzeResume(resumeContent, jobTitle);
  //   Debug.print(debug_show (analyzeResult));

  //   // switch (analyzeResult) {
  //   //   case (null) {
  //   //     Debug.print("AnalyzeResult is null. Skipping HistoryServices processing.");
  //   //   };
  //   //   case (?result) {
  //   //     let addHistoryInput = {
  //   //       fileName = fileName;
  //   //       jobTitle = jobTitle;
  //   //       summary = result.summary;
  //   //       score = result.score;
  //   //       strengths = result.strengths;
  //   //       weaknesses = result.weakness;
  //   //       gaps = result.gaps;
  //   //       suggestions = result.suggestions;
  //   //     };

  //   //     let historyResult = await HistoryServices.addHistory(histories, userId, addHistoryInput);


  //   //     // Create logging for history result process
  //   //     switch (historyResult) {
  //   //       case (#ok(res)) {
  //   //         Debug.print(debug_show (res));
  //   //         Debug.print("History added successfully.");
  //   //       };
  //   //       case (#err(errorMessage)) {
  //   //         Debug.print("Failed to add history: " # errorMessage);
  //   //         Debug.print(errorMessage);
  //   //       };
  //   //     };
  //   //   };
  //   // };

  //   analyzeResult;
  // };

  // final analyzev2
    public shared (msg) func AnalyzeResumeV2(fileName : Text, resumeContent : Text, jobTitle : Text) : async ?HistoryTypes.History {
      let userId = Principal.toText(msg.caller);
      Debug.print("Caller Principal for AnalyzeResume: " # userId);

      // Panggil service eksternal
      let analyzeResult = await GeminiServices.AnalyzeResume(resumeContent, jobTitle);
      Debug.print("Analyze result: " # debug_show(analyzeResult));

      switch (analyzeResult) {
        case null {
          Debug.print("AnalyzeResume returned null");
          return null;
        };
        case (?result) {
          // Dapatkan timestamp saat ini
          let timestamp = Time.now();
          let formattedTimestamp = DateHelper.formatTimestamp(timestamp);

          // Konversi konten analisis ke tipe internal
          let convertedContent = Array.map<GeminiTypes.Section, HistoryTypes.ContentItem>(
            result.content,
            func (section) {
              {
                title = section.title;
                value = {
                  feedback = Array.map<GeminiTypes.FeedbackItem, HistoryTypes.Feedback>(
                    section.value.feedback,
                    func (fb) {
                      {
                        feedback_message = fb.feedback_message;
                        revision_example = fb.revision_example;
                      }
                    }
                  );
                  pointer = section.value.pointer;
                  score = section.value.score;
                  strength = section.value.strength;
                  weaknesess = section.value.weaknesess;
                };
              }
            }
          );

          let convertedConclusion : HistoryTypes.Conclusion = {
            career_recomendation = result.conclusion.career_recomendation;
            keyword_matching = result.conclusion.keyword_matching;
            section_to_add = result.conclusion.section_to_add;
            section_to_remove = result.conclusion.section_to_remove;
          };

          let convertedSummary : HistoryTypes.Summary = {
            score = result.summary.score;
            value = result.summary.value;
          };

          // Siapkan input untuk addHistory
          let input : HistoryTypes.AddHistoryInput = {
            fileName = fileName;
            jobTitle = jobTitle;
            summary = convertedSummary;
            conclusion = convertedConclusion;
            content = convertedContent;
            createdAt = formattedTimestamp;
          };

          // Simpan menggunakan service
          let addResult = await HistoryServices.addHistory(histories, userId, input);

          switch (addResult) {
            case (#ok(history)) {
              Debug.print("Berhasil menambahkan history ID: " # history.historyId);
              ?history;
            };
            case (#err(errMsg)) {
              Debug.print("Gagal menambahkan history: " # errMsg);
              null;
            };
          };

        };
      };
    };


  // ==============================
  // History Management Methods
  // ==============================
  
  public shared (msg) func addHistory(input : HistoryTypes.AddHistoryInput) : async Result.Result<Text, Text> {
    let userId = Principal.toText(msg.caller);
    let result = await HistoryServices.addHistory(histories, userId, input);

    switch (result) {
      case (#ok(history)) {
        return #ok(history.historyId); // hanya kirim ID-nya
      };
      case (#err(errMsg)) {
        return #err(errMsg); // kirim error asli dari service
      };
    };
  };

  public shared (msg) func getHistoriesPaginated(
    page : Nat,
    pageSize : Nat,
    sortBys : ?[(Text, Bool)],
    filterBys : ?[(Text, Text)],
    globalFilter : Text
  ) : async Result.Result<HistoryTypes.PaginatedResult, Text> {
    let userId = Principal.toText(msg.caller);
    return HistoryServices.getHistoriesPaginated(histories, userId, page, pageSize, sortBys, filterBys, globalFilter);
  };


  public shared (msg) func getHistoryById(input : HistoryTypes.HistoryIdInput) : async Result.Result<HistoryTypes.HistoryOutput, Text> {
    let userId = Principal.toText(msg.caller);
    return HistoryServices.getHistoryById(histories, userId, input.historyId);
  };


  public shared (msg) func deleteHistory(input : HistoryTypes.HistoryIdInput) : async Result.Result<Text, Text> {
    let userId = Principal.toText(msg.caller);
    return HistoryServices.deleteHistory(histories, userId, input.historyId);
  };

  public shared (msg) func addDummyHistories() : async Result.Result<Text, Text> {
    let userId = Principal.toText(msg.caller);
    await HistoryServices.addDummyHistoriesSync(histories, userId); // ✅ betulkan argumen

    return #ok("10 dummy histories added for user " # userId);
  };


};

