import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import UUID "mo:idempotency-keys/idempotency-keys";
import Random "mo:base/Random";
import { JSON } = "mo:serde";
import DateHelper "helpers/DateHelper";
import Error "mo:base/Error";

import GptTypes "types/GptTypes";
import GptServices "services/GptServices";
import HistoryTypes "types/HistoryTypes_new";
import HistoryServices "services/HistoryServices_new";
import UserTypes "types/UserTypes";
import PackageTypes "types/PackageTypes";
import GeminiTypes "types/GeminiTypes";

import UserServices "services/UserServices";
import PackageServices "services/PackageServices";
import GeminiServices "services/GeminiServices";
import TransactionTypes "types/TransactionTypes";
import ProfileTypes "types/ProfileTypes";
import ProfileServices "services/ProfileServices";
import ResumeExtractTypes "types/ResumeExtractTypes";

import DraftServices "services/DraftServices";
import TransactionServices "services/TransactionServices";
import Analytics "services/Analytics";
import GlobalHelper "helpers/GlobalHelper";

actor Resumid {
  // Storage for user data and analysis histories
  private var users : UserTypes.User = HashMap.HashMap<Principal, UserTypes.UserData>(0, Principal.equal, Principal.hash);
  private var histories : HistoryTypes.Histories = HashMap.HashMap<Text, [HistoryTypes.History]>(0, Text.equal, Text.hash);
  private var packages : PackageTypes.Packages = HashMap.HashMap<Text, PackageTypes.Package>(0, Text.equal, Text.hash);
  private var tokenEntries : TransactionTypes.TokenEntries = HashMap.HashMap<Principal, [TransactionTypes.TokenEntry]>(0, Principal.equal, Principal.hash);
  private var transactions : TransactionTypes.Transactions = HashMap.HashMap<Principal, [TransactionTypes.Transaction]>(0, Principal.equal, Principal.hash);

  private var profiles : ProfileTypes.Profiles = HashMap.HashMap<Text, ProfileTypes.Profile>(0, Text.equal, Text.hash);
  private var draftMap : ResumeExtractTypes.Draft = HashMap.HashMap<Text, ResumeExtractTypes.ResumeHistoryItem>(0, Text.equal, Text.hash);

  private let ADMIN_ID : Text = "admin-secret-id";
  // ==============================
  // Authentication and User Methods
  // ==============================

  public shared (msg) func whoami() : async Principal {
    Debug.print("Caller Principal WHOAMI: " # Principal.toText(msg.caller));
    return msg.caller;
  };

  public shared (msg) func authenticateUser(key : ?Text, depositAddr : Text) : async Result.Result<UserTypes.UserData, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot authenticate");
    };

    let userId = msg.caller;
    Debug.print("Caller Principal for auth: " # Principal.toText(userId));

    switch (key) {
      case (?providedId) {
        switch (providedId == ADMIN_ID) {
          case true {
            // Admin authentication
            switch (UserServices.adminExists(users)) {
              case true {
                switch (users.get(userId)) {
                  case (?existingUser) {
                    return #ok(existingUser);
                  };
                  case null {
                    return #err("Admin user not found");
                  };
                };
              };
              case false {
                let name = "admin";
                let qtyToken : Int64 = 0;
                let authResult = await UserServices.authenticateUser(users, tokenEntries, depositAddr, qtyToken, userId, #admin, name);
                switch (authResult) {
                  case (#err(errorMsg)) {
                    return #err(errorMsg);
                  };
                  case (#ok(userData)) {
                    return #ok(userData);
                  };
                };
              };
            };
          };
          case false {
            // Regular user with provided key
            let id = await GlobalHelper.GenerateUUID();
            let name = "user-" # id;
            let qtyToken : Int64 = 3;

            let authResult = await UserServices.authenticateUser(users, tokenEntries, depositAddr, qtyToken, userId, #user, name);
            switch (authResult) {
              case (#err(errorMsg)) {
                return #err(errorMsg);
              };
              case (#ok(userData)) {
                // Create profile after successful authentication
                switch (await ProfileServices.createUserProfile(profiles, Principal.toText(userId))) {
                  case (#err(profileError)) {
                    Debug.print("Profile creation failed: " # profileError);
                    return #ok(userData); // Still return success, profile is optional
                  };
                  case (#ok(_)) {
                    return #ok(userData);
                  };
                };
              };
            };
          };
        };
      };
      case null {
        // No key provided - create regular user
        let id = await GlobalHelper.GenerateUUID();
        let name = "user-" # id;
        let qtyToken : Int64 = 3;

        let authResult = await UserServices.authenticateUser(users, tokenEntries, depositAddr, qtyToken, userId, #user, name);
        switch (authResult) {
          case (#err(errorMsg)) {
            return #err(errorMsg);
          };
          case (#ok(userData)) {
            // Create profile after successful authentication
            switch (await ProfileServices.createUserProfile(profiles, Principal.toText(userId))) {
              case (#err(profileError)) {
                Debug.print("Profile creation failed: " # profileError);
                return #ok(userData); // Still return success, profile is optional
              };
              case (#ok(_)) {
                return #ok(userData);
              };
            };
          };
        };
      };
    };
  };

  public shared (msg) func getUserById() : async Result.Result<UserTypes.UserData, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot authenticate");
    };
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

  // TODO: Only for development - remove this after function is ready
  public shared (msg) func getUserByIdDevelopment(userId : Principal) : async Result.Result<UserTypes.UserData, Text> {
    // let userId = msg.caller;

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
  // Analytics Methods
  // ==============================

  public shared func getMonthlyAnalyzeData() : async TransactionTypes.MonthlyAnalyzeDataArray {
    switch (tokenEntries.size()) {
      case (0) { [] };
      case (_) {
        Analytics.getMonthlyAnalyzeData(tokenEntries);
      };
    };
  };

  public shared func getPackagePurchaseData() : async TransactionTypes.PackagePurchaseData {
    switch (transactions.size()) {
      case (0) { [] };
      case (_) {
        switch (packages.size()) {
          case (0) {
            Debug.print("Warning: No packages available");
            [];
          };
          case (_) {
            Analytics.getPackagePurchaseDataCached(transactions, packages);
          };
        };
      };
    };
  };
  // ==============================
  // Resume Analysis Methods
  // ==============================

  public shared (msg) func AnalyzeResumeV2(fileName : Text, historycid : Text, resumeContent : Text, jobTitle : Text) : async ?HistoryTypes.History {
    let userId = Principal.toText(msg.caller);
    Debug.print("Caller Principal for AnalyzeResume: " # userId);

    let user = TransactionServices.hasSufficientBalance(users, msg.caller, 2);

    switch (user) {
      case (#err(message)) {
        Debug.print(message);
        return null;
      };
      case (#ok(message)) {};
    };

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

            let resTrans = TransactionServices.chargeTokenBalance(
              users,
              tokenEntries,
              msg.caller,
              "Analyze Resume",
              #analyze,
              -1,
            );

            switch (resTrans) {
              case (#err(message)) {
                null;
              };
              case (#ok(message)) {
                ?history;
              };
            }

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
  // Updated extractResumeToDraft function
  public shared (msg) func extractResumeToDraft(historyId : Text, resumeContent : Text) : async ?ResumeExtractTypes.ResumeData {
    if (Principal.isAnonymous(msg.caller)) {
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

        let historyItem : ResumeExtractTypes.ResumeHistoryItem = {
          historyId = historyId;
          data = resumeData;
          createdAt = formatted;
          updatedAt = formatted;
        };

        // Store using historyId as key (not userId)
        draftMap.put(historyId, historyItem);

        return ?resumeData;
      };
    };
  };

  // ==============================
  // Draft Management Methods
  // ==============================

  // editWorkExperienceDraft - removed userId parameter
  public shared (msg) func editWorkExperienceDraft(
    historyId : Text,
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

    let result = await DraftServices.editWorkExperienceDraft(draftMap, historyId, workExpId, updatedFields);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Work experience draft updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update work experience draft: " # errMsg);
      };
    };
  };

  // editEducationDraft - fixed field names and removed userId parameter
  public shared (msg) func editEducationDraft(
    historyId : Text,
    educationId : Text,
    updatedFields : {
      institution : Text;
      degree : Text;
      period : {
        // Changed from study_period to period
        start : ?Text;
        end : ?Text;
      };
      description : ?Text; // Removed score field
    },
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot edit drafts");
    };

    let result = await DraftServices.editEducationDraft(draftMap, historyId, educationId, updatedFields);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Education draft updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update education draft: " # errMsg);
      };
    };
  };

  // editSkillsDraft - removed userId parameter
  public shared (msg) func editSkillsDraft(
    historyId : Text,
    skills : [Text],
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot edit drafts");
    };

    let result = await DraftServices.editSkillsDraft(draftMap, historyId, skills);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Skills draft updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update skills draft: " # errMsg);
      };
    };
  };

  // editSummaryDraft - new function
  public shared (msg) func editSummaryDraft(
    historyId : Text,
    summary : Text,
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot edit drafts");
    };

    let result = await DraftServices.editSummaryDraft(draftMap, historyId, summary);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Summary draft updated successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to update summary draft: " # errMsg);
      };
    };
  };

  // deleteWorkExperience - updated function name and parameters
  public shared (msg) func deleteWorkExperience(
    historyId : Text,
    workExpId : Text,
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot delete draft items");
    };

    let result = await DraftServices.deleteWorkExperience(draftMap, historyId, workExpId);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Work experience deleted successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to delete work experience: " # errMsg);
      };
    };
  };

  // deleteEducation - updated function name and parameters
  public shared (msg) func deleteEducation(
    historyId : Text,
    educationId : Text,
  ) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot delete draft items");
    };

    let result = await DraftServices.deleteEducation(draftMap, historyId, educationId);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Education deleted successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to delete education: " # errMsg);
      };
    };
  };

  // saveDraftToProfile - updated parameter order
  public shared (msg) func saveDraftToProfile(historyId : Text) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot save drafts to profiles");
    };
    let userId = Principal.toText(msg.caller);

    let result = await DraftServices.saveDraftToProfile(draftMap, profiles, userId, historyId);
    switch (result) {
      case (#ok(successMsg)) {
        #ok("Draft saved to profile successfully");
      };
      case (#err(errMsg)) {
        #err("Failed to save draft to profile: " # errMsg);
      };
    };
  };

  // getDraftByHistoryId - new function
  public shared (msg) func getDraftByHistoryId(historyId : Text) : async Result.Result<ResumeExtractTypes.ResumeHistoryItem, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous users cannot access drafts");
    };

    let result = await DraftServices.getDraftByHistoryId(draftMap, historyId);
    switch (result) {
      case (#ok(item)) {
        #ok(item);
      };
      case (#err(errMsg)) {
        #err("Failed to get draft: " # errMsg);
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
    let userId = Principal.toText(msg.caller);
    return await ProfileServices.globalSearch(userId, profiles, searchInput);
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
    return HistoryServices.deleteHistory(histories, draftMap, userId, input.historyId);
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

  public shared (msg) func deleteAllPackages() : async Result.Result<Text, Text> {
    for (k in packages.keys()) {
      packages.delete(k);
    };
    return #ok("Success delete all packages");
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

    switch (tokenEntries.get(Principal.fromText(userId))) {
      case (null) { [] };
      case (?entries) { entries };
    };
  };

  // TODO: Remove this after development
  public shared (msg) func getUserTokenEntriesDevelopment(userId : Text) : async [TransactionTypes.TokenEntry] {
    switch (tokenEntries.get(Principal.fromText(userId))) {
      case (null) { [] };
      case (?entries) { entries };
    };
  };

  public shared (msg) func checkUserICPBalance(chargedBalance : Nat) : async Result.Result<Text, Text> {
    let currBalance = await UserServices.getBalance(msg.caller);

    if (currBalance < chargedBalance) {
      return #err("Insufficient ICP Balance");
    };

    #ok("Validated");
  };

  public shared (msg) func createTransaction(packageId : Text) : async Result.Result<TransactionTypes.Transaction, Text> {
    let userId = msg.caller;
    Debug.print(Principal.toText(userId));
    let package : ?PackageTypes.Package = await PackageServices.getPackageById(packages, packageId);
    switch (package) {
      case (null) {
        return #err("Selected package is not found");
      };
      case (?pkg) {
        let balance = await UserServices.getBalance(userId);
        if (balance < pkg.price) {
          return #err("Insufficient balance");
        };

        return await TransactionServices.createTransaction(transactions, tokenEntries, users, pkg, userId);
      };
    };

  };
};
