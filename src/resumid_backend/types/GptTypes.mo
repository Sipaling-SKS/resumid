module GptTypes {

    // Request Sections
    public type GptRequest = {
        model: Text;
        message: [GptRequestMessage];
        max_tokens: Nat;
        temperature: Float;
    };

    public type GptRequestMessage = {
        role: Text;
        content: Text;
    };

    // Response Sections
    public type GptResponse = {
        id : ?Text;
        objectField : ?Text;
        created : ?Nat64;
        model : ?Text;
        choices: [Choice];
        usage: ?Usage;
        system_fingerprint : ?Text;
    };

    public type Choice = {
        index : Nat;
        message : Message;
        logprobs : ?Text;
        finish_reason : Text;
    };

    public type Message = {
        role : Text;
        content : Text;
        refusal : ?Text;
    };

    public type Usage = {
        prompt_tokens : Nat;
        completion_tokens : Nat;
        total_tokens : Nat;
        prompt_tokens_details : ?TokenDetails;
        completion_tokens_details : ?TokenDetails;
    };

    public type TokenDetails = {
        cached_tokens : ?Nat;
        audio_tokens : ?Nat;
        accepted_prediction_tokens : ?Nat;
        rejected_prediction_tokens : ?Nat;
    };

    public type AnalyzeStructure = {
        strengths : [Text];
        gaps : [Text];
        suggestions: [Text];
        weakness: [Text];
        score: Text;
        summary: Text;
    }
};
