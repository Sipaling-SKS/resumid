import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Iter "mo:base/Iter";

import HistoryTypes "types/HistoryTypes_new";
import HistoryServices "services/HistoryServices_new";
import UserTypes "types/UserTypes";
import PackageTypes "types/PackageTypes";
import GeminiTypes "types/GeminiTypes";

import UserServices "services/UserServices";
import PackageServices "services/PackageServices";
import GeminiServices "services/GeminiServices";
import DateHelper "helpers/DateHelper";
import TransactionTypes "types/TransactionTypes";

actor Resumid {
  private var users : UserTypes.User = HashMap.HashMap<Principal, UserTypes.UserData>(0, Principal.equal, Principal.hash);
  private var histories : HistoryTypes.Histories = HashMap.HashMap<Text, [HistoryTypes.History]>(0, Text.equal, Text.hash);
  private var packages : PackageTypes.Packages = HashMap.HashMap<Text, PackageTypes.Package>(0, Text.equal, Text.hash);
  private var tokenEntries : TransactionTypes.TokenEntries = HashMap.HashMap<Principal, [TransactionTypes.TokenEntry]>(0, Principal.equal, Principal.hash);

  // ==============================
  // Authentication and User Methods
  // ==============================

  public shared (msg) func whoami() : async Principal {
    Debug.print("Caller Principal WHOAMI: " # Principal.toText(msg.caller));
    return msg.caller;
  };

  public shared (msg) func authenticateUser(depositAddr : Text) : async Result.Result<UserTypes.UserData, Text> {
    let userId = msg.caller;

    Debug.print("Caller Principal for auth: " # Principal.toText(userId));
    return await UserServices.authenticateUser(users, tokenEntries, depositAddr, userId);
  };

  public shared func getAllUser() : async [UserTypes.UserData] {
    let allUsers : [UserTypes.UserData] = Iter.toArray(users.vals());

    return allUsers;
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
  // Gemini Analyze Method
  // ==============================

  public shared (msg) func AnalyzeResumeV2(fileName : Text, resumeContent : Text, jobTitle : Text) : async ?HistoryTypes.History {
    let userId = Principal.toText(msg.caller);
    Debug.print("Caller Principal for AnalyzeResume: " # userId);

    // Panggil service eksternal
    let analyzeResult = await GeminiServices.AnalyzeResume(resumeContent, jobTitle);
    Debug.print("Analyze result: " # debug_show (analyzeResult));

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
          func(section) {
            {
              title = section.title;
              value = {
                feedback = Array.map<GeminiTypes.FeedbackItem, HistoryTypes.Feedback>(
                  section.value.feedback,
                  func(fb) {
                    {
                      feedback_message = fb.feedback_message;
                      revision_example = fb.revision_example;
                    };
                  },
                );
                pointer = section.value.pointer;
                score = section.value.score;
                strength = section.value.strength;
                weaknesess = section.value.weaknesess;
              };
            };
          },
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
        return #ok(history.historyId);
      };
      case (#err(errMsg)) {
        return #err(errMsg);
      };
    };
  };

  public shared (msg) func getHistoriesPaginated(
    page : Nat,
    pageSize : Nat,
    sortBys : ?[(Text, Bool)],
    filterBys : ?[(Text, Text)],
    globalFilter : Text,
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

  // ==============================
  // Master Package Methods
  // ==============================
  public shared (msg) func getPackages() : async [PackageTypes.Package] {
    return Iter.toArray(packages.vals());
  };

  public shared (msg) func initPackages() : async [PackageTypes.Package] {
    return await PackageServices.initDefaultPackage(packages);
  };

  // ==============================
  // Transaction Package Methods
  // ==============================

  public shared (msg) func getAllTokenEntries() : async [TransactionTypes.TokenEntry] {
    let arrays : [[TransactionTypes.TokenEntry]] = Iter.toArray(tokenEntries.vals());
    Array.flatten<TransactionTypes.TokenEntry>(arrays);
  };

  public shared (msg) func getUserTokenEntries() : async [TransactionTypes.TokenEntry] {
    let userId = Principal.toText(msg.caller);

    switch (tokenEntries.get(msg.caller)) {
      case (null) { [] };
      case (?entries) { entries };
    };
  };
};
