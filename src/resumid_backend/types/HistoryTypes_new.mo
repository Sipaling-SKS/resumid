import HashMap "mo:base/HashMap";

module {
    public type Feedback = {
        feedback_message : Text;
        revision_example : Text;
    };

    public type Value = {
        feedback : [Feedback];
        pointer : [Text];
        score : Int; 
        strength : Text;
        weaknesess : Text;
    };

    public type ContentItem = {
        title : Text;
        value : Value;
    };

    public type Conclusion = {
        career_recomendation : [Text];
        keyword_matching : [Text];
        section_to_add : [Text];
        section_to_remove : [Text];
    };

    public type Summary = {
        score : Int;
        value : Text;
    };

    public type History = {
        userId : Text;
        historyId : Text;
        historycid : Text;
        fileName : Text;
        jobTitle : Text;
        summary : Summary;
        conclusion : Conclusion;
        content : [ContentItem];
        createdAt : Text;
    };
    public type HistoryIdInput = {
        historyId : Text;
    };
    public type AddHistoryInput = {
        historycid : Text;
        fileName : Text;
        jobTitle : Text;
        summary : Summary;
        conclusion : Conclusion;
        content : [ContentItem];
    };

    public type HistoryOutput = {
        fileName : Text;
        jobTitle : Text;
        summary : Summary;
        conclusion : Conclusion;
        content : [ContentItem];
        createdAt : Text;
        userId : Text;
        historyId : Text;
        historycid : Text;
    };


    public type PaginatedResult = {
        totalRowCount : Nat;
        totalPages : Nat;
        currentPage : Nat;
        pageSize : Nat;
        data : [History];
    };

  public type Histories = HashMap.HashMap<Text, [History]>;
}

