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
import Error "mo:base/Error";

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

  // public shared (msg) func authenticateUser() : async Result.Result<UserTypes.UserData, Text> {
  //   let userId = msg.caller;

  //   Debug.print("Caller Principal for auth: " # Principal.toText(userId));
  //    await UserServices.authenticateUser(users, userId);
  //    await ProfileServices.createUserProfile(profiles, userId);
  //   return
  // };
  public shared (msg) func authenticateUser() : async Result.Result<UserTypes.UserData, Text> {
    let userId = msg.caller;
    Debug.print("Caller Principal for auth: " # Principal.toText(userId));

    // First authenticate the user
    let authResult = await UserServices.authenticateUser(users, userId);

    switch (authResult) {
      case (#err(errorMsg)) {
        return #err(errorMsg);
      };
      case (#ok(userData)) {
        let profileResult = await ProfileServices.createUserProfile(profiles, Principal.toText(userId));

        switch (profileResult) {
          case (#err(profileError)) {
            Debug.print("Profile creation failed: " # profileError);
            return #ok(userData);
          };
          case (#ok(_)) {
            return #ok(userData);
          };
        };
      };
    };
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

  public shared (msg) func AnalyzeResumeV2(fileName : Text, historycid : Text, resumeContent : Text, jobTitle : Text) : async ?HistoryTypes.History {
    let userId = Principal.toText(msg.caller);
    Debug.print("Caller Principal for AnalyzeResume: " # userId);

    let analyzeResult = await GeminiServices.AnalyzeResume(resumeContent, jobTitle);
    Debug.print("Analyze result: " # debug_show (analyzeResult));

    switch (analyzeResult) {
      case null {
        Debug.print("AnalyzeResume returned null");
        return null;
      };
      case (?result) {
        let timestamp = Time.now();
        let formattedTimestamp = DateHelper.formatTimestamp(timestamp);

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

        let input : HistoryTypes.AddHistoryInput = {
          historycid = historycid;
          fileName = fileName;
          jobTitle = jobTitle;
          summary = convertedSummary;
          conclusion = convertedConclusion;
          content = convertedContent;
          createdAt = formattedTimestamp;
        };

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

  // Fixed extractResumeToDraft function
  public shared (msg) func extractResumeToDraft(resumeContent : Text) : async ?ResumeExtractTypes.ResumeData {
    if (Principal.isAnonymous(msg.caller)) {
      Debug.print("Anonymous users cannot extract resumes");
      return null;
    };
    let userId = Principal.toText(msg.caller);
    let rawJsonOpt = await GeminiServices.Extract(resumeContent);

    switch (rawJsonOpt) {
      case null {
        Debug.print("Extract failed or empty");
        return null;
      };
      case (?input) {
        let now = Time.now();
        let formatted = DateHelper.formatTimestamp(now);

        let workExperiences = Array.tabulate<ResumeExtractTypes.WorkExperience>(
          input.workExperiences.size(),
          func(i : Nat) : ResumeExtractTypes.WorkExperience {
            let we = input.workExperiences[i];
            {
              id = "we-" # Int.toText(now) # "-" # Int.toText(i);
              company = we.company;
              location = we.location;
              position = we.position;
              employment_type = we.employment_type;
              period = we.period;
              description = ?we.description;
            };
          },
        );

        let educations = Array.tabulate<ResumeExtractTypes.Education>(
          input.educations.size(),
          func(i : Nat) : ResumeExtractTypes.Education {
            let ed = input.educations[i];
            {
              id = "edu-" # Int.toText(now) # "-" # Int.toText(i);
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

        let resumeData : ResumeExtractTypes.ResumeData = {
          summary = ?summary;
          workExperiences = ?workExperiences;
          educations = ?educations;
          skills = input.skills;
        };

        let entropy = await Random.blob();
        let draftId = UUID.generateV4(entropy);

        let historyItem : ResumeExtractTypes.ResumeHistoryItem = {
          userId = userId;
          draftId = draftId;
          data = resumeData;
          createdAt = formatted;
          updatedAt = formatted;
        };

        draftMap.put(userId, [historyItem]);

        return ?resumeData;
      };
    };
  };

  public shared (msg) func GetDraftByUserId() : async [ResumeExtractTypes.ResumeHistoryItem] {
    let userId = Principal.toText(msg.caller);

    switch (draftMap.get(userId)) {
      case null { [] };
      case (?arr) { arr };
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
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot edit drafts");
    };
    let userId = Principal.toText(msg.caller);

    let result = await DraftServices.editWorkExperienceDraft(draftMap, draftId, userId, workExpId, updatedFields);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Work experience draft updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update work experience draft for user " # userId # ": " # errMsg);
      };
    };
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
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot edit drafts");
    };
    let userId = Principal.toText(msg.caller);

    let result = await DraftServices.editEducationDraft(draftMap, draftId, userId, educationId, updatedFields);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Education draft updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update education draft for user " # userId # ": " # errMsg);
      };
    };
  };

  // editSkillsDraft
  public shared (msg) func editSkillsDraft(
    draftId : Text,
    skills : [Text],
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot edit drafts");
    };
    let userId = Principal.toText(msg.caller);

    let result = await DraftServices.editSkillsDraft(draftMap, draftId, userId, skills);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Skills draft updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update skills draft for user " # userId # ": " # errMsg);
      };
    };
  };

  public shared (msg) func removeDraftItem(
    draftId : Text,
    itemType : Text,
    itemId : ?Text,
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot delete draft items");
    };
    let userId = Principal.toText(msg.caller);
    let result = await DraftServices.deleteDraftItem(
      draftMap,
      draftId,
      userId,
      itemType,
      itemId,
    );
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Draft item deleted successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to delete draft item for user " # userId # ": " # errMsg);
      };
    };
  };

  //saveDraftToProfile
  public shared (msg) func saveDraftToProfile(draftId : Text) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot save drafts to profiles");
    };
    let userId = Principal.toText(msg.caller);
    let result = await DraftServices.saveDraftToProfile(draftMap, profiles, draftId, userId);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Draft saved to profile successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to save draft to profile for user " # userId # ": " # errMsg);
      };
    };
  };

  // ==============================
  // Profile Management Methods
  // ==============================
  public shared (msg) func getProfileById(profileId : Text) : async Result.Result<ProfileTypes.ProfileWithEndorsements, Text> {
    switch (await ProfileServices.getProfileByProfileId(profiles, profileId)) {
      case (?data) { #ok(data) };
      case null { #err("Profile not found") };
    };
  };

  public shared (msg) func getProfileByUserId() : async Result.Result<ProfileTypes.ProfileWithEndorsements, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot access profiles");
    };
    let userId = Principal.toText(msg.caller);
    switch (await ProfileServices.getProfileByUserId(profiles, userId)) {
      case (?data) { #ok(data) };
      case null { #err("Profile not found") };
    };
  };

  // public shared (msg) func updateProfileDetail(
  //   profileDetailInput : ?{
  //     name : ?Text;
  //     current_position : ?Text;
  //     description : ?Text;
  //   },
  //   contactInfo : ?ProfileTypes.ContactInfo,
  // ) : async Text {
  //   let userId = Principal.toText(msg.caller);

  //   let result = await ProfileServices.updateProfileDetailAndContact(
  //     profiles,
  //     userId,
  //     profileDetailInput,
  //     contactInfo,
  //   );

  //   switch (result) {
  //     case (#ok(_)) {
  //       return "Profile for user " # userId # " updated successfully";
  //     };
  //     case (#err(errMsg)) {
  //       return "Failed to update profile: " # errMsg;
  //     };
  //   };
  // };

  public shared (msg) func updateProfileDetail(
    profileDetailInput : ?{
      name : ?Text;
      current_position : ?Text;
      description : ?Text;
    },
    contactInfo : ?ProfileTypes.ContactInfo,
  ) : async Result.Result<Text, Text> {

    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot update profiles");
    };
    let userId = Principal.toText(msg.caller);

    let result = await ProfileServices.updateProfileDetailAndContact(
      profiles,
      userId,
      profileDetailInput,
      contactInfo,
    );

    switch (result) {
      case (#ok(successMsg)) {
        #ok("Profile for user " # userId # " updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update profile for user " # userId # ": " # errMsg);
      };
    };
  };

  public shared (msg) func updateProfilePicture(imageUrl : Text) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot update profile pictures");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.updateProfilePicture(profiles, userId, imageUrl);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Profile picture updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update profile picture for user " # userId # ": " # errMsg);
      };
    };
  };

  public shared (msg) func updateBannerPicture(bannerUrl : Text) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot update banner images");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.updateBannerPicture(profiles, userId, bannerUrl);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Banner image updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update banner image for user " # userId # ": " # errMsg);
      };
    };
  };

  // --- Work Experience ---
  // public shared (msg) func addWorkExperienceShared(
  //   newWorkExperience : {
  //     company : Text;
  //     location : ?Text;
  //     position : Text;
  //     employment_type : ?Text;
  //     period : {
  //       start : ?Text;
  //       end : ?Text;
  //     };
  //     description : ?Text;
  //   }
  // ) : async Result.Result<Text, Text> {
  //   let userId = Principal.toText(msg.caller);
  //   return await ProfileServices.addWorkExperience(profiles, userId, newWorkExperience);
  // };
  public shared (msg) func addWorkExperienceShared(
    newWorkExperience : {
      company : Text;
      location : ?Text;
      position : Text;
      employment_type : ?Text;
      period : {
        start : ?Text;
        end : ?Text;
      };
      description : ?Text;
    }
  ) : async Result.Result<Text, Text> {

    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot update profiles");
    };

    let userId = Principal.toText(msg.caller);

    let result = await ProfileServices.addWorkExperience(profiles, userId, newWorkExperience);

    switch (result) {
      case (#ok(successMsg)) {
        #ok("Work experience added successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to add Work Experience for user " # userId # ": " # errMsg);
      };
    };
  };

  public shared (msg) func editWorkExperienceShared(
    workExpId : Text,
    updatedFields : {
      company : Text;
      location : ?Text;
      position : Text;
      employment_type : ?Text;
      period : {
        start : ?Text;
        end : ?Text;
      };
      description : ?Text;
    },
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot update profiles");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.editWorkExperience(profiles, userId, workExpId, updatedFields);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Work experience updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update Work Experience for user " # userId # ": " # errMsg);
      };
    };
  };

  // --- Education ---
  public shared (msg) func addEducationShared(
    newEducation : {
      institution : ?Text;
      degree : ?Text;
      period : {
        start : ?Text;
        end : ?Text;
      };
      description : ?Text;
    }
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot update profiles");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.addEducation(profiles, userId, newEducation);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Education added successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to add Education for user " # userId # ": " # errMsg);
      };
    };
  };

  public shared (msg) func editEducationShared(
    educationId : Text,
    updatedFields : {
      institution : ?Text;
      degree : ?Text;
      period : {
        start : ?Text;
        end : ?Text;
      };
      description : ?Text;
    },
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot update profiles");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.editEducation(profiles, userId, educationId, updatedFields);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Education updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update Education for user " # userId # ": " # errMsg);
      };
    };
  };

  // --- Summary ---
  public shared (msg) func editSummaryShared(
    updatedSummary : ?Text
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot update profiles");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.editSummary(profiles, userId, updatedSummary);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Summary updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update Summary for user " # userId # ": " # errMsg);
      };
    };
  };

  // --- Skills ---
  public shared (msg) func editSkillsShared(
    // userId : Text,
    updatedSkills : [Text],
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot update profiles");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.editSkills(profiles, userId, updatedSkills);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Skills updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update Skills for user " # userId # ": " # errMsg);
      };
    };
  };

  // --- Resume Item Deletion ---
  public shared (msg) func deleteResumeItemShared(
    // userId : Text,
    itemType : Text,
    itemId : ?Text,
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot delete resume items");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.deleteResumeItem(profiles, userId, itemType, itemId);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Resume item deleted successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to delete Resume item for user " # userId # ": " # errMsg);
      };
    };
  };

  // --- Certification Management ---
  public shared (msg) func addCertificationShared(
    certInput : {
      title : Text;
      issuer : ?Text;
      credential_url : ?Text;
    }
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot add certifications");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.addCertification(profiles, userId, certInput);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Certification added successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to add Certification for user " # userId # ": " # errMsg);
      };
    };
  };

  public shared (msg) func updateCertificationShared(
    certificationId : Text,
    updatedFields : {
      title : Text;
      issuer : ?Text;
      credential_url : ?Text;
    },
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot update certifications");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.updateCertification(profiles, userId, certificationId, updatedFields);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Certification updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update Certification for user " # userId # ": " # errMsg);
      };
    };
  };

  public shared (msg) func deleteCertificationShared(
    certificationId : ?Text
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot delete certifications");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.deleteCertification(profiles, userId, certificationId);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Certification deleted successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to delete Certification for user " # userId # ": " # errMsg);
      };
    };
  };

  // -------------------------
  // SEARCH
  // -------------------------
  public shared (msg) func searchProfiles(searchInput : Text) : async [ProfileTypes.SearchResult] {
    return await ProfileServices.globalSearch(profiles, searchInput);
  };

  // -------------------------
  // ENDORSEMENT
  // -------------------------
  public shared (msg) func endorseProfile(targetUserId : Text) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot endorse profiles");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.addEndorsedProfile(profiles, userId, targetUserId);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Profile endorsed successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to endorse profile for user " # userId # ": " # errMsg);
      };
    };
  };

  public shared (msg) func unendorseProfile(targetUserId : Text) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot unendorse profiles");
    };
    let userId = Principal.toText(msg.caller);
    let result = await ProfileServices.removeEndorsedProfile(profiles, userId, targetUserId);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Profile unendorsed successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to unendorse profile for user " # userId # ": " # errMsg);
      };
    };
  };

  // ==============================
  // History Management Methods
  // ==============================

  public shared (msg) func addHistory(input : HistoryTypes.AddHistoryInput, historycid : Text) : async Result.Result<Text, Text> {
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
