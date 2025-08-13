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
import ProfileTypes "types/ProfileTypes";
import ProfileServices "services/ProfileServices";
import ResumeExtractTypes "types/ResumeExtractTypes";


import DateHelper "helpers/DateHelper";


actor Resumid {
  // Storage for user data and analysis histories
  private var users : UserTypes.User = HashMap.HashMap<Principal, UserTypes.UserData>(0, Principal.equal, Principal.hash);
  private var histories : HistoryTypes.Histories = HashMap.HashMap<Text, [HistoryTypes.History]>(0, Text.equal, Text.hash);
  private var profiles : ProfileTypes.Profiles = HashMap.HashMap<Text, ProfileTypes.Profile>(0, Text.equal, Text.hash);
  private var draftMap : ResumeExtractTypes.Draft = HashMap.HashMap<Text, ProfileTypes.Profile>(0, Text.equal, Text.hash);
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
  // Resume Extract Methods
  // ==============================

    public shared (msg) func ExtractResumeToDraft(resumeContent: Text) : async ?ResumeExtractTypes.Draft {
        let userId = Principal.toText(msg.caller);
        Debug.print("Caller Principal for ExtractResumeToDraft: " # userId);

        // Panggil service extract
        let extractResult = await GeminiServices.Extract(resumeContent);

        let timestamp = Time.now();
        let formattedTimestamp = DateHelper.formatTimestamp(timestamp);

        switch (extractResult) {
            case null {
                Debug.print("Extract returned null");
                null
            };
            case (?resumeData) {
                let mappedResumeData : ResumeExtractTypes.ResumeData = 
                    Array.map<ResumeExtractTypes.ResumeSection, ResumeExtractTypes.ResumeSection>(resumeData, func (section) {
                        let updatedContent : ResumeExtractTypes.SectionValue = {
                            Summary = section.content.Summary;
                            WorkExperience = switch (section.content.WorkExperience) {
                                case (?workList) {
                                    let newList = Array.map<ResumeExtractTypes.WorkExperience, ResumeExtractTypes.WorkExperience>(workList, func (w) {
                                        { w with id = UUID.generate() }
                                    });
                                    ?newList
                                };
                                case null { null };
                            };
                            Education = switch (section.content.Education) {
                                case (?eduList) {
                                    let newList = Array.map<ResumeExtractTypes.Education, ResumeExtractTypes.Education>(eduList, func (e) {
                                        { e with id = UUID.generate() }
                                    });
                                    ?newList
                                };
                                case null { null };
                            };
                        };
                        { section with content = updatedContent }
                    });

                // Simpan ke Draft
                let draftItem : ResumeExtractTypes.ResumeHistoryItem = {
                    userId = userId;
                    data = mappedResumeData;
                    createdAt = formattedTimestamp;   // format sesuai kebutuhan
                    updatedAt = formattedTimestamp;
                };

                ResumeExtractTypes.draftMap.put(userId, draftItem);

                ?ResumeExtractTypes.draftMap
            };
        };
    };




  // ==============================
  // Profile Management Methods
  // ==============================
  
    public shared(msg) func GetProfileByUserId(userId: Text) : async Result.Result<ProfileTypes.Profile, Text> {
        switch (profiles.get(userId)) {
            case null { 
                #err("Profile not found for user: " # userId)
            };
            case (?profile) {
                #ok(profile)
            }
        }
    };
    public shared(msg) func saveDraftToProfile() : async Result.Result<ProfileTypes.Profiles, Text> {
        let userId = Principal.toText(msg.caller);
        ProfileServices.saveDraftToProfile(profiles, drafts, userId)
    };

    public shared(msg) func ediEducationDraft(
        newWork: ResumeExtractTypes.WorkExperience
    ) : async Result.Result<Text, Text> {
        let userId = Principal.toText(msg.caller);
        ProfileServices.editWorkExperienceInDraft(drafts, userId, newWork)
    };

    public shared(msg) func editEducationDraft(
        newEdu: ResumeExtractTypes.Education
    ) : async Result.Result<Text, Text> {
        let userId = Principal.toText(msg.caller);
        ProfileServices.editEducationInDraft(drafts, userId, newEdu)
    };
    public shared(msg) func DeleteWorkExperienceDraft(userId: Text, workId: Text) : async Result.Result<Text, Text> {
        ProfileServices.deleteWorkExperienceInDraft(drafts, userId, workId)
    };

    public shared(msg) func DeleteEducationDraft(userId: Text, eduId: Text) : async Result.Result<Text, Text> {
        ProfileServices.deleteEducationInDraft(drafts, userId, eduId)
    };

    public shared(msg) func DeleteSectionDraft(userId: Text, sectionTitle: Text) : async Result.Result<Text, Text> {
        ProfileServices.deleteSectionInDraft(drafts, userId, sectionTitle)
    };

    //profiles

    public shared(msg) func editSummaryDraft(
        newSum: ResumeExtractTypes.Education
    ) : async Result.Result<Text, Text> {
        let userId = Principal.toText(msg.caller);
        ProfileServices.editSummaryInDraft(drafts, userId, newSum)
    };

    public shared(msg) func editWorkExperienceProfile(
        newWork: ProfileTypes.WorkExperience
    ) : async Result.Result<Text, Text> {
        let userId = Principal.toText(msg.caller);
        ProfileServices.editWorkExperienceInProfile(profiles, userId, newWork)
    };

    public shared(msg) func editEducationProfile(
        newWork: ProfileTypes.WorkExperience
    ) : async Result.Result<Text, Text> {
        let userId = Principal.toText(msg.caller);
        ProfileServices.editEducationInProfile(profiles, userId, newWork)
    };

    public shared(msg) func editSummaryinProfile(
        newWork: ProfileTypes.WorkExperience
    ) : async Result.Result<Text, Text> {
        let userId = Principal.toText(msg.caller);
        ProfileServices.editSummaryinInProfile(profiles, userId, newWork)
    };

    public shared(msg) func editProfileDetailinProfile(
        newWork: ProfileTypes.WorkExperience
    ) : async Result.Result<Text, Text> {
        let userId = Principal.toText(msg.caller);
        ProfileServices.editProfileDetailinInProfile(profiles, userId, newWork)
    };

    public shared(msg) func editContactInfoinProfile(
        newWork: ProfileTypes.WorkExperience
    ) : async Result.Result<Text, Text> {
        let userId = Principal.toText(msg.caller);
        ProfileServices.editContactInfoinInProfile(profiles, userId, newWork)
    };

    public shared(msg) func deleteWorkExperienceProfile(userId: Text, workId: Text) : async Result.Result<Text, Text> {
        ProfileServices.deleteWorkExperienceInProfile(profiles, userId, workId)
    };

    public shared(msg) func deleteEducationProfile(userId: Text, eduId: Text) : async Result.Result<Text, Text> {
        ProfileServices.deleteEducationInProfile(profiles, userId, eduId)
    };

    public shared(msg) func deleteSummaryProfile(userId: Text) : async Result.Result<Text, Text> {
        ProfileServices.deleteSummarySectionInProfile(profiles, userId)
    };

    public shared(msg) func deleteContactFieldProfile(userId: Text, fieldName: Text) : async Result.Result<Text, Text> {
        ProfileServices.deleteContactField(profiles, userId, fieldName)
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

  // public shared (msg) func addDummyHistories() : async Result.Result<Text, Text> {
  //   let userId = Principal.toText(msg.caller);
  //   await HistoryServices.addDummyHistoriesSync(histories, userId); // ✅ betulkan argumen

  //   return #ok("10 dummy histories added for user " # userId);
  // };


};

