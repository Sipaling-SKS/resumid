module GeminiTypes {

    // Request Sections
    public type AnalyzeResumeRequest = {
        cvContent : Text;
        jobTitle : Text;
    };

    public type AnalyzeStructureResponse = {
        conclusion : Conclusion;
        content : [Section];
        summary : Summary;
    };

    type Conclusion = {
        career_recomendation : [Text];
        keyword_matching : [Text];
        section_to_add : [Text];
        section_to_remove : [Text];
    };

    public type Section = {
        title : Text;
        value : SectionValue;
    };

    public type FeedbackItem = {
        feedback_message : Text;
        revision_example : Text;
    };

    type SectionValue = {
        feedback : [FeedbackItem];
        pointer : [Text];
        score : Nat;
        strength : Text;
        weaknesess : Text;
    };

    type Summary = {
        score : Nat;
        value : Text;
    };

};
