import HashMap "mo:base/HashMap";

module ProfileTypes {
  public type ContactInfo = {
    email : ?Text;
    phone : ?Text;
    address : ?Text;
    website : ?Text;
    instagram : ?Text;
    facebook : ?Text;
    twitter : ?Text;
  };

  public type ProfileDetail = {
    name : ?Text;
    profileCid : ?Text;
    bannerCid : ?Text;
    current_position : ?Text;
    description : ?Text;
  };

  public type Endorsments = {
    id : Text;
  };

  public type EndorsedProfiles = {
    id : Text;
  };

  public type WorkExperience = {
    id : Text;
    company : Text;
    location : ?Text;
    position : Text;
    employment_type : ?Text;
    period : {
      start : ?Text;
      end : ?Text;
    };
    description : ?Text;
  };

  public type Education = {
    id : Text;
    institution : ?Text;
    degree : ?Text;
    period : {
      start : ?Text;
      end : ?Text;
    };
    description : ?Text;
  };

  public type Summary = {
    content : ?Text;
  };

  public type Certificate = {
    id : Text;
    title : Text;
    issuer : ?Text;
    credential_url : ?Text;
    createdAt : Text;
    updatedAt : Text;
  };
  public type Skills = {
    skills : [Text];
  };

  public type ResumeData = {
    summary : ?Summary;
    workExperiences : ?[WorkExperience];
    educations : ?[Education];
    skills : ?Skills;
  };
  
  public type SearchResult = {
    userId : Text;
    profileId : Text;
    profileDetail : ?ProfileTypes.ProfileDetail;
    endorsements : ?[Text];
  };
  public type Profile = {
    userId : Text;
    profileId : Text;
    profileDetail : ?ProfileDetail;
    contact : ?ContactInfo;
    resume : ?ResumeData;
    certificatons : ?[Certificate];
    endorsements : ?[Text];
    endorsedProfiles : ?[Text];
    createdAt : Text;
    updatedAt : Text;
  };

  public type Profiles = HashMap.HashMap<Text, Profile>;
};
