import Array "mo:base/Array";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Option "mo:base/Option";

import DateHelper "../helpers/DateHelper";
import ProfileTypes "../types/ProfileTypes";

module ProfileServices {

  // ================ PROFILE DETAIL CRUD ================

  public func updateProfileDetail(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    profileDetailInput : {
      name : Text;
      current_position : ?Text;
      description : ?Text;
    },
  ) : async Result.Result<Text, Text> {
    // Cek apakah user ada
    let profiles = switch (profileMap.get(userId)) {
      case null {
        return #err("Profile not found");
      };
      case (?profiles) { profiles };
    };

    // Update profile
    let updatedProfiles = Array.map<ProfileTypes.Profile, ProfileTypes.Profile>(
      profiles,
      func(profile : ProfileTypes.Profile) : ProfileTypes.Profile {
        // Ambil profilePicture lama kalau ada
        let existingProfilePicture = switch (profile.profileDetail) {
          case null { null };
          case (?detail) { detail.profilePicture };
        };

        // Buat detail baru dengan profilePicture lama, dan bungkus name ke ?Text
        let updatedProfileDetail : ProfileTypes.ProfileDetail = {
          profilePicture = existingProfilePicture;
          name = ?profileDetailInput.name; // bungkus ke optional
          current_position = profileDetailInput.current_position;
          description = profileDetailInput.description;
        };

        {
          profile with
          profileDetail = ?updatedProfileDetail;
          updatedAt = DateHelper.formatTimestamp(Time.now());
        };
      },
    );

    // Simpan lagi ke map
    profileMap.put(userId, updatedProfiles);

    return #ok("Profile detail updated successfully");
  };

  // ================ CONTACT INFO CRUD ================

  public func updateContactInfo(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
    contactInfo : ProfileTypes.ContactInfo,
  ) : async Result.Result<Text, Text> {
    let profiles = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profiles) profiles;
    };

    let updatedProfiles = Array.map<ProfileTypes.Profile, ProfileTypes.Profile>(
      profiles,
      func(profile : ProfileTypes.Profile) : ProfileTypes.Profile {
        {
          profile with
          contact = ?contactInfo;
          updatedAt = DateHelper.formatTimestamp(Time.now());
        };
      },
    );

    profileMap.put(userId, updatedProfiles);
    return #ok("Contact info updated successfully");
  };

  // ================ RESUME DATA CRUD ================

  // ================ ENDORSEMENTS CRUD ================

  public func addEndorsedProfile(
    profileMap : ProfileTypes.Profiles,
    userId : Text, // The user who is giving the endorsement
    targetUserId : Text, // The user who is being endorsed
  ) : async Result.Result<Text, Text> {

    // Get the endorser's profile (userId)
    let endorserProfiles = switch (profileMap.get(userId)) {
      case null { return #err("Endorser profile not found") };
      case (?profiles) profiles;
    };

    // Get the target user's profile (targetUserId)
    let targetProfiles = switch (profileMap.get(targetUserId)) {
      case null { return #err("Target profile not found") };
      case (?profiles) profiles;
    };

    let endorserProfile = endorserProfiles[0];
    let targetProfile = targetProfiles[0];

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
        let updatedEndorserProfiles = Array.map<ProfileTypes.Profile, ProfileTypes.Profile>(
          endorserProfiles,
          func(p : ProfileTypes.Profile) : ProfileTypes.Profile {
            {
              p with
              endorsedProfiles = ?newEndorsedProfiles;
              updatedAt = DateHelper.formatTimestamp(Time.now());
            };
          },
        );

        // Update target user's profile
        let updatedTargetProfiles = Array.map<ProfileTypes.Profile, ProfileTypes.Profile>(
          targetProfiles,
          func(p : ProfileTypes.Profile) : ProfileTypes.Profile {
            {
              p with
              endorsements = ?newEndorsements;
              updatedAt = DateHelper.formatTimestamp(Time.now());
            };
          },
        );

        // Save both updated profiles
        profileMap.put(userId, updatedEndorserProfiles);
        profileMap.put(targetUserId, updatedTargetProfiles);

        return #ok("Mutual endorsement added successfully");
      };
    };
  };

  // Optional: Add a function to remove endorsements (mutual removal)
  public func removeEndorsedProfile(
    profileMap : ProfileTypes.Profiles,
    userId : Text, // The user who is removing the endorsement
    targetUserId : Text, // The user who is being un-endorsed
  ) : async Result.Result<Text, Text> {

    // Get both profiles
    let endorserProfiles = switch (profileMap.get(userId)) {
      case null { return #err("Endorser profile not found") };
      case (?profiles) profiles;
    };

    let targetProfiles = switch (profileMap.get(targetUserId)) {
      case null { return #err("Target profile not found") };
      case (?profiles) profiles;
    };

    let endorserProfile = endorserProfiles[0];
    let targetProfile = targetProfiles[0];

    // Remove targetUserId from endorser's endorsedProfiles
    let currentEndorsedProfiles = switch (endorserProfile.endorsedProfiles) {
      case null { [] };
      case (?endorsedProfiles) endorsedProfiles;
    };

    // Remove userId from target's endorsements
    let currentEndorsements = switch (targetProfile.endorsements) {
      case null { [] };
      case (?endorsements) endorsements;
    };

    let newEndorsedProfiles = Array.filter<Text>(currentEndorsedProfiles, func(id : Text) : Bool { id != targetUserId });
    let newEndorsements = Array.filter<Text>(currentEndorsements, func(id : Text) : Bool { id != userId });

    // Update endorser's profile
    let updatedEndorserProfiles = Array.map<ProfileTypes.Profile, ProfileTypes.Profile>(
      endorserProfiles,
      func(p : ProfileTypes.Profile) : ProfileTypes.Profile {
        {
          p with
          endorsedProfiles = ?newEndorsedProfiles;
          updatedAt = DateHelper.formatTimestamp(Time.now());
        };
      },
    );

    // Update target user's profile
    let updatedTargetProfiles = Array.map<ProfileTypes.Profile, ProfileTypes.Profile>(
      targetProfiles,
      func(p : ProfileTypes.Profile) : ProfileTypes.Profile {
        {
          p with
          endorsements = ?newEndorsements;
          updatedAt = DateHelper.formatTimestamp(Time.now());
        };
      },
    );

    // Save both updated profiles
    profileMap.put(userId, updatedEndorserProfiles);
    profileMap.put(targetUserId, updatedTargetProfiles);

    return #ok("Mutual endorsement removed successfully");
  };

  // ================ READ INDIVIDUAL SECTIONS ================

  public func readEndorsements(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
  ) : async Result.Result<?[Text], Text> {
    let profiles = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profiles) profiles;
    };

    return #ok(profiles[0].endorsements);
  };

  public func readEndorsedProfiles(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
  ) : async Result.Result<?[Text], Text> {
    let profiles = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profiles) profiles;
    };

    return #ok(profiles[0].endorsedProfiles);
  };

  // ================ UTILITY FUNCTIONS ================

  public func getProfilebyUserId(
    profileMap : ProfileTypes.Profiles,
    userId : Text,
  ) : async Result.Result<ProfileTypes.Profile, Text> {
    let profiles = switch (profileMap.get(userId)) {
      case null { return #err("Profile not found") };
      case (?profiles) profiles;
    };

    return #ok(profiles[0]);
  };

  public func getProfileByProfileId(
    profileMap : ProfileTypes.Profiles,
    profileId : Text,
  ) : async Result.Result<ProfileTypes.Profile, Text> {

    // Search through all users' profiles to find matching profileId
    for ((userId, profileList) in profileMap.entries()) {
      let foundProfile = Array.find<ProfileTypes.Profile>(
        profileList,
        func(profile : ProfileTypes.Profile) : Bool {
          profile.profileId == profileId;
        },
      );

      switch (foundProfile) {
        case (?profile) {
          return #ok(profile);
        };
        case null {
          // Continue searching in other users
        };
      };
    };

    // Profile not found in any user's profile list
    return #err("Profile with ID " # profileId # " not found");
  };



  //searchProfiles

  public func globalSearch(
    profiles : ProfileTypes.Profiles,
    searchInput : Text,
  ) : [ProfileTypes.Profile] {
    if (Text.size(searchInput) == 0) {
      return [];
    };

    let lower = Text.toLowercase(searchInput);
    var results : [ProfileTypes.Profile] = [];

    for ((userId, profileList) in profiles.entries()) {
      let filtered = Array.filter<ProfileTypes.Profile>(
        profileList,
        func(p : ProfileTypes.Profile) : Bool {
          var match = false;

          // Check ProfileDetail
          switch (p.profileDetail) {
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
          if (not match) {
            switch (p.resume) {
              case (?resumeData) {
                // Check Summary
                switch (resumeData.summary) {
                  case (?s) {
                    switch (s.content) {
                      case (?content) {
                        if (Text.contains(Text.toLowercase(content), #text lower)) {
                          match := true;
                        };
                      };
                      case null {};
                    };
                  };
                  case null {};
                };

                // Check Work Experiences
                if (not match) {
                  switch (resumeData.workExperiences) {
                    case (?workExps) {
                      let foundWork = Array.find<ProfileTypes.WorkExperience>(
                        workExps,
                        func(we : ProfileTypes.WorkExperience) : Bool {
                          var weMatch = false;

                          if (Text.contains(Text.toLowercase(we.company), #text lower)) {
                            weMatch := true;
                          };

                          if (not weMatch) {
                            switch (we.location) {
                              case (?loc) {
                                if (Text.contains(Text.toLowercase(loc), #text lower)) {
                                  weMatch := true;
                                };
                              };
                              case null {};
                            };
                          };

                          if (not weMatch) {
                            if (Text.contains(Text.toLowercase(we.position), #text lower)) {
                              weMatch := true;
                            };
                          };

                          if (not weMatch) {
                            switch (we.description) {
                              case (?desc) {
                                if (Text.contains(Text.toLowercase(desc), #text lower)) {
                                  weMatch := true;
                                };
                              };
                              case null {};
                            };
                          };

                          weMatch;
                        },
                      );

                      switch (foundWork) {
                        case (?_) { match := true };
                        case null {};
                      };
                    };
                    case null {};
                  };
                };

                // Check Educations
                if (not match) {
                  switch (resumeData.educations) {
                    case (?edus) {
                      let foundEdu = Array.find<ProfileTypes.Education>(
                        edus,
                        func(ed : ProfileTypes.Education) : Bool {
                          var eduMatch = false;

                          switch (ed.institution) {
                            case (?inst) {
                              if (Text.contains(Text.toLowercase(inst), #text lower)) {
                                eduMatch := true;
                              };
                            };
                            case null {};
                          };

                          if (not eduMatch) {
                            switch (ed.degree) {
                              case (?degree) {
                                if (Text.contains(Text.toLowercase(degree), #text lower)) {
                                  eduMatch := true;
                                };
                              };
                              case null {};
                            };
                          };

                          if (not eduMatch) {
                            switch (ed.description) {
                              case (?desc) {
                                if (Text.contains(Text.toLowercase(desc), #text lower)) {
                                  eduMatch := true;
                                };
                              };
                              case null {};
                            };
                          };

                          eduMatch;
                        },
                      );

                      switch (foundEdu) {
                        case (?_) { match := true };
                        case null {};
                      };
                    };
                    case null {};
                  };
                };
              };
              case null {};
            };
          };

          match;
        },
      );

      if (filtered.size() > 0) {
        results := Array.append<ProfileTypes.Profile>(results, filtered);
      };
    };

    results;
  };

};
