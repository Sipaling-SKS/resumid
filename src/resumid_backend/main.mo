import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Debug "mo:base/Debug";

import GptTypes "types/GptTypes";
import GptServices "services/GptServices";
import HistoryTypes "types/HistoryTypes";
import HistoryServices "services/HistoryServices";

actor Resumid {
  // Analyze History type
  private var histories : HistoryTypes.Histories = HashMap.HashMap<Text, [HistoryTypes.History]>(0, Text.equal, Text.hash);

  // Auth related method

  // Resume Analyzer related method
  public shared (msg) func AnalyzeResume(fileName : Text, resumeContent : Text, jobTitle : Text, jobDescription : Text) : async ?GptTypes.AnalyzeStructure {
    let userId = Principal.toText(msg.caller);

    let analyzeResult = await GptServices.AnalyzeResume(resumeContent, jobTitle, jobDescription);
    Debug.print(debug_show (analyzeResult));

    switch (analyzeResult) {
      case (null) {
        Debug.print("AnalyzeResult is null. Skipping HistoryServices processing.");
      };
      case (?result) {
        let addHistoryInput = {
          fileName = fileName;
          summary = result.summary;
          score = result.score;
          strengths = result.strengths;
          weaknesses = result.weakness;
          gaps = result.gaps;
          suggestions = result.suggestions;
        };

        let historyResult = await HistoryServices.addHistory(histories, userId, addHistoryInput);

        switch (historyResult) {
          case (#ok(res)) {
            Debug.print(debug_show(res));
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

  // Analyze History related method
  public shared (msg) func addHistory(input : HistoryTypes.AddHistoryInput) : async Result.Result<HistoryTypes.History, Text> {
    let userId = Principal.toText(msg.caller);

    let addHistoryInput = {
      fileName = input.fileName;
      summary = input.summary;
      score = input.score;
      strengths = input.strengths;
      weaknesses = input.weaknesses;
      gaps = input.gaps;
      suggestions = input.suggestions;
    };

    await HistoryServices.addHistory(histories, userId, addHistoryInput);
  };

  public shared (msg) func getHistories() : async Result.Result<[HistoryTypes.History], Text> {
    let userId = Principal.toText(msg.caller);
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
