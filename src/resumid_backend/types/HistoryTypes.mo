import HashMap "mo:base/HashMap";

module {
  public type Histories = HashMap.HashMap<Text, [History]>;

  public type History = {
    userId : Text;
    historyId : Text;
    summary : Text;
    score : Int;
    strengths : Text;
    weaknesses : Text;
    gaps : Text;
    suggestions : Text;
    createdAt : Text;
  };

  public type AddHistoryInput = {
    summary : Text;
    score : Int;
    strengths : Text;
    weaknesses : Text;
    gaps : Text;
    suggestions : Text;
  };

  public type HistoryIdInput = {
    historyId : Text;
  };
};