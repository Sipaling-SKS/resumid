// import HashMap "mo:base/HashMap";

// module ResumeExtractTypes {
//   public type ResumeExtractRequest = {
//     cvContent: Text;
//   };

//   public type Date = {
//     year: Nat;
//     month: Nat;
//   };

//   public type WorkExperience = {
//     id: Text;
//     company: Text;
//     location: Text;
//     position: Text;
//     employment_type: ?Text;
//     period: {
//       start: Date;
//       end: Date; 
//     };
//     responsibilities: [Text];
//   };

//   public type Education = {
//     id: Text;
//     institution: Text;
//     degree: Text;
//     study_period: {
//       start: Date;
//       end: Date;
//     };
//     score: Text;
//     description: Text;
//   };

//   public type Summary = Text;

//   public type ResumeSection = {
//     title: Text; 
//     content: {
//       #Summary: Summary;
//       #WorkExperience: [WorkExperience];
//       #Education: [Education];
//     };
//   };

//   public type ResumeData = [ResumeSection];


//   public type ResumeHistoryItem = {
//     userId: Text;          
//     data: ResumeData;      
//     createdAt: Int;        
//     updatedAt: Int;        
//   };

//   public type Histories = HashMap.HashMap<Text, ResumeHistoryItem>;
// };


import HashMap "mo:base/HashMap";

module ResumeExtractTypes {

  public type ResumeExtractRequest = {
    cvContent: Text;
  };

  public type Date = {
    year: Nat;
    month: Nat;
  };

  public type WorkExperience = {
    id: Text;                  
    company: Text;
    location: Text;
    position: Text;
    employment_type: ?Text;
    period: {
      start: Date;
      end: Date;
    };
    responsibilities: [Text];
  };

  public type Education = {
    id: Text;                  
    institution: Text;
    degree: Text;
    study_period: {
      start: Date;
      end: Date;
    };
    score: Text;
    description: Text;
  };

  public type Summary = Text;

  public type SectionValue = {
    Summary: ?Summary;
    WorkExperience: ?[WorkExperience];
    Education: ?[Education];
  };

  public type ResumeSection = {
    title: Text;               
    content: SectionValue;
  };

  public type ResumeData = [ResumeSection];

  public type ResumeHistoryItem = {
    userId: Text;
    data: ResumeData;
    createdAt: Text;
    updatedAt: Text;
  };

  public type Draft = HashMap.HashMap<Text, ResumeHistoryItem>;
};
