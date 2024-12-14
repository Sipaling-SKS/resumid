module GptTypes {
    // Define the main record type for the JSON structure
    public type GptResponse = {
        id : Text;
        objectField : Text;
        created : Nat64;
        system_fingerprint : Text;
    };

    // Define the type for "Choice"
    public type Choice = {
        index : Nat;
        message : Message;
        logprobs : ?Null;
        finish_reason : Text;
    };

    // Define the type for "Message"
    public type Message = {
        role : Text;
        content : Text;
        refusal : ?Null;
    };

    // Define the type for "Usage"
    public type Usage = {
        prompt_tokens : Nat;
        completion_tokens : Nat;
        total_tokens : Nat;
        prompt_tokens_details : TokenDetails;
        completion_tokens_details : TokenDetails;
    };

    // Define the type for "TokenDetails"
    public type TokenDetails = {
        cached_tokens : Nat;
        audio_tokens : Nat;
        accepted_prediction_tokens : Nat;
        rejected_prediction_tokens : Nat;
    };

};
