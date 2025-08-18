import Array "mo:base/Array";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Random "mo:base/Random";
import UUID "mo:idempotency-keys/idempotency-keys";

import DateHelper "../helpers/DateHelper";
import ProfileTypes "../types/ProfileTypes";

module ProfileServices {

  // utils
  // public func getProfileByProfileId(
  //   profiles : ProfileTypes.Profiles,
  //   profileId : Text,
  // ) : async ?ProfileTypes.Profile {
  //   for ((_, profile) in profiles.entries()) {
  //     if (profile.profileId == profileId) {
  //       return ?profile;
  //     };
  //   };
  //   return null;
  // };

  // public func getProfileByUserId(
  //   profiles : ProfileTypes.Profiles,
  //   userId : Text,
  // ) : async ?ProfileTypes.Profile {
  //   switch (profiles.get(userId)) {
  //     case null { return null };
  //     case (?profile) { return ?profile };
  //   };
  // };

  public func getProfileByProfileId(
    profiles : ProfileTypes.Profiles,
    profileId : Text,
  ) : async ?{
    profile : ProfileTypes.Profile;
    endorsementInfo : [{
      userId : Text;
      name : ?Text;
      avatar : ?Text;
    }];
  } {
    for ((_, profile) in profiles.entries()) {
      if (profile.profileId == profileId) {
        let endorsementInfo = switch (profile.endorsements) {
          case (?endorsementIds) {
            getEndorsementBasicInfo(profiles, endorsementIds);
          };
          case null { [] };
        };

        return ?{
          profile = profile;
          endorsementInfo = endorsementInfo;
        };
      };
    };
    return null;
  };

  public func getProfileByUserId(
    profiles : ProfileTypes.Profiles,
    userId : Text,
  ) : async ?{
    profile : ProfileTypes.Profile;
    endorsementInfo : [{
      userId : Text;
      name : ?Text;
      avatar : ?Text;
    }];
  } {
    switch (profiles.get(userId)) {
      case null { return null };
      case (?profile) {
        let endorsementInfo = switch (profile.endorsements) {
          case (?endorsementIds) {
            getEndorsementBasicInfo(profiles, endorsementIds);
          };
          case null { [] };
        };

        return ?{
          profile = profile;
          endorsementInfo = endorsementInfo;
        };
      };
    };
  };

  public func getEndorsementBasicInfo(
    profiles : ProfileTypes.Profiles,
    endorsementUserIds : [Text],
  ) : [{
    userId : Text;
    name : ?Text;
    avatar : ?Text;
  }] {
    var results : [{
      userId : Text;
      name : ?Text;
      avatar : ?Text;
    }] = [];

    for (userId in endorsementUserIds.vals()) {
      switch (profiles.get(userId)) {
        case (?profile) {
          let name = switch (profile.profileDetail) {
            case (?detail) { detail.name };
            case null { null };
          };

          let avatar = switch (profile.profileDetail) {
            case (?detail) { detail.profileCid };
            case null { null };
          };

          let endorsementInfo = {
            userId = userId;
            name = name;
            avatar = avatar;
          };
          results := Array.append(results, [endorsementInfo]);
        };
        case null {};
      };
    };

    results;
  };

