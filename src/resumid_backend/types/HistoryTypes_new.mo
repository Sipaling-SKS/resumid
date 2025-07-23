import HashMap "mo:base/HashMap";

// module {

//   public type Histories = HashMap.HashMap<Text, [History]>;

//   public type Feedback = {
//     feedback_message : Text;
//     revision_example : Text;
//   };

//   public type Value = {
//     feedback : [Feedback];
//     pointer : [Text];
//     score : Int;
//     strength : Text;
//     weaknesess : Text;
//   };

//   public type ContentItem = {
//     title : Text;
//     value : Value;
//   };

//   public type Conclusion = {
//     career_recomendation : [Text];
//     keyword_matching : [Text];
//     section_to_add : [Text];
//     section_to_remove : [Text];
//   };

//   public type History = {
//     userId : Text;
//     historyId : Text;
//     fileName : Text;
//     jobTitle : Text;
//     summary : Text;
//     conclusion : Conclusion;
//     content : [ContentItem];
//     createdAt : Text;
//   };


//   public type AddHistoryInput = {
//     fileName : Text;
//     jobTitle : Text;
//     summary : Text;
//     conclusion : Conclusion;
//     content : [ContentItem];
//   };

//   public type HistoryIdInput = {
//     historyId : Text;
//   };

//   public type HistoryOutput = {
//     conclusion : Conclusion;
//     content : [ContentItem];
//     };

//     public type FinalResponse<T> = {
//         status: Text;
//         message: Text;
//         data: T;
//         };



//   public type PaginatedResult = {
//     totalRowCount : Nat;
//     totalPages : Nat;
//     currentPage : Nat;
//     pageSize : Nat;
//     data : [History];
//   };
// };


module {
    public type Feedback = {
        feedback_message : Text;
        revision_example : Text;
    };

    public type Value = {
        feedback : [Feedback];
        pointer : [Text];
        score : Int; // atau bisa Float jika ingin lebih presisi
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
        score : Float;
        value : Text;
    };

    public type History = {
        userId : Text;
        historyId : Text;
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

