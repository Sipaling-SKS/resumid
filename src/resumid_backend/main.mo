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
import UUID "mo:idempotency-keys/idempotency-keys";
import Random "mo:base/Random";
import { JSON } = "mo:serde";

import GptTypes "types/GptTypes";
import GptServices "services/GptServices";
import HistoryTypes "types/HistoryTypes_new";
import HistoryServices "services/HistoryServices_new";
import UserTypes "types/UserTypes";
import UserServices "services/UserServices";
import GeminiTypes "types/GeminiTypes";
import GeminiServices "services/GeminiServices";
import ProfileTypes "types/ProfileTypes";
// import ProfileServices "services/ProfileServices";
import ResumeExtractTypes "types/ResumeExtractTypes";

import DateHelper "helpers/DateHelper";
import DraftServices "services/DraftServices";

actor Resumid {
  // Storage for user data and analysis histories
  private var users : UserTypes.User = HashMap.HashMap<Principal, UserTypes.UserData>(0, Principal.equal, Principal.hash);
  private var histories : HistoryTypes.Histories = HashMap.HashMap<Text, [HistoryTypes.History]>(0, Text.equal, Text.hash);
  private var profiles : ProfileTypes.Profiles = HashMap.HashMap<Text, ProfileTypes.Profile>(0, Text.equal, Text.hash);
  private var draftMap : ResumeExtractTypes.Draft = HashMap.HashMap<Text, [ResumeExtractTypes.ResumeHistoryItem]>(0, Text.equal, Text.hash);
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

  // final analyzev2
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
  // Resume Extract Methods
  // ==============================

  // public shared (msg) func extractResumeToDraft(resumeContent : Text) : async ?ResumeExtractTypes.ResumeData {
  //   let userId = Principal.toText(msg.caller);
  //   let rawJsonOpt = await GeminiServices.ExtractMock(resumeContent);

  //   switch (rawJsonOpt) {
  //     case null {
  //       Debug.print("Extract failed or empty");
  //       return null;
  //     };
  //     case (?input) {
  //       let now = Time.now();
  //       let formatted = DateHelper.formatTimestamp(now);

  //       // Build Work Experiences
  //       let workExperiences = Array.tabulate<ResumeExtractTypes.WorkExperience>(
  //         input.workExperiences.size(),
  //         func(i : Nat) : ResumeExtractTypes.WorkExperience {
  //           let we = input.workExperiences[i];
  //           {
  //             id = "we" # Nat.toText(i);
  //             company = we.company;
  //             location = we.location;
  //             position = we.position;
  //             employment_type = we.employment_type;
  //             period = we.period;
  //             responsibilities = we.responsibilities;
  //           };
  //         },
  //       );

  //       // Build Educations
  //       let educations = Array.tabulate<ResumeExtractTypes.Education>(
  //         input.educations.size(),
  //         func(i : Nat) : ResumeExtractTypes.Education {
  //           let ed = input.educations[i];
  //           {
  //             id = "edu" # Nat.toText(i);
  //             institution = ed.institution;
  //             degree = ed.degree;
  //             study_period = ed.study_period;
  //             score = ed.score;
  //             description = ed.description;
  //           };
  //         },
  //       );

  //       // Build Summary
  //       let summary : ResumeExtractTypes.Summary = {
  //         content = input.summary.content;
  //       };

  //       // Compose ResumeData
  //       let resumeData : ResumeExtractTypes.ResumeData = {
  //         summary = ?summary;
  //         workExperiences = ?workExperiences;
  //         educations = ?educations;
  //       };

  //       // Wrap into ResumeHistoryItem
  //       let historyItem : ResumeExtractTypes.ResumeHistoryItem = {
  //         userId = userId;
  //         draftId = "test1";
  //         data = resumeData;
  //         createdAt = formatted;
  //         updatedAt = formatted;
  //       };

  //       // ✅ Store as array
  //       draftMap.put(userId, [historyItem]);

  //       return ?resumeData;
  //     };
  //   };
  // };

  // public shared (msg) func extractResumeToDraft(resumeContent : Text) : async ?ResumeExtractTypes.ResumeData {
  //   let userId = Principal.toText(msg.caller);
  //   let rawJsonOpt = await GeminiServices.ExtractMock(resumeContent);

  //   switch (rawJsonOpt) {
  //     case null {
  //       Debug.print("Extract failed or empty");
  //       return null;
  //     };
  //     case (?input) {
  //       let now = Time.now();
  //       let formatted = DateHelper.formatTimestamp(now);

  //       // Build Work Experiences
  //       let workExperiences = Array.tabulate<ResumeExtractTypes.WorkExperience>(
  //         input.workExperiences.size(),
  //         func(i : Nat) : ResumeExtractTypes.WorkExperience {
  //           let we = input.workExperiences[i];
  //           {
  //             id = "we" # Nat.toText(i);
  //             company = we.company;
  //             location = we.location;
  //             position = we.position;
  //             employment_type = we.employment_type;
  //             period = we.period;
  //             description = ?we.description;
  //           };
  //         },
  //       );

  //       // Build Educations
  //       let educations = Array.tabulate<ResumeExtractTypes.Education>(
  //         input.educations.size(),
  //         func(i : Nat) : ResumeExtractTypes.Education {
  //           let ed = input.educations[i];
  //           {
  //             id = "edu" # Nat.toText(i);
  //             institution = ed.institution;
  //             degree = ed.degree;
  //             period = ed.period;
  //             description = ?ed.description;
  //           };
  //         },
  //       );

  //       // Build Summary
  //       let summary : ResumeExtractTypes.Summary = {
  //         content = input.summary.content;
  //       };

  //       // let skills : ResumeExtractTypes.SkillsInput = {
  //       //   skills = input.skills;  // Changed from [Text] to SkillsInput type
  //       // };
  //       let skillsArray : [Text] = input.skills;

  //       // Compose ResumeData
  //       let resumeData : ResumeExtractTypes.ResumeData = {
  //         summary = ?summary;
  //         workExperiences = ?workExperiences;
  //         educations = ?educations;
  //         skills = ?skillsArray;  // Changed from ?[Text] to Skills type
  //       };
  //       let entropy = await Random.blob();
  //       let draftId = UUID.generateV4(entropy);

  //       // Wrap into ResumeHistoryItem
  //       let historyItem : ResumeExtractTypes.ResumeHistoryItem = {
  //         userId = userId;
  //         draftId = draftId;
  //         data = resumeData;
  //         createdAt = formatted;
  //         updatedAt = formatted;
  //       };

  //       // ✅ Store as array
  //       draftMap.put(userId, [historyItem]);

  //       return ?resumeData;
  //     };
  //   };
  // };
  public shared (msg) func extractResumeToDraft(resumeContent : Text) : async ?ResumeExtractTypes.ResumeData {
    let userId = Principal.toText(msg.caller);
    let rawJsonOpt = await GeminiServices.ExtractMock(resumeContent);

    switch (rawJsonOpt) {
      case null {
        Debug.print("Extract failed or empty");
        return null;
      };
      case (?input) {
        let now = Time.now();
        let formatted = DateHelper.formatTimestamp(now);

        // Build Work Experiences
        let workExperiences = Array.tabulate<ResumeExtractTypes.WorkExperience>(
          input.workExperiences.size(),
          func(i : Nat) : ResumeExtractTypes.WorkExperience {
            let we = input.workExperiences[i];
            {
              id = "we" # Nat.toText(i);
              company = we.company;
              location = we.location;
              position = we.position;
              employment_type = we.employment_type;
              period = we.period;
              description = ?we.description;
            };
          },
        );

        // Build Educations
        let educations = Array.tabulate<ResumeExtractTypes.Education>(
          input.educations.size(),
          func(i : Nat) : ResumeExtractTypes.Education {
            let ed = input.educations[i];
            {
              id = "edu" # Nat.toText(i);
              institution = ed.institution;
              degree = ed.degree;
              period = ed.period;
              description = ?ed.description;
            };
          },
        );

        let summary : ResumeExtractTypes.Summary = {
          content = input.summary.content;
        };

        let skillsRecord : ResumeExtractTypes.Skills = switch (input.skills) {
          case null { { skills = [] } };
          case (?s) { { skills = s.skills } };
        };

        let resumeData : ResumeExtractTypes.ResumeData = {
          summary = ?summary;
          workExperiences = ?workExperiences;
          educations = ?educations;
          skills = ?skillsRecord;
        };

        let entropy = await Random.blob();
        let draftId = UUID.generateV4(entropy);

        let historyItem : ResumeExtractTypes.ResumeHistoryItem = {
          userId = userId;
          draftId = "draftId1";
          data = resumeData;
          createdAt = formatted;
          updatedAt = formatted;
        };

        // ✅ Store as array
        draftMap.put(userId, [historyItem]);

        return ?resumeData;
      };
    };
  };

  public shared (msg) func GetDraftByUserId() : async [ResumeExtractTypes.ResumeHistoryItem] {
    let userId = Principal.toText(msg.caller);

    // Return the array if exists, otherwise return empty array
    switch (draftMap.get(userId)) {
      case null { [] }; // No draft → empty array
      case (?arr) { arr }; // Return existing drafts
    };
  };

  // public shared (msg) func GetDraftByDraftId(
  //   draftId : Text
  // ) : async Result.Result<ResumeExtractTypes.ResumeHistoryItem, Text> {
  //   let userId = Principal.toText(msg.caller); // or omit if you want all users
  //   switch (draftMap.get(userId)) {
  //     case null {
  //       return [];
  //     };
  //     case (?userDrafts) {
  //       for (draft in userDrafts) {
  //         if (draft.draftId == draftId) {
  //           return #ok(draft);
  //         };
  //       };
  //       return #err("No draft found with the ID: " # draftId # ". Please check and try again.");
  //     };
  //   };
  // };

  public shared (msg) func getProfileByUserId() : async Result.Result<ProfileTypes.Profile, Text> {
    let userId = Principal.toText(msg.caller);

    switch (profiles.get(userId)) {
      case null {
        return #err("Profile not found for user: " # userId);
      };
      case (?profile) {
        return #ok(profile);
      };
    };
  };

  // ==============================
  // Draft Management Methods
  // ==============================

  // editWorkExperienceDraft
  public shared (msg) func editWorkExperienceDraft(
    draftId : Text,
    workExpId : Text,
    updatedFields : {
      company : Text;
      location : Text;
      position : Text;
      employment_type : ?Text;
      period : {
        start : ?Text;
        end : ?Text;
      };
      description : ?Text;
    },
  ) : async Result.Result<Text, Text> {
    let userId = Principal.toText(msg.caller);

    return await DraftServices.editWorkExperienceDraft(draftMap, draftId, userId, workExpId, updatedFields);
  };

  // editEducationDraft
  public shared (msg) func editEducationDraft(
    draftId : Text,
    educationId : Text,
    updatedFields : {
      institution : Text;
      degree : Text;
      study_period : {
        start : ?Text;
        end : ?Text;
      };
      score : Text;
      description : ?Text;
    },
  ) : async Result.Result<Text, Text> {
    let userId = Principal.toText(msg.caller);

    return await DraftServices.editEducationDraft(draftMap, draftId, userId, educationId, updatedFields);
  };

  // editSkillsDraft
  public shared (msg) func editSkillsDraft(
    draftId : Text,
    skills : [Text],
    operation : Text, // "add" or "remove"
  ) : async Result.Result<Text, Text> {
    let userId = Principal.toText(msg.caller);

    return await DraftServices.editSkillsDraft(draftMap, draftId, userId, skills, operation);
  };

  public shared (msg) func removeDraftItem(
    draftId : Text,
    itemType : Text,
    itemId : ?Text,
  ) : async Result.Result<Text, Text> {
    let userId = Principal.toText(msg.caller);
    return await DraftServices.deleteDraftItem(
      draftMap,
      draftId,
      userId,
      itemType,
      itemId,
    );
  };

  //saveDraftToProfile
  public shared (msg) func saveDraftToProfile(draftId : Text) : async Result.Result<Text, Text> {
    let userId = Principal.toText(msg.caller);
    return await DraftServices.saveDraftToProfile(draftMap, profiles, draftId, userId);
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

};