  // create a new user profile
  public func createUserProfile(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    profileDetailInput : ?{
      name : ?Text;
      profileCid : ?Text;
      bannerCid : ?Text;
      current_position : ?Text;
      description : ?Text;
    },
  ) : async Result.Result<Text, Text> {
    switch (profileMap.get(userId)) {
      case (?_) { return #err("Profile already exists for this user") };
      case null {
        let entropy = await Random.blob();
        let profileId = UUID.generateV4(entropy);
        let newProfile : ProfileTypes.Profile = {
          userId = userId;
          profileId = profileId;
          profileDetail = switch (profileDetailInput) {
            case null { null };
            case (?input) {
              ?{
                name = input.name;
                profileCid = input.profileCid;
                bannerCid = input.bannerCid;
                current_position = input.current_position;
                description = input.description;
              };
            };
          };
          contact = null;
          resume = null;
          certificatons = null;
          endorsements = null;
          endorsedProfiles = null;
          createdAt = DateHelper.formatTimestamp(Time.now());
          updatedAt = DateHelper.formatTimestamp(Time.now());
        };

        profileMap.put(userId, newProfile);
        return #ok("User profile created successfully");
      };
    };
  };

  public func updateProfileDetailAndContact(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    profileDetailInput : ?{
      name : ?Text;
      current_position : ?Text;
      description : ?Text;
    },
    contactInfo : ?ProfileTypes.ContactInfo,
  ) : async Result.Result<Text, Text> {
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };

    let updatedProfileDetail = switch (profileDetailInput) {
      case null { profile.profileDetail };
      case (?input) {
        let existingDetail = switch (profile.profileDetail) {
          case null {
            {
              name = null;
              profileCid = null;
              bannerCid = null;
              current_position = null;
              description = null;
            };
          };
          case (?detail) detail;
        };

        ?{
          name = switch (input.name) {
            case null { existingDetail.name };
            case (?n) { ?n };
          };
          profileCid = existingDetail.profileCid;
          bannerCid = existingDetail.bannerCid;

          current_position = switch (input.current_position) {
            case null { existingDetail.current_position };
            case (?pos) { ?pos };
          };
          description = switch (input.description) {
            case null { existingDetail.description };
            case (?desc) { ?desc };
          };
        };
      };
    };

    let updatedContact = switch (contactInfo) {
      case null { profile.contact };
      case (?contact) { ?contact };
    };

    let updatedProfile : ProfileTypes.Profile = {
      profile with
      profileDetail = updatedProfileDetail;
      contact = updatedContact;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);
    return #ok("Profile detail and contact info updated successfully");
  };

  public func updateProfilePicture(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    profileCid : Text,
  ) : async Result.Result<Text, Text> {
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };

    let updatedProfileDetail = switch (profile.profileDetail) {
      case null {
        ?{
          name = null;
          profileCid = ?profileCid;
          bannerCid = null;
          current_position = null;
          description = null;
        };
      };
      case (?existingDetail) {
        ?{
          existingDetail with profileCid = ?profileCid
        };
      };
    };

