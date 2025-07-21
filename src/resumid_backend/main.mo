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
import GeminiServices "services/GeminiServices";
import GeminiTypes "types/GeminiTypes";

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

  public shared (msg) func AnalyzeResume(fileName : Text, resumeContent : Text, jobTitle : Text, jobDescription : Text) : async ?GptTypes.AnalyzeStructure {
    let userId = Principal.toText(msg.caller);

    Debug.print("Caller Principal for AnalyzeResume: " # userId);

    let analyzeResult = await GptServices.AnalyzeResume(resumeContent, jobTitle, jobDescription);
    Debug.print(debug_show (analyzeResult));

    switch (analyzeResult) {
      case (null) {
        Debug.print("AnalyzeResult is null. Skipping HistoryServices processing.");
      };
      case (?result) {
        let addHistoryInput = {
          fileName = fileName;
          jobTitle = jobTitle;
          summary = result.summary;
          score = result.score;
          strengths = result.strengths;
          weaknesses = result.weakness;
          gaps = result.gaps;
          suggestions = result.suggestions;
        };

        let historyResult = await HistoryServices.addHistory(histories, userId, addHistoryInput);


        // Create logging for history result process
        switch (historyResult) {
          case (#ok(res)) {
            Debug.print(debug_show (res));
            Debug.print("History added successfully.");
          };
          case (#err(errorMessage)) {
            Debug.print("Failed to add history: " # errorMessage);
            Debug.print(errorMessage);
          };
        };
      };
    };

    analyzeResult;
  };

  public shared (msg) func AnalyzeResumeV2(fileName : Text, resumeContent : Text, jobTitle : Text) : async ?GeminiTypes.AnalyzeStructureResponse {
    let userId = Principal.toText(msg.caller);

    Debug.print("Caller Principal for AnalyzeResume: " # userId);

    let analyzeResult = await GeminiServices.AnalyzeResume(resumeContent, jobTitle);
    Debug.print(debug_show (analyzeResult));

    // switch (analyzeResult) {
    //   case (null) {
    //     Debug.print("AnalyzeResult is null. Skipping HistoryServices processing.");
    //   };
    //   case (?result) {
    //     let addHistoryInput = {
    //       fileName = fileName;
    //       jobTitle = jobTitle;
    //       summary = result.summary;
    //       score = result.score;
    //       strengths = result.strengths;
    //       weaknesses = result.weakness;
    //       gaps = result.gaps;
    //       suggestions = result.suggestions;
    //     };

    //     let historyResult = await HistoryServices.addHistory(histories, userId, addHistoryInput);


    //     // Create logging for history result process
    //     switch (historyResult) {
    //       case (#ok(res)) {
    //         Debug.print(debug_show (res));
    //         Debug.print("History added successfully.");
    //       };
    //       case (#err(errorMessage)) {
    //         Debug.print("Failed to add history: " # errorMessage);
    //         Debug.print(errorMessage);
    //       };
    //     };
    //   };
    // };

    analyzeResult;
  };

  // ==============================
  // History Management Methods
  // ==============================
  
  public shared (msg) func addHistory(input : HistoryTypes.AddHistoryInput) : async Result.Result<HistoryTypes.History, Text> {
    let userId = Principal.toText(msg.caller);

    let addHistoryInput = {
      fileName = input.fileName;
      summary = input.summary;
      score = input.score;
      jobTitle = input.jobTitle;
      strengths = input.strengths;
      weaknesses = input.weaknesses;
      gaps = input.gaps;
      suggestions = input.suggestions;
    };

    await HistoryServices.addHistory(histories, userId, addHistoryInput);
  };

  public shared (msg) func getHistories() : async Result.Result<[HistoryTypes.History], Text> {
    let userId = Principal.toText(msg.caller);

    Debug.print("Caller Principal Get Histories: " # userId);

    HistoryServices.getHistories(histories, userId);
  };

  public shared (msg) func getHistoryById(input : HistoryTypes.HistoryIdInput) : async Result.Result<HistoryTypes.History, Text> {
    let userId = Principal.toText(msg.caller);
    HistoryServices.getHistoryById(histories, userId, input.historyId);
  };

  public shared (msg) func deleteHistory(input : HistoryTypes.HistoryIdInput) : async Result.Result<Text, Text> {
    let userId = Principal.toText(msg.caller);
    HistoryServices.deleteHistory(histories, userId, input.historyId);
  };
};