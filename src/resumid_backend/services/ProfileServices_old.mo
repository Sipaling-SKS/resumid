import ProfileTypes "../types/ProfileTypes";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Result "mo:base/Result";
import DateHelper "../helpers/DateHelper";

import ResumeExtractTypes "../types/ResumeExtractTypes";



module {

//save to profile
// public func saveDraftToProfile(
//     profiles: ProfileTypes.Profiles,
//     drafts: ResumeExtractTypes.Draft,
//     userId: Text
// ) : Result.Result<ProfileTypes.Profiles, Text> {

//     switch (drafts.get(userId)) {
//         case null {
//             return #err("No draft found for user: " # userId);
//         };
//         case (?draftItem) {
//             let draftData = draftItem.data;

//             let updatedProfiles = switch (profiles.get(userId)) {
//                 case (?profile) {
//                     let updatedProfile : ProfileTypes.Profile = {
//                         userId = profile.userId;
//                         id = profile.id;
//                         profileDetail = profile.profileDetail;
//                         contact = profile.contact;
//                         resume = ?draftData;          
//                         endorsements = profile.endorsements;
//                         endorsedProfiles = profile.endorsedProfiles;
//                         createdAt = profile.createdAt;
//                         updatedAt = profile.updatedAt;
//                     };
//                     let _ = profiles.put(userId, updatedProfile); 
//                     profiles
//                 };
//                 case null {
//                     let newProfile : ProfileTypes.Profile = {
//                         userId = ?userId;
//                         id = userId;
//                         profileDetail = { name = ""; description = null };
//                         contact = null;
//                         resume = ?draftData;         
//                         endorsements = null;
//                         endorsedProfiles = null;
//                         createdAt = null;
//                         updatedAt = null;
//                     };
//                     let _ = profiles.put(userId, newProfile);
//                     profiles
//                 }
//             };

//             let _ = drafts.remove(userId);

//             #ok(updatedProfiles)
//         }
//     }
// };

public func saveDraftToProfile(
    profiles: ProfileTypes.Profiles,
    drafts: ResumeExtractTypes.Draft,
    userId: Text
) : Result.Result<ProfileTypes.Profiles, Text> {

    func mapWorkExperience(we: ResumeExtractTypes.WorkExperience) : ProfileTypes.WorkExperience {
        {
            id = we.id;
            company = ?we.company;
            location = ?we.location;
            position = ?we.position;
            employment_type = we.employment_type;
            period = {
                start = ?we.period.start;
                end = ?we.period.end;
            };
            responsibilities = ?we.responsibilities;
        }
    };

    func mapEducation(ed: ResumeExtractTypes.Education) : ProfileTypes.Education {
        {
            id = ed.id;
            institution = ?ed.institution;
            degree = ?ed.degree;
            study_period = {
                start = ?ed.study_period.start;
                end = ?ed.study_period.end;
            };
            score = ?ed.score;
            description = ?ed.description;
        }
    };

    func mapResumeSection(s: ResumeExtractTypes.ResumeSection) : ProfileTypes.ResumeSection {
        {
            title = ?s.title;
            content = {
                Summary = s.content.Summary;
                WorkExperience = switch (s.content.WorkExperience) {
                    case null { null };
                    case (?arr) { ?Array.map(arr, mapWorkExperience) };
                };
                Education = switch (s.content.Education) {
                    case null { null };
                    case (?arr) { ?Array.map(arr, mapEducation) };
                };
            };
        }
    };

    switch (drafts.get(userId)) {
        case null { 
            return #err("No draft found for user: " # userId); 
        };
        case (?draftItem) {
            let draftData : ResumeExtractTypes.ResumeData = draftItem.data;

            let mappedResume : ?[ProfileTypes.ResumeSection] = ?(
                Array.map<ResumeExtractTypes.ResumeSection, ProfileTypes.ResumeSection>(
                    draftData,
                    mapResumeSection
                )
            );

            let updatedProfiles = switch (profiles.get(userId)) {
                case (?profile) {
                    let updatedProfile : ProfileTypes.Profile = { profile with resume = mappedResume };
                    let _ = profiles.put(userId, updatedProfile);
                    profiles
                };
                case null {
                    let newProfile : ProfileTypes.Profile = {
                        userId = ?userId;
                        id = userId;
                        profileDetail = { name = ""; description = null };
                        contact = null;
                        resume = mappedResume;
                        endorsements = null;
                        endorsedProfiles = null;
                        createdAt = null;
                        updatedAt = null;
                    };
                    let _ = profiles.put(userId, newProfile);
                    profiles
                }
            };

            let _ = drafts.remove(userId);
            #ok(updatedProfiles)
        }
    }
};





//edit data in draft
public func editWorkExperienceInDraft(
    drafts: ResumeExtractTypes.Draft,
    userId: Text,
    newWork: ResumeExtractTypes.WorkExperience
) : Result.Result<Text, Text> {

    switch (drafts.get(userId)) {
        case null {
            return #err("No draft found for user: " # userId);
        };
        case (?draftItem) {
            let resumeData = draftItem.data;
            let updatedData : ResumeExtractTypes.ResumeData =
                Array.map<ResumeExtractTypes.ResumeSection, ResumeExtractTypes.ResumeSection>(resumeData, func(section) {
                    if (section.title == "WorkExperience") {
                        switch (section.content.WorkExperience) {
                            case (?workList) {
                                let updatedList : [ResumeExtractTypes.WorkExperience] =
                                Array.map<ResumeExtractTypes.WorkExperience, ResumeExtractTypes.WorkExperience>(
                                    workList,
                                    func(w: ResumeExtractTypes.WorkExperience) : ResumeExtractTypes.WorkExperience {
                                        if (w.id == newWork.id) { newWork } else { w }
                                    }
                                );

                                { section with content = { section.content with WorkExperience = ?updatedList } };
                            };
                            case null { section };
                        }
                    } else {
                        section
                    }
                });
            let now = Time.now();
            let formatted = DateHelper.formatTimestamp(now);
            let updatedDraft : ResumeExtractTypes.ResumeHistoryItem = {
                userId = draftItem.userId;
                data = updatedData;
                createdAt = draftItem.createdAt;
                updatedAt = formatted;
            };
            let _ = drafts.put(userId, updatedDraft);

            #ok("WorkExperience updated in draft for user: " # userId)
        }
    }
};

public func editEducationInDraft(
    drafts: ResumeExtractTypes.Draft,
    userId: Text,
    newEdu: ResumeExtractTypes.Education
) : Result.Result<Text, Text> {

    switch (drafts.get(userId)) {
        case null { return #err("No draft found for user: " # userId); };
        case (?draftItem) {
            let resumeData = draftItem.data;

            let updatedData : ResumeExtractTypes.ResumeData =
                Array.map<ResumeExtractTypes.ResumeSection, ResumeExtractTypes.ResumeSection>(
                    resumeData,
                    func(section: ResumeExtractTypes.ResumeSection) : ResumeExtractTypes.ResumeSection {
                        if (section.title == "Education") {
                            switch (section.content.Education) {
                                case (?eduList) {
                                    let updatedList : [ResumeExtractTypes.Education] =
                                        Array.map<ResumeExtractTypes.Education, ResumeExtractTypes.Education>(
                                            eduList,
                                            func(e: ResumeExtractTypes.Education) : ResumeExtractTypes.Education {
                                                if (e.id == newEdu.id) { newEdu } else { e }
                                            }
                                        );
                                    { section with content = { section.content with Education = ?updatedList } };
                                };
                                case null { section };
                            }
                        } else { section }
                    }
                );

            let now = Time.now();
            let formatted = DateHelper.formatTimestamp(now);

            let updatedDraft : ResumeExtractTypes.ResumeHistoryItem = {
                userId = draftItem.userId;
                data = updatedData;
                createdAt = draftItem.createdAt;
                updatedAt = formatted;
            };
            let _ = drafts.put(userId, updatedDraft);

            #ok("Education updated in draft for user: " # userId)
        }
    }
};

public func editSummaryInDraft(
    drafts: ResumeExtractTypes.Draft,
    userId: Text,
    newSummary: ResumeExtractTypes.Summary
) : Result.Result<Text, Text> {

    switch (drafts.get(userId)) {
        case null { return #err("No draft found for user: " # userId); };
        case (?draftItem) {
            let resumeData = draftItem.data;

            let updatedData : ResumeExtractTypes.ResumeData =
                Array.map<ResumeExtractTypes.ResumeSection, ResumeExtractTypes.ResumeSection>(
                    resumeData,
                    func(section: ResumeExtractTypes.ResumeSection) : ResumeExtractTypes.ResumeSection {
                        if (section.title == "Summary") {
                            { section with content = { section.content with Summary = ?newSummary } };
                        } else { section }
                    }
                );

            let now = Time.now();
            let formatted = DateHelper.formatTimestamp(now);

            let updatedDraft : ResumeExtractTypes.ResumeHistoryItem = {
                userId = draftItem.userId;
                data = updatedData;
                createdAt = draftItem.createdAt;
                updatedAt = formatted;
            };
            let _ = drafts.put(userId, updatedDraft);

            #ok("Summary updated in draft for user: " # userId)
        }
    }
};


//edit data in profile
public func editWorkExperienceInProfile(
    profiles: ProfileTypes.Profiles,
    userId: Text,
    newWork: ProfileTypes.WorkExperience
) : Result.Result<Text, Text> {

    switch (profiles.get(userId)) {
        case null { return #err("Profile not found for user: " # userId); };
        case (?profile) {
            // Ambil resume lama, jika null jadikan array kosong
            let resumeData = switch (profile.resume) {
                case null { [] };
                case (?r) { r };
            };

            // Update section WorkExperience saja
            let updatedResume : [ProfileTypes.ResumeSection] =
                Array.map<ProfileTypes.ResumeSection, ProfileTypes.ResumeSection>(
                    resumeData,
                    func(section: ProfileTypes.ResumeSection) : ProfileTypes.ResumeSection {
                        if (section.title == ?("WorkExperience")) {
                            switch (section.content.WorkExperience) {
                                case (?workList) {
                                    let updatedList : [ProfileTypes.WorkExperience] =
                                        Array.map<ProfileTypes.WorkExperience, ProfileTypes.WorkExperience>(
                                            workList,
                                            func(w: ProfileTypes.WorkExperience) : ProfileTypes.WorkExperience {
                                                if (w.id == newWork.id) { newWork } else { w }
                                            }
                                        );
                                    { section with content = { section.content with WorkExperience = ?updatedList } };
                                };
                                case null { section };
                            }
                        } else { section } // section lain tidak berubah
                    }
                );

            // Update profile hanya untuk resume, field lain tetap sama
            let updatedProfile : ProfileTypes.Profile = { profile with resume = ?updatedResume };
            let _ = profiles.put(userId, updatedProfile);

            #ok("WorkExperience updated in profile for user: ")
        }
    }
};

public func editEducationInProfile(
    profiles: ProfileTypes.Profiles,
    userId: Text,
    newEdu: ProfileTypes.Education
) : Result.Result<Text, Text> {

    switch (profiles.get(userId)) {
        case null { return #err("Profile not found for user: " # userId); };
        case (?profile) {
            let resumeData = switch (profile.resume) {
                case null { [] };
                case (?r) { r };
            };

            let updatedResume : [ProfileTypes.ResumeSection] =
                Array.map<ProfileTypes.ResumeSection, ProfileTypes.ResumeSection>(
                    resumeData,
                    func(section: ProfileTypes.ResumeSection) : ProfileTypes.ResumeSection {
                        if (section.title == ?("Education")) {
                            switch (section.content.Education) {
                                case (?eduList) {
                                    let updatedList : [ProfileTypes.Education] =
                                        Array.map<ProfileTypes.Education, ProfileTypes.Education>(
                                            eduList,
                                            func(e: ProfileTypes.Education) : ProfileTypes.Education {
                                                if (e.id == newEdu.id) { newEdu } else { e }
                                            }
                                        );
                                    { section with content = { section.content with Education = ?updatedList } };
                                };
                                case null { section };
                            }
                        } else { section }
                    }
                );

            let updatedProfile : ProfileTypes.Profile = { profile with resume = ?updatedResume };
            let _ = profiles.put(userId, updatedProfile);

            #ok("Education updated in profile for user: ")
        }
    }
};

public func editSummaryInProfile(
    profiles: ProfileTypes.Profiles,
    userId: Text,
    newSummary: ProfileTypes.Summary
) : Result.Result<Text, Text> {

    switch (profiles.get(userId)) {
        case null { return #err("Profile not found for user: " # userId); };
        case (?profile) {
            let resumeData = switch (profile.resume) {
                case null { [] };
                case (?r) { r };
            };

            let updatedResume : [ProfileTypes.ResumeSection] =
                Array.map<ProfileTypes.ResumeSection, ProfileTypes.ResumeSection>(
                    resumeData,
                    func(section: ProfileTypes.ResumeSection) : ProfileTypes.ResumeSection {
                        if (section.title == ?("Summary")) {
                            { section with content = { section.content with Summary = newSummary } };
                        } else { section }
                    }
                );

            let updatedProfile : ProfileTypes.Profile = { profile with resume = ?updatedResume };
            let _ = profiles.put(userId, updatedProfile);

            #ok("Summary updated in profile for user: ")
        }
    }
};

public func editProfileDetail(
    profiles: ProfileTypes.Profiles,
    userId: Text,
    newDetail: ProfileTypes.ProfileDetail
) : Result.Result<Text, Text> {

    switch (profiles.get(userId)) {
        case null { return #err("Profile not found for user: " # userId); };
        case (?profile) {
            let updatedProfile : ProfileTypes.Profile = { profile with profileDetail = newDetail };
            let _ = profiles.put(userId, updatedProfile);

            #ok("Profile detail updated for user: " # userId)
        }
    }
};

public func editContactInfo(
    profiles: ProfileTypes.Profiles,
    userId: Text,
    newContact: ProfileTypes.ContactInfo
) : Result.Result<Text, Text> {

    switch (profiles.get(userId)) {
        case null { return #err("Profile not found for user: " # userId); };
        case (?profile) {
            let updatedProfile : ProfileTypes.Profile = { profile with contact = ?newContact };
            let _ = profiles.put(userId, updatedProfile);

            #ok("Contact info updated for user: " # userId)
        }
    }
};


//delete data draft

public func deleteWorkExperienceInDraft(
    drafts: ResumeExtractTypes.Draft,
    userId: Text,
    workId: Text
) : Result.Result<Text, Text> {

    switch (drafts.get(userId)) {
        case null { return #err("No draft found for user: " # userId); };
        case (?draftItem) {
            let resumeData = draftItem.data;

            let updatedData : ResumeExtractTypes.ResumeData =
                Array.map<ResumeExtractTypes.ResumeSection, ResumeExtractTypes.ResumeSection>(
                    resumeData,
                    func(section) {
                        if (section.title == "WorkExperience") {
                            switch (section.content.WorkExperience) {
                                case (?workList) {
                                    let filtered = Array.filter<ResumeExtractTypes.WorkExperience>(
                                        workList,
                                        func(w) { w.id != workId }
                                    );
                                    { section with content = { section.content with WorkExperience = ?filtered } };
                                };
                                case null { section };
                            }
                        } else { section }
                    }
                );

            let updatedDraft = { draftItem with data = updatedData };
            let _ = drafts.put(userId, updatedDraft);

            #ok("WorkExperience deleted from draft: " # workId)
        }
    }
};

// public func deleteEducationInDraft(
//     drafts: ResumeExtractTypes.Draft,
//     userId: Text,
//     eduId: Text
// ) : Result.Result<Text, Text> {

//     switch (drafts.get(userId)) {
//         case null { return #err("No draft found for user: " # userId); };
//         case (?draftItem) {
//             let resumeData = draftItem.data;

//             let updatedData : ResumeExtractTypes.ResumeData =
//                 Array.map<ResumeExtractTypes.ResumeSection, ResumeExtractTypes.ResumeSection>(
//                     resumeData,
//                     func(section) {
//                         if (section.title == "Education") {
//                             switch (section.content.Education) {
//                                 case (?eduList) {
//                                     let filtered = Array.filter<ResumeExtractTypes.Education>(
//                                         eduList,
//                                         func(e) { e.id != eduId }
//                                     );
//                                     { section with content = { section.content with Education = ?filtered } };
//                                 };
//                                 case null { section };
//                             }
//                         } else { section }
//                     }
//                 );

//             let updatedDraft = { draftItem with data = updatedData };
//             let _ = drafts.put(userId, updatedDraft);

//             #ok("Education deleted from draft: " # eduId)
//         }
//     }
// };

public func deleteEducationInDraft(
    drafts: ResumeExtractTypes.Draft,
    userId: Text,
    eduId: Text
) : Result.Result<Text, Text> {

    switch (drafts.get(userId)) {
        case null { 
            return #err("No draft found for user: " # userId); 
        };
        case (?draftItem) {

            // Ambil data resume dari draft
            let updatedData : ResumeExtractTypes.ResumeData =
                Array.map<ResumeExtractTypes.ResumeSection, ResumeExtractTypes.ResumeSection>(
                    draftItem.data,
                    func(section: ResumeExtractTypes.ResumeSection) : ResumeExtractTypes.ResumeSection {

                        if (section.title == "Education") {
                            // Ambil content secara eksplisit supaya Motoko bisa infer tipe
                            let content = section.content;

                            // Filter Education sesuai eduId
                           let newEducation : ?[ResumeExtractTypes.Education] =
                            switch (content.Education) {
                                case null { null };
                                case (?eduList) {
                                    let filtered = Array.filter<ResumeExtractTypes.Education>(
                                        eduList,
                                        func(e) { e.id != eduId }
                                    );
                                    switch (Array.size(filtered)) {
                                        case 0 { null : ?[ResumeExtractTypes.Education] };
                                        case _ { ?filtered };
                                    }
                                };
                            };
                            // Kembalikan section dengan Education yang sudah diperbarui
                            { section with content = { content with Education = newEducation } };
                        } else {
                            section
                        }
                    }
                );

            // Update draft item
            let updatedDraft = { draftItem with data = updatedData };
            let _ = drafts.put(userId, updatedDraft);

            #ok("Education deleted from draft: " # eduId)
        }
    }
};





public func deleteSectionInDraft(
    drafts: ResumeExtractTypes.Draft,
    userId: Text,
    sectionTitle: Text
) : Result.Result<Text, Text> {

    switch (drafts.get(userId)) {
        case null { return #err("No draft found for user: " # userId); };
        case (?draftItem) {
            let resumeData = draftItem.data;

            let updatedData = Array.filter<ResumeExtractTypes.ResumeSection>(
                resumeData,
                func(section) { section.title != sectionTitle }
            );

            let updatedDraft = { draftItem with data = updatedData };
            let _ = drafts.put(userId, updatedDraft);

            #ok("Section deleted from draft: " # sectionTitle)
        }
    }
};

//delete data profile
public func deleteWorkExperienceInProfile(
    profiles: ProfileTypes.Profiles,
    userId: Text,
    workId: Text
) : Result.Result<Text, Text> {

    switch (profiles.get(userId)) {
        case null { return #err("Profile not found"); };
        case (?profile) {
            let resumeData = switch (profile.resume) {
                case null { [] };
                case (?r) { r };
            };

            let updatedResume : [ProfileTypes.ResumeSection] =
                Array.map<ProfileTypes.ResumeSection, ProfileTypes.ResumeSection>(
                    resumeData,
                    func(section: ProfileTypes.ResumeSection) : ProfileTypes.ResumeSection {
                        if (section.title == ?("WorkExperience")) {
                            switch (section.content.WorkExperience) {
                                case (?workList) {
                                    let filtered : [ProfileTypes.WorkExperience] =
                                        Array.filter<ProfileTypes.WorkExperience>(
                                            workList,
                                            func(w) { w.id != workId }
                                        );
                                    { section with content = { section.content with WorkExperience = ?filtered } };
                                };
                                case null { section };
                            }
                        } else { section }
                    }
                );

            let updatedProfile : ProfileTypes.Profile = { profile with resume = ?updatedResume };
            let _ = profiles.put(userId, updatedProfile);

            #ok("WorkExperience item deleted: ")
        }
    }
};

public func deleteEducationInProfile(
    profiles: ProfileTypes.Profiles,
    userId: Text,
    eduId: Text
) : Result.Result<Text, Text> {

    switch (profiles.get(userId)) {
        case null { return #err("Profile not found"); };
        case (?profile) {
            let resumeData = switch (profile.resume) {
                case null { [] };
                case (?r) { r };
            };

            let updatedResume : [ProfileTypes.ResumeSection] =
                Array.map<ProfileTypes.ResumeSection, ProfileTypes.ResumeSection>(
                    resumeData,
                    func(section: ProfileTypes.ResumeSection) : ProfileTypes.ResumeSection {
                        if (section.title == ?("Education")) {
                            switch (section.content.Education) {
                                case (?eduList) {
                                    let filtered : [ProfileTypes.Education] =
                                        Array.filter<ProfileTypes.Education>(
                                            eduList,
                                            func(e) { e.id != eduId }
                                        );
                                    { section with content = { section.content with Education = ?filtered } };
                                };
                                case null { section };
                            }
                        } else { section }
                    }
                );

            let updatedProfile : ProfileTypes.Profile = { profile with resume = ?updatedResume };
            let _ = profiles.put(userId, updatedProfile);

            #ok("Education item deleted: ")
        }
    }
};

public func deleteSummarySectionInProfile(
    profiles: ProfileTypes.Profiles,
    userId: Text
) : Result.Result<Text, Text> {

    switch (profiles.get(userId)) {
        case null { return #err("Profile not found"); };
        case (?profile) {
            let resumeData = switch (profile.resume) {
                case null { [] };
                case (?r) { r };
            };

            let filteredSections : [ProfileTypes.ResumeSection] =
                Array.filter<ProfileTypes.ResumeSection>(
                    resumeData,
                    func(section) { section.title != ?("Summary") }
                );

            let updatedProfile : ProfileTypes.Profile = { profile with resume = ?filteredSections };
            let _ = profiles.put(userId, updatedProfile);

            #ok("Summary section deleted")
        }
    }
};

// public func deleteContactField(
//     profiles: ProfileTypes.Profiles,
//     userId: Text,
//     fieldName: Text
// ) : Result.Result<Text, Text> {

//     switch (profiles.get(userId)) {
//         case null { return #err("Profile not found for user: " # userId); };
//         case (?profile) {
//             switch (profile.contact) {
//                 case null { return #err("No contact info to delete"); };
//                 case (?contact) {
//                     let updatedContact : ProfileTypes.ContactInfo =
//                         switch (fieldName) {
//                             case "email" { { contact with email = null } };
//                             case "phone" { { contact with phone = null } };
//                             case "address" { { contact with address = null } };
//                             case "website" { { contact with website = null } };
//                             case "linkedin" { { contact with linkedin = null } };
//                             case "github" { { contact with github = null } };
//                             case _ { return #err("Invalid contact field: " # fieldName) };
//                         };

//                     let updatedProfile : ProfileTypes.Profile = { profile with contact = ?updatedContact };
//                     let _ = profiles.put(userId, updatedProfile);

//                     #ok("Contact field deleted: ")
//                 }
//             }
//         }
//     }
// };




public func endorseProfile(
    profiles: ProfileTypes.Profiles,
    targetUserId: Text,
    userId: Text
) : ProfileTypes.Profiles {

    switch (profiles.get(targetUserId)) {
        case (?targetProfile) {
            switch (profiles.get(userId)) {
                case (?userProfile) {
                    let updatedEndorsements = 
                        switch (targetProfile.endorsements) {
                            case (?list) { ?Array.append(list, [userId]) };
                            case null { ?[userId] };
                        };
                    let updatedTarget = { targetProfile with endorsements = updatedEndorsements };
                    profiles.put(targetUserId, updatedTarget);

                    let updatedEndorsedProfiles = 
                        switch (userProfile.endorsedProfiles) {
                            case (?list) { ?Array.append(list, [targetUserId]) };
                            case null { ?[targetUserId] };
                        };
                    let updatedUser = { userProfile with endorsedProfiles = updatedEndorsedProfiles };
                    profiles.put(userId, updatedUser);

                    profiles
                };
                case null { profiles }
            };
        };
        case null { profiles }
    }
};

public func unendorseProfile(
    profiles: ProfileTypes.Profiles,
    targetUserId: Text,
    userId: Text
) : ProfileTypes.Profiles {

    switch (profiles.get(targetUserId)) {
        case (?targetProfile) {
            switch (profiles.get(userId)) {
                case (?userProfile) {
                    let updatedEndorsements = 
                        switch (targetProfile.endorsements) {
                            case (?list) { ?Array.filter<Text>(list, func(x) { x != userId }) };
                            case null { null };
                        };
                    let updatedTarget = { targetProfile with endorsements = updatedEndorsements };
                    profiles.put(targetUserId, updatedTarget);

                    let updatedEndorsedProfiles = 
                        switch (userProfile.endorsedProfiles) {
                            case (?list) { ?Array.filter<Text>(list, func(x) { x != targetUserId }) };
                            case null { null };
                        };
                    let updatedUser = { userProfile with endorsedProfiles = updatedEndorsedProfiles };
                    profiles.put(userId, updatedUser);

                    profiles
                };
                case null { profiles }
            };
        };
        case null { profiles }
    }
};

  
}

  

