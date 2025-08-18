import ResumeExtractTypes "../types/ResumeExtractTypes";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Array "mo:base/Array";
import DateHelper "../helpers/DateHelper";
import ProfileTypes "../types/ProfileTypes";

module DraftServices {
  //edit work experience
  public func editWorkExperienceDraft(
    draftMap : ResumeExtractTypes.Draft,
    draftId : Text,
    userId : Text,
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

    let draftItems = switch (draftMap.get(userId)) {
      case null { return #err("Draft not found") };
      case (?arr) arr;
    };

    let maybeResumeItem = Array.find<ResumeExtractTypes.ResumeHistoryItem>(
      draftItems,
      func(item) {
        item.draftId == draftId;
      },
    );

    switch (maybeResumeItem) {
      case null { return #err("Draft ID not found") };
      case (?resumeItem) {

        let workExpsArray : [ResumeExtractTypes.WorkExperience] = switch (resumeItem.data.workExperiences) {
          case null { return #err("No work experiences in this draft") };
          case (?arr) arr;
        };

        var found : Bool = false;

        let updatedWorkExps : [ResumeExtractTypes.WorkExperience] = Array.map(
          workExpsArray,
          func(we : ResumeExtractTypes.WorkExperience) : ResumeExtractTypes.WorkExperience {
            if (we.id == workExpId) {
              found := true;
              return {
                we with
                company = updatedFields.company;
                location = updatedFields.location;
                position = updatedFields.position;
                employment_type = updatedFields.employment_type;
                period = updatedFields.period;
                description = updatedFields.description;
              };
            } else we;
          },
        );

        if (not found) return #err("Work experience ID not found");

        let updatedResumeItem : ResumeExtractTypes.ResumeHistoryItem = {
          resumeItem with
          data = {
            resumeItem.data with
            workExperiences = ?updatedWorkExps;
          };
          updatedAt = DateHelper.formatTimestamp(Time.now());
        };

        let updatedDraftItems : [ResumeExtractTypes.ResumeHistoryItem] = Array.map(
          draftItems,
          func(item : ResumeExtractTypes.ResumeHistoryItem) : ResumeExtractTypes.ResumeHistoryItem {
            if (item.draftId == draftId) updatedResumeItem else item;
          },
        );

        draftMap.put(userId, updatedDraftItems);

        return #ok("Work experience updated successfully");
      };
    };
  };

  //edit education
  public func editEducationDraft(
    draftMap : ResumeExtractTypes.Draft,
    draftId : Text,
    userId : Text,
    educationId : Text,
    updatedFields : {
      institution : Text;
      degree : Text;
      study_period : {
        start : ?Text;
        end : ?Text;
      };
      description : ?Text;
    },
  ) : async Result.Result<Text, Text> {

    let draftItems = switch (draftMap.get(userId)) {
      case null { return #err("Draft not found") };
      case (?arr) arr;
    };

    let maybeResumeItem = Array.find<ResumeExtractTypes.ResumeHistoryItem>(
      draftItems,
      func(item) {
        item.draftId == draftId;
      },
    );

    switch (maybeResumeItem) {
      case null { return #err("Draft ID not found") };
      case (?resumeItem) {

        let educationsArray : [ResumeExtractTypes.Education] = switch (resumeItem.data.educations) {
          case null { return #err("No educations in this draft") };
          case (?arr) arr;
        };

        var found : Bool = false;

        let updatedEducations : [ResumeExtractTypes.Education] = Array.map(
          educationsArray,
          func(ed : ResumeExtractTypes.Education) : ResumeExtractTypes.Education {
            if (ed.id == educationId) {
              found := true;
              return {
                ed with
                institution = updatedFields.institution;
                degree = updatedFields.degree;
                period = updatedFields.study_period;
                description = updatedFields.description;
              };
            } else ed;
          },
        );

        if (not found) return #err("Education ID not found");

        let updatedResumeItem : ResumeExtractTypes.ResumeHistoryItem = {
          resumeItem with
          data = {
            resumeItem.data with
            educations = ?updatedEducations;
          };
          updatedAt = DateHelper.formatTimestamp(Time.now());
        };

        let updatedDraftItems : [ResumeExtractTypes.ResumeHistoryItem] = Array.map(
          draftItems,
          func(item : ResumeExtractTypes.ResumeHistoryItem) : ResumeExtractTypes.ResumeHistoryItem {
            if (item.draftId == draftId) updatedResumeItem else item;
          },
        );

        draftMap.put(userId, updatedDraftItems);

        return #ok("Education updated successfully");
      };
    };
  };

  //edit summary
  public func editSummaryDraft(
    draftMap : ResumeExtractTypes.Draft,
    draftId : Text,
    userId : Text,
    updatedSummary : Text,
  ) : async Result.Result<Text, Text> {

    let draftItems = switch (draftMap.get(userId)) {
      case null { return #err("Draft not found") };
      case (?arr) arr;
    };

    let maybeResumeItem = Array.find<ResumeExtractTypes.ResumeHistoryItem>(
      draftItems,
      func(item : ResumeExtractTypes.ResumeHistoryItem) : Bool {
        item.draftId == draftId;
      },
    );

    switch (maybeResumeItem) {
      case null { return #err("Draft ID not found") };
      case (?resumeItem) {

        let summaryValue : ResumeExtractTypes.Summary = {
          content = updatedSummary;
        };

        let updatedData : ResumeExtractTypes.ResumeData = {
          resumeItem.data with
          summary = ?summaryValue;
        };

        let updatedResumeItem : ResumeExtractTypes.ResumeHistoryItem = {
          resumeItem with
          data = updatedData;
          updatedAt = DateHelper.formatTimestamp(Time.now());
        };

        let updatedDraftItems : [ResumeExtractTypes.ResumeHistoryItem] = Array.map(
          draftItems,
          func(item : ResumeExtractTypes.ResumeHistoryItem) : ResumeExtractTypes.ResumeHistoryItem {
            if (item.draftId == draftId) updatedResumeItem else item;
          },
        );

        draftMap.put(userId, updatedDraftItems);

        return #ok("Summary updated successfully");
      };
    };
  };

  //edit skills

  public func editSkillsDraft(
    draftMap : ResumeExtractTypes.Draft,
    draftId : Text,
    userId : Text,
    updatedSkills : [Text],
  ) : async Result.Result<Text, Text> {
    let draftItems = switch (draftMap.get(userId)) {
      case null { return #err("Draft not found") };
      case (?arr) arr;
    };

    let maybeResumeItem = Array.find<ResumeExtractTypes.ResumeHistoryItem>(
      draftItems,
      func(item : ResumeExtractTypes.ResumeHistoryItem) : Bool {
        item.draftId == draftId;
      },
    );

    switch (maybeResumeItem) {
      case null { return #err("Draft ID not found") };
      case (?resumeItem) {
        let skillsValue : ResumeExtractTypes.Skills = { skills = updatedSkills };

        let updatedData : ResumeExtractTypes.ResumeData = {
          resumeItem.data with skills = ?skillsValue
        };

        let updatedResumeItem : ResumeExtractTypes.ResumeHistoryItem = {
          resumeItem with
          data = updatedData;
          updatedAt = DateHelper.formatTimestamp(Time.now());
        };

        let updatedDraftItems : [ResumeExtractTypes.ResumeHistoryItem] = Array.map(
          draftItems,
          func(item : ResumeExtractTypes.ResumeHistoryItem) : ResumeExtractTypes.ResumeHistoryItem {
            if (item.draftId == draftId) updatedResumeItem else item;
          },
        );

        draftMap.put(userId, updatedDraftItems);
        return #ok("Skills updated successfully");
      };
    };
  };

  // ==================== DELETE GENERIC ====================

  public func deleteDraftItem(
    draftMap : ResumeExtractTypes.Draft,
    draftId : Text,
    userId : Text,
    itemType : Text,
    itemId : ?Text,
  ) : async Result.Result<Text, Text> {

    let draftItems = switch (draftMap.get(userId)) {
      case null { return #err("Draft not found") };
      case (?arr) arr;
    };

    let maybeResumeItem = Array.find<ResumeExtractTypes.ResumeHistoryItem>(
      draftItems,
      func(item : ResumeExtractTypes.ResumeHistoryItem) : Bool {
        item.draftId == draftId;
      },
    );

    switch (maybeResumeItem) {
      case null { return #err("Draft ID not found") };
      case (?resumeItem) {

        var updatedData : ResumeExtractTypes.ResumeData = resumeItem.data;

        switch (itemType) {
          case "workExperience" {
            switch (resumeItem.data.workExperiences) {
              case null { return #err("No work experiences to delete") };
              case (?arr) {
                switch (itemId) {
                  case null {
                    if (Array.size(arr) == 0) {
                      return #err("No work experiences to delete");
                    };
                    updatedData := {
                      updatedData with workExperiences = null
                    };
                  };
                  case (?id) {
                    let updatedWorkExps = Array.filter(arr, func(we : ResumeExtractTypes.WorkExperience) : Bool { we.id != id });
                    if (Array.size(updatedWorkExps) == Array.size(arr)) {
                      return #err("Work experience ID not found");
                    };
                    updatedData := {
                      updatedData with workExperiences = ?updatedWorkExps
                    };
                  };
                };
              };
            };
          };
          case "education" {
            switch (resumeItem.data.educations) {
              case null { return #err("No educations to delete") };
              case (?arr) {
                switch (itemId) {
                  case null {
                    if (Array.size(arr) == 0) {
                      return #err("No educations to delete");
                    };
                    updatedData := {
                      updatedData with educations = null
                    };
                  };
                  case (?id) {
                    let updatedEducations = Array.filter(arr, func(ed : ResumeExtractTypes.Education) : Bool { ed.id != id });
                    if (Array.size(updatedEducations) == Array.size(arr)) {
                      return #err("Education ID not found");
                    };
                    updatedData := {
                      updatedData with educations = ?updatedEducations
                    };
                  };
                };
              };
            };
          };
          case "summary" {
            switch (resumeItem.data.summary) {
              case null { return #err("No summary to delete") };
              case (?_) {
                updatedData := { updatedData with summary = null };
              };
            };
          };
          case "skills" {
            switch (resumeItem.data.skills) {
              case null { return #err("No skills to delete") };
              case (?_) {
                updatedData := { updatedData with skills = null };
              };
            };
          };
          case _ { return #err("Unknown item type") };
        };

        let updatedResumeItem : ResumeExtractTypes.ResumeHistoryItem = {
          resumeItem with
          data = updatedData;
          updatedAt = DateHelper.formatTimestamp(Time.now());
        };

        let updatedDraftItems : [ResumeExtractTypes.ResumeHistoryItem] = Array.map(
          draftItems,
          func(item : ResumeExtractTypes.ResumeHistoryItem) : ResumeExtractTypes.ResumeHistoryItem {
            if (item.draftId == draftId) updatedResumeItem else item;
          },
        );

        draftMap.put(userId, updatedDraftItems);

        // Return appropriate success message based on what was deleted
        let successMessage = switch (itemType, itemId) {
          case ("workExperience", null) "All work experiences deleted successfully";
          case ("workExperience", ?_) "Work experience deleted successfully";
          case ("education", null) "All educations deleted successfully";
          case ("education", ?_) "Education deleted successfully";
          case ("summary", _) "Summary deleted successfully";
          case ("skills", _) "Skills deleted successfully";
          case (_, _) "Item deleted successfully";
        };

        return #ok(successMessage);
      };
    };
  };

  // Save draft to profile

  public func saveDraftToProfile(
    draftMap : ResumeExtractTypes.Draft,
    profileMap : ProfileTypes.Profiles,
    draftId : Text,
    userId : Text,
  ) : async Result.Result<Text, Text> {

    let existingProfile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found for user") };
      case (?profile) profile;
    };

    let draftItems = switch (draftMap.get(userId)) {
      case null { return #err("Draft not found for user") };
      case (?arr) arr;
    };

    let draftItem = switch (
      Array.find<ResumeExtractTypes.ResumeHistoryItem>(
        draftItems,
        func(item : ResumeExtractTypes.ResumeHistoryItem) : Bool {
          item.draftId == draftId;
        },
      )
    ) {
      case null { return #err("Draft ID not found") };
      case (?item) item;
    };

    let profileResumeData : ProfileTypes.ResumeData = {
      summary = switch (draftItem.data.summary) {
        case null null;
        case (?summaryObj) ?{ content = ?summaryObj.content };
      };

      skills = switch (draftItem.data.skills) {
        case null null;
        case (?skillsObj) ?{ skills = skillsObj.skills };
      };

      workExperiences = switch (draftItem.data.workExperiences) {
        case null null;
        case (?workExpArray) {
          let convertedWorkExp = Array.map<ResumeExtractTypes.WorkExperience, ProfileTypes.WorkExperience>(
            workExpArray,
            func(we : ResumeExtractTypes.WorkExperience) : ProfileTypes.WorkExperience {
              {
                id = we.id;
                company = we.company;
                location = ?we.location;
                position = we.position;
                employment_type = we.employment_type;
                period = {
                  start = we.period.start;
                  end = we.period.end;
                };
                description = we.description;
              };
            },
          );
          ?convertedWorkExp;
        };
      };

      educations = switch (draftItem.data.educations) {
        case null null;
        case (?educationArray) {
          let convertedEducations = Array.map<ResumeExtractTypes.Education, ProfileTypes.Education>(
            educationArray,
            func(edu : ResumeExtractTypes.Education) : ProfileTypes.Education {
              {
                id = edu.id;
                institution = ?edu.institution;
                degree = ?edu.degree;
                period = {
                  start = edu.period.start;
                  end = edu.period.end;
                };
                description = edu.description;
              };
            },
          );
          ?convertedEducations;
        };
      };
    };

    let updatedProfile : ProfileTypes.Profile = {
      existingProfile with
      resume = ?profileResumeData;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);

    // Remove the draft from draft map
    // let remainingDrafts = Array.filter<ResumeExtractTypes.ResumeHistoryItem>(
    //   draftItems,
    //   func(item : ResumeExtractTypes.ResumeHistoryItem) : Bool {
    //     item.draftId != draftId;
    //   },
    // );

    // if (Array.size(remainingDrafts) == 0) {
    //   draftMap.delete(userId);
    // } else {
    //   draftMap.put(userId, remainingDrafts);
    // };

    return #ok("Draft successfully saved to profile");
  };
};
