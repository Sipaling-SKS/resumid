import Float "mo:base/Float";
module GlobalConstants {
    // public let GPT_HOST = "http://192.168.1.10:5000";
    // public let GPT_BASE_URL = "http://192.168.1.10:5000/api";
    // public let GPT_USER_AGENT = "SEND_GPT_PROMPT";
    // public let GPT_CONTENT_TYPE = "application/json";

    public let STRENGTH_KEY = "Strength";
    public let WEAKNESSES_KEY = "Weakness";
    public let GAPS_KEY = "Gaps";
    public let SUGESSTIONS_KEY = "Suggestions";
    public let SUMMARY_KEY = "Summary";
    public let SCORE_KEY = "Score";

    public let MODEL_NAME : Text = "gpt-4o-mini";
    public let MAX_TOKENS : Nat = 1000;
    public let TEMPERATURE : Float = 0.7;
    public let API_KEY: Text = "f8b8d923-3bc2-4cf3-b999-141a8fbc5df1";
};
