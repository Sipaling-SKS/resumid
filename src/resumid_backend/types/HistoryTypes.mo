import HashMap "mo:base/HashMap";

module {
  public type Histories = HashMap.HashMap<Text, [History]>;

  public type History = {
    userId : Text;
    historyId : Text;
    fileName : Text;
    summary : Text;
    score : Text;
    strengths : [Text];
    weaknesses : [Text];
    gaps : [Text];
    suggestions : [Text];
    createdAt : Text;
  };

  public type AddHistoryInput = {
    fileName : Text;
    summary : Text;
    score : Text;
    strengths : [Text];
    weaknesses : [Text];
    gaps : [Text];
    suggestions : [Text];
  };

  public type HistoryIdInput = {
    historyId : Text;
  };
};