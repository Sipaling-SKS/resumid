import HashMap "mo:base/HashMap";

module ResumeExtractTypes {

  public type ResumeExtractRequest = {
    cvContent : Text;
  };

  public type WorkExperienceInput = {
    company : Text;
    location : Text;
    position : Text;
    employment_type : ?Text;
     period : { 
      start : ?Text;
      end : ?Text;
    };
    description : Text;  
  };

  public type EducationInput = {
    institution : Text;
    degree : Text;
     period : {  
      start : ?Text;
      end : ?Text;
    };
    description : Text;  
  };

  public type SkillsInput = {
    skills : [Text];
  };

  public type SummaryInput = {
    content : Text;
  };

  public type ResumeDataInput = {
    summary : SummaryInput;
    workExperiences : [WorkExperienceInput];
    educations : [EducationInput];
    skills : ?[Text];  
  };

  public type WorkExperience = {
    id : Text;
    company : Text;
    location : Text;
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
    institution : Text;
    degree : Text;
    period : {  
      start : ?Text;
      end : ?Text;
    };
    description : ?Text;
  };

  public type Skills = {
    skills : [Text];
  };

  public type Summary = {
    content : Text;
  };

  public type ResumeData = {
    summary : ?Summary;
    workExperiences : ?[WorkExperience];
    educations : ?[Education];
    skills : ?[Text]; 
  };

  public type ResumeHistoryItem = {
    userId : Text;
    draftId : Text;
    data : ResumeData;
    createdAt : Text;
    updatedAt : Text;
  };

  public type Draft = HashMap.HashMap<Text, [ResumeHistoryItem]>;
};