// import Principal "mo:base/Principal";
// import HashMap "mo:base/HashMap";

// module ProfileTypes {

//   public type Link = {
//     github: Text;
//     linkedin: Text;
//     portfolio: Text;
//   };

//   // Tipe lengkap dengan id untuk simpan dan edit
//   public type Header = {
//     id: Nat;
//     name: Text;
//     title: Text;
//     description: Text;
//     email: Text;
//     phone: Text;
//     links: Link;
//   };

//   public type Summary = {
//     id: Nat;
//     content: Text;
//   };

//   public type WorkExperienceItem = {
//     id: Nat;
//     company: Text;
//     location: Text;
//     position: Text;
//     employment_type: ?Text;
//     period: {
//       start: Text;
//       end: ?Text;
//     };
//     responsibilities: [Text];
//   };

//   public type EducationItem = {
//     id: Nat;
//     institution: Text;
//     degree: Text;
//     location: Text;
//     study_period: {
//       start: Text;
//       end: ?Text;
//     };
//     score: Text;
//     description: Text;
//   };

//   // Tipe input tanpa id untuk input user
//   public type HeaderInput = {
//     name: Text;
//     title: Text;
//     description: Text;
//     email: Text;
//     phone: Text;
//     links: Link;
//     professional_headline: ?Text;
//     present_job: Text;
//   };

//   public type SummaryInput = {
//     content: Text;
//   };

//   public type WorkExperienceInput = {
//     company: Text;
//     location: Text;
//     position: Text;
//     employment_type: ?Text;
//     period: {
//       start: Text;
//       end: ?Text;
//     };
//     responsibilities: [Text];
//   };

//   public type EducationInput = {
//     institution: Text;
//     degree: Text;
//     location: Text;
//     study_period: {
//       start: Text;
//       end: ?Text;
//     };
//     score: Text;
//     description: Text;
//   };

//   public type AddProfileInput = {
//     header: HeaderInput;
//     summary: SummaryInput;
//     work_experience: [WorkExperienceInput];
//     education: [EducationInput];
//   };

//   public type Profile = {
//     userId: Text;
//     profileId: Text;
//     header: Header;
//     summary: Summary;
//     work_experience: [WorkExperienceItem];
//     education: [EducationItem];
//     createdAt: Text;
//   };


//   //update patch
//   public type LinkPatch = {
//     github: ?Text;
//     linkedin: ?Text;
//     portfolio: ?Text;
//   };

//   public type HeaderInputPatch = {
//     name: ?Text;
//     title: ?Text;
//     description: ?Text;
//     email: ?Text;
//     phone: ?Text;
//     links: ?LinkPatch;
//     professional_headline: ?Text;
//     present_job: ?Text;
//   };

//   public type SummaryInputPatch = {
//     content: ?Text;
//   };

//   public type WorkExperiencePatchItem = {
//     id: Nat;
//     company: ?Text;
//     location: ?Text;
//     position: ?Text;
//     employment_type: ?Text;
//     period: ?{
//       start: Text;
//       end: ?Text;
//     };
//     responsibilities: ?[Text];
//   };

//   public type EducationPatchItem = {
//     id: Nat;
//     institution: ?Text;
//     degree: ?Text;
//     location: ?Text;
//     study_period: ?{
//       start: Text;
//       end: ?Text;
//     };
//     score: ?Text;
//     description: ?Text;
//   };

//   public type ProfilePatchInput = {
//     header: ?HeaderInputPatch;
//     summary: ?SummaryInputPatch;
//     work_experience: ?[WorkExperiencePatchItem];
//     education: ?[EducationPatchItem];
//   };

//   public type Profiles = HashMap.HashMap<Text, Profile>;
// }

import HashMap "mo:base/HashMap";

module ProfileTypes {
  public type ContactInfo = {
    email: ?Text;
    phone: ?Text;
    address: ?Text;
    website: ?Text;
    linkedin: ?Text;
    github: ?Text;
  };

  public type ProfileDetail = {
    name: Text;          
    description: ?Text;  
  };

  // public type Endorsments = {
  //   id: ?[Text]  
  // };

  // public type EndorsedProfiles = {
  //   id: ?[Text]  
  // };

  public type Date = {
    year: Nat;
    month: Nat;
  };

  public type WorkExperience = {
    id: Text;
    company: ?Text;
    location: ?Text;
    position: ?Text;
    employment_type: ?Text;
    period: {
      start: ?Date;
      end: ?Date; 
    };
    responsibilities: ?[Text];
  };

  public type Education = {
    id: Text;
    institution: ?Text;
    degree: ?Text;
    study_period: {
      start: ?Date;
      end: ?Date;
    };
    score: ?Text;
    description: ?Text;
  };

  public type Summary = ?Text;

  public type ResumeSection = {
    title: ?Text; 
    content: {
      #Summary: Summary;
      #WorkExperience: ?[WorkExperience];
      #Education: ?[Education];
    };
  };
  public type ResumeData = ?[ResumeSection];

  public type Profile = {
    userId: ?Text;
    id: Text;
    profileDetail: ProfileDetail; 
    contact: ?ContactInfo;
    resume: ResumeData;  
    endorsements: ?[Text];         
    endorsedProfiles: ?[Text]; 
    createdAt: ?Int;
    updatedAt: ?Int;
  };

  public type Profiles = HashMap.HashMap<Text, Profile>;
};