    let updatedProfile : ProfileTypes.Profile = {
      profile with
      profileDetail = updatedProfileDetail;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);
    return #ok("Profile picture updated successfully");
  };

  public func updateBannerPicture(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    bannerCid : Text,
  ) : async Result.Result<Text, Text> {
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };

    let updatedProfileDetail = switch (profile.profileDetail) {
      case null {
        // Create new profileDetail if it doesn't exist
        ?{
          name = null;
          profileCid = null;
          bannerCid = ?bannerCid;
          current_position = null;
          description = null;
        };
      };
      case (?existingDetail) {
        // Update existing profileDetail
        ?{
          existingDetail with bannerCid = ?bannerCid
        };
      };
    };

    let updatedProfile : ProfileTypes.Profile = {
      profile with
      profileDetail = updatedProfileDetail;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);
    return #ok("Banner picture updated successfully");
  };

  // work experience management
  public func addWorkExperience(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
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
    },
  ) : async Result.Result<Text, Text> {
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };

    let id = UUID.generateV4(await Random.blob());
    let newId = "we-" #id;

    let newWorkExp : ProfileTypes.WorkExperience = {
      id = newId;
      company = newWorkExperience.company;
      location = newWorkExperience.location;
      position = newWorkExperience.position;
      employment_type = newWorkExperience.employment_type;
      period = newWorkExperience.period;
      description = newWorkExperience.description;
    };

    let resumeData = switch (profile.resume) {
      case null {
        // IF NULL: Create new resume data with just the new work experience
        {
          summary = null;
          workExperiences = ?[newWorkExp]; // Start with first work experience
          educations = null;
          skills = null;
        };
      };
      case (?resume) {
        // IF NOT NULL: Continue adding more work experiences
        let currentWorkExps = switch (resume.workExperiences) {
          case null { [] }; // If workExperiences array is null, start with empty array
          case (?arr) { arr }; // If workExperiences exist, use existing array
        };
        let updatedWorkExps = Array.append(currentWorkExps, [newWorkExp]); // Add new one to existing

        {
          resume with
          workExperiences = ?updatedWorkExps; // Keep all other fields, update workExperiences
        };
      };
    };

    let updatedProfile = {
      profile with
      resume = ?resumeData;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);
    return #ok(Text.concat("Work experience added successfully with ID: ", newId));
  };

  public func editWorkExperience(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
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
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };

    let resumeData = switch (profile.resume) {
      case null { return #err("No resume data found") };
      case (?resume) resume;
    };

    let workExpsArray = switch (resumeData.workExperiences) {
      case null { return #err("No work experiences found") };
      case (?arr) arr;
    };

    var found : Bool = false;
    let updatedWorkExps = Array.map(
      workExpsArray,
      func(we : ProfileTypes.WorkExperience) : ProfileTypes.WorkExperience {
        if (we.id == workExpId) {
          found := true;
          {
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

    let updatedResumeData = {
      resumeData with
      workExperiences = ?updatedWorkExps;
    };

    let updatedProfile = {
      profile with
      resume = ?updatedResumeData;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);
    return #ok("Work experience updated successfully");
  };

  // education management
  public func addEducation(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    newEducation : {
      institution : ?Text;
      degree : ?Text;
      period : {
        start : ?Text;
        end : ?Text;
      };
      description : ?Text;
    },
  ) : async Result.Result<Text, Text> {
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };
    let newId = "edu-" # UUID.generateV4(await Random.blob());

    let newEd : ProfileTypes.Education = {
      id = newId;
      institution = newEducation.institution;
      degree = newEducation.degree;
      period = newEducation.period;
      description = newEducation.description;
    };

    let resumeData = switch (profile.resume) {
      case null {
        {
          summary = null;
          workExperiences = null;
          educations = ?[newEd];
          skills = null;
        };
      };
      case (?resume) {
        let currentEducations = switch (resume.educations) {
          case null { [] };
          case (?arr) { arr };
        };
        let updatedEducations = Array.append(currentEducations, [newEd]);
        {
          resume with
          educations = ?updatedEducations;
        };
      };
    };

    let updatedProfile = {
      profile with
      resume = ?resumeData;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);
    return #ok(Text.concat("Education added successfully with ID: ", newId));
  };

  public func editEducation(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
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
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };

    let resumeData = switch (profile.resume) {
      case null { return #err("No resume data found") };
      case (?resume) resume;
    };

    let educationsArray = switch (resumeData.educations) {
      case null { return #err("No educations found") };
      case (?arr) arr;
    };

    var found : Bool = false;
    let updatedEducations = Array.map(
      educationsArray,
      func(ed : ProfileTypes.Education) : ProfileTypes.Education {
        if (ed.id == educationId) {
          found := true;
          {
            ed with
            institution = updatedFields.institution;
            degree = updatedFields.degree;
            period = updatedFields.period;
            description = updatedFields.description;
          };
        } else ed;
      },
    );

    if (not found) return #err("Education ID not found");

    let updatedResumeData = {
      resumeData with
      educations = ?updatedEducations;
    };

    let updatedProfile = {
      profile with
      resume = ?updatedResumeData;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);
    return #ok("Education updated successfully");
  };

  // summary management
  public func editSummary(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    updatedSummary : ?Text,
  ) : async Result.Result<Text, Text> {
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };
    let resumeData = switch (profile.resume) {
      case null {
        // Create new resume data with just summary
        {
          summary = ?{ content = updatedSummary };
          workExperiences = null;
          educations = null;
          skills = null;
        };
      };
      case (?resume) {
        {
          resume with
          summary = ?{ content = updatedSummary };
        };
      };
    };
    let updatedProfile = {
      profile with
      resume = ?resumeData;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };
    profileMap.put(userId, updatedProfile);
    return #ok("Summary updated successfully");
  };

  // skills management
  public func editSkills(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    updatedSkills : [Text],
  ) : async Result.Result<Text, Text> {
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };

    let resumeData = switch (profile.resume) {
      case null {
        // Create new resume data with just skills
        {
          summary = null;
          workExperiences = null;
          educations = null;
          skills = ?{ skills = updatedSkills };
        };
      };
      case (?resume) {
        {
          resume with
          skills = ?{ skills = updatedSkills };
        };
      };
    };

    let updatedProfile = {
      profile with
      resume = ?resumeData;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);
    return #ok("Skills updated successfully");
  };
  // delete resume items
  public func deleteResumeItem(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    itemType : Text,
    itemId : ?Text,
  ) : async Result.Result<Text, Text> {
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };

    let resumeData = switch (profile.resume) {
      case null { return #err("No resume data found") };
      case (?resume) resume;
    };

    var updatedResumeData = resumeData;

    switch (itemType) {
      case "workExperience" {
        switch (resumeData.workExperiences) {
          case null { return #err("No work experiences to delete") };
          case (?arr) {
            switch (itemId) {
              case null {
                updatedResumeData := {
                  updatedResumeData with workExperiences = null
                };
              };
              case (?id) {
                let filteredWorkExps = Array.filter(arr, func(we : ProfileTypes.WorkExperience) : Bool { we.id != id });
                if (Array.size(filteredWorkExps) == Array.size(arr)) {
                  return #err("Work experience ID not found");
                };
                updatedResumeData := {
                  updatedResumeData with workExperiences = ?filteredWorkExps
                };
              };
            };
          };
        };
      };
      case "education" {
        switch (resumeData.educations) {
          case null { return #err("No educations to delete") };
          case (?arr) {
            switch (itemId) {
              case null {
                updatedResumeData := {
                  updatedResumeData with educations = null
                };
              };
              case (?id) {
                let filteredEducations = Array.filter(arr, func(ed : ProfileTypes.Education) : Bool { ed.id != id });
                if (Array.size(filteredEducations) == Array.size(arr)) {
                  return #err("Education ID not found");
                };
                updatedResumeData := {
                  updatedResumeData with educations = ?filteredEducations
                };
              };
            };
          };
        };
      };
      case "summary" {
        switch (resumeData.summary) {
          case null { return #err("No summary to delete") };
          case (?_) {
            updatedResumeData := { updatedResumeData with summary = null };
          };
        };
      };
      case "skills" {
        switch (resumeData.skills) {
          case null { return #err("No skills to delete") };
          case (?_) {
            updatedResumeData := { updatedResumeData with skills = null };
          };
        };
      };
      case _ { return #err("Unknown item type") };
    };

    let updatedProfile = {
      profile with
      resume = ?updatedResumeData;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);

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

  // certification management
  public func addCertification(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    certInput : {
      title : Text;
      issuer : ?Text;
      credential_url : ?Text;
    },
  ) : async Result.Result<Text, Text> {
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };

    let currentCertifications = switch (profile.certificatons) {
      case null { [] };
      case (?certs) certs;
    };
    let now = Time.now();
    let createdAt = DateHelper.formatTimestamp(now);
    let id = UUID.generateV4(await Random.blob());
    let newId = "cert-" # id;

    let certification : ProfileTypes.Certificate = {
      id = newId;
      title = certInput.title;
      issuer = certInput.issuer;
      credential_url = certInput.credential_url;
      createdAt = createdAt;
      updatedAt = createdAt;
    };

    // Append
    let newCertifications = Array.append(currentCertifications, [certification]);
    let updatedProfile = {
      profile with
      certificatons = ?newCertifications;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);
    return #ok("Certification added successfully with ID=" # newId);
  };

  public func updateCertification(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    certificationId : Text,
    updatedFields : {
      title : Text;
      issuer : ?Text;
      credential_url : ?Text;
    },
  ) : async Result.Result<Text, Text> {
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };

    let certificationsArray = switch (profile.certificatons) {
      case null { return #err("No certifications found") };
      case (?certs) certs;
    };

    var found : Bool = false;
    let updatedCertifications = Array.map(
      certificationsArray,
      func(cert : ProfileTypes.Certificate) : ProfileTypes.Certificate {
        if (cert.id == certificationId) {
          found := true;
          {
            cert with
            title = updatedFields.title;
            issuer = updatedFields.issuer;
            credential_url = updatedFields.credential_url;
          };
        } else cert;
      },
    );

    if (not found) return #err("Certification ID not found");

    let updatedProfile = {
      profile with
      certificatons = ?updatedCertifications;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);
    return #ok("Certification updated successfully");
  };

  public func deleteCertification(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    certificationId : ?Text,
  ) : async Result.Result<Text, Text> {
    let profile = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profile) profile;
    };

    let certificationsArray = switch (profile.certificatons) {
      case null { return #err("No certifications to delete") };
      case (?certs) certs;
    };

    let (updatedCertifications, successMessage) = switch (certificationId) {
      case null {
        // Delete all certifications
        (null, "All certifications deleted successfully");
      };
      case (?id) {
        // Delete specific certification
        let filteredCertifications = Array.filter(certificationsArray, func(cert : ProfileTypes.Certificate) : Bool { cert.id != id });
        if (Array.size(filteredCertifications) == Array.size(certificationsArray)) {
          return #err("Certification ID not found");
        };
        (?filteredCertifications, "Certification deleted successfully");
      };
    };

    let updatedProfile = {
      profile with
      certificatons = updatedCertifications;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    profileMap.put(userId, updatedProfile);
    return #ok(successMessage);
  };

  public func globalSearch(
    profiles : ProfileTypes.Profiles,
    searchInput : Text,
  ) : async [ProfileTypes.SearchResult] {
    if (Text.size(searchInput) == 0) {
      return [];
    };

    let lower = Text.toLowercase(searchInput);
    var results : [ProfileTypes.SearchResult] = [];

    for ((userId, profile) in profiles.entries()) {
      var match = false;

      switch (profile.profileDetail) {
        case (?detail) {
          switch (detail.name) {
            case (?name) {
              if (Text.contains(Text.toLowercase(name), #text lower)) {
                match := true;
              };
            };
            case null {};
          };

          if (not match) {
            switch (detail.current_position) {
              case (?position) {
                if (Text.contains(Text.toLowercase(position), #text lower)) {
                  match := true;
                };
              };
              case null {};
            };
          };

          if (not match) {
            switch (detail.description) {
              case (?desc) {
                if (Text.contains(Text.toLowercase(desc), #text lower)) {
                  match := true;
                };
              };
              case null {};
            };
          };
        };
        case null {};
      };

      // Check ResumeData if no match yet
      // if (not match) {
      //   switch (profile.resume) {
      //     case (?resumeData) {
      //       // Check Summary
      //       switch (resumeData.summary) {
      //         case (?s) {
      //           switch (s.content) {
      //             case (?content) {
      //               if (Text.contains(Text.toLowercase(content), #text lower)) {
      //                 match := true;
      //               };
      //             };
      //             case null {};
      //           };
      //         };
      //         case null {};
      //       };

      //       // Check Skills
      //       if (not match) {
      //         switch (resumeData.skills) {
      //           case (?skillsObj) {
      //             let foundSkill = Array.find<Text>(
      //               skillsObj.skills,
      //               func(skill : Text) : Bool {
      //                 Text.contains(Text.toLowercase(skill), #text lower);
      //               },
      //             );
      //             switch (foundSkill) {
      //               case (?_) { match := true };
      //               case null {};
      //             };
      //           };
      //           case null {};
      //         };
      //       };

      //       // Check Work Experiences
      //       if (not match) {
      //         switch (resumeData.workExperiences) {
      //           case (?workExps) {
      //             let foundWork = Array.find<ProfileTypes.WorkExperience>(
      //               workExps,
      //               func(we : ProfileTypes.WorkExperience) : Bool {
      //                 var weMatch = false;

      //                 if (Text.contains(Text.toLowercase(we.company), #text lower)) {
      //                   weMatch := true;
      //                 };

      //                 if (not weMatch) {
      //                   switch (we.location) {
      //                     case (?loc) {
      //                       if (Text.contains(Text.toLowercase(loc), #text lower)) {
      //                         weMatch := true;
      //                       };
      //                     };
      //                     case null {};
      //                   };
      //                 };

      //                 if (not weMatch) {
      //                   if (Text.contains(Text.toLowercase(we.position), #text lower)) {
      //                     weMatch := true;
      //                   };
      //                 };

      //                 if (not weMatch) {
      //                   switch (we.description) {
      //                     case (?desc) {
      //                       if (Text.contains(Text.toLowercase(desc), #text lower)) {
      //                         weMatch := true;
      //                       };
      //                     };
      //                     case null {};
      //                   };
      //                 };

      //                 weMatch;
      //               },
      //             );

      //             switch (foundWork) {
      //               case (?_) { match := true };
      //               case null {};
      //             };
      //           };
      //           case null {};
      //         };
      //       };

      //       // Check Educations
      //       if (not match) {
      //         switch (resumeData.educations) {
      //           case (?edus) {
      //             let foundEdu = Array.find<ProfileTypes.Education>(
      //               edus,
      //               func(ed : ProfileTypes.Education) : Bool {
      //                 var eduMatch = false;

      //                 switch (ed.institution) {
      //                   case (?inst) {
      //                     if (Text.contains(Text.toLowercase(inst), #text lower)) {
      //                       eduMatch := true;
      //                     };
      //                   };
      //                   case null {};
      //                 };

      //                 if (not eduMatch) {
      //                   switch (ed.degree) {
      //                     case (?degree) {
      //                       if (Text.contains(Text.toLowercase(degree), #text lower)) {
      //                         eduMatch := true;
      //                       };
      //                     };
      //                     case null {};
      //                   };
      //                 };

      //                 if (not eduMatch) {
      //                   switch (ed.description) {
      //                     case (?desc) {
      //                       if (Text.contains(Text.toLowercase(desc), #text lower)) {
      //                         eduMatch := true;
      //                       };
      //                     };
      //                     case null {};
      //                   };
      //                 };

      //                 eduMatch;
      //               },
      //             );

      //             switch (foundEdu) {
      //               case (?_) { match := true };
      //               case null {};
      //             };
      //           };
      //           case null {};
      //         };
      //       };
      //     };
      //     case null {};
      //   };
      // };

      // If match found, add simplified result
      if (match) {
        let searchResult : ProfileTypes.SearchResult = {
          userId = profile.userId;
          profileId = profile.profileId;
          profileDetail = profile.profileDetail;
          endorsements = profile.endorsements;
        };
        results := Array.append<ProfileTypes.SearchResult>(results, [searchResult]);
      };
    };

    results;
  };

  public func addEndorsedProfile(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    targetUserId : Text,
  ) : async Result.Result<Text, Text> {

    // Get the endorser's profile (userId)
    let endorserProfile = switch (profileMap.get(userId)) {
      case null { return #err("Endorser profile not found") };
      case (?profile) profile;
    };

    // Get the target user's profile (targetUserId)
    let targetProfile = switch (profileMap.get(targetUserId)) {
      case null { return #err("Target profile not found") };
      case (?profile) profile;
    };

    // Check endorser's endorsedProfiles list
    let currentEndorsedProfiles = switch (endorserProfile.endorsedProfiles) {
      case null { [] };
      case (?endorsedProfiles) endorsedProfiles;
    };

    // Check target user's endorsements list
    let currentEndorsements = switch (targetProfile.endorsements) {
      case null { [] };
      case (?endorsements) endorsements;
    };

    // Check if already endorsed
    switch (Array.find<Text>(currentEndorsedProfiles, func(id : Text) : Bool { id == targetUserId })) {
      case (?_) { return #err("Profile already endorsed") };
      case null {
        // Add targetUserId to endorser's endorsedProfiles
        let newEndorsedProfiles = Array.append(currentEndorsedProfiles, [targetUserId]);

        // Add userId to target's endorsements
        let newEndorsements = Array.append(currentEndorsements, [userId]);

        // Update endorser's profile
        let updatedEndorserProfile = {
          endorserProfile with
          endorsedProfiles = ?newEndorsedProfiles;
          updatedAt = DateHelper.formatTimestamp(Time.now());
        };

        // Update target user's profile
        let updatedTargetProfile = {
          targetProfile with
          endorsements = ?newEndorsements;
          updatedAt = DateHelper.formatTimestamp(Time.now());
        };

        // Save both updated profiles
        profileMap.put(userId, updatedEndorserProfile);
        profileMap.put(targetUserId, updatedTargetProfile);

        return #ok("Mutual endorsement added successfully");
      };
    };
  };

  public func removeEndorsedProfile(
    profileMap : ProfileTypes.Profiles,
    userId : Text, // The user who is removing the endorsement
    targetUserId : Text, // The user who is being un-endorsed
  ) : async Result.Result<Text, Text> {

    // Get both profiles
    let endorserProfile = switch (profileMap.get(userId)) {
      case null { return #err("Endorser profile not found") };
      case (?profile) profile;
    };

    let targetProfile = switch (profileMap.get(targetUserId)) {
      case null { return #err("Target profile not found") };
      case (?profile) profile;
    };

    let currentEndorsedProfiles = switch (endorserProfile.endorsedProfiles) {
      case null { [] };
      case (?endorsedProfiles) endorsedProfiles;
    };

    let currentEndorsements = switch (targetProfile.endorsements) {
      case null { [] };
      case (?endorsements) endorsements;
    };

    let newEndorsedProfiles = Array.filter<Text>(currentEndorsedProfiles, func(id : Text) : Bool { id != targetUserId });
    let newEndorsements = Array.filter<Text>(currentEndorsements, func(id : Text) : Bool { id != userId });

    // Update endorser's profile
    let updatedEndorserProfile = {
      endorserProfile with
      endorsedProfiles = ?newEndorsedProfiles;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    // Update target user's profile
    let updatedTargetProfile = {
      targetProfile with
      endorsements = ?newEndorsements;
      updatedAt = DateHelper.formatTimestamp(Time.now());
    };

    // Save both updated profiles
    profileMap.put(userId, updatedEndorserProfile);
    profileMap.put(targetUserId, updatedTargetProfile);

    return #ok("Mutual endorsement removed successfully");
  };

};
