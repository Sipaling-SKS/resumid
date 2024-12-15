import Text "mo:base/Text";
import Debug "mo:base/Debug";
import { JSON } = "mo:serde";

import GlobalConstants "../constants/Global";

import HttpTypes "../types/HttpTypes";
import GptTypes "../types/GptTypes";

import HttpHelper "../helpers/HttpHelper";

module GptServices {
    public func AnalyzeResume() : async ?Text {
        let route : Text = "/gpt-mockup";

        // Construct Request Body
        let body = "{\"email\": \"calvinny2@mail.com\", \"password\": \"pard\"}";
        let bodyAsBlob = Text.encodeUtf8(body);

        // Construct HttpRequest Data
        let request : HttpTypes.HttpRequest = {
            url = GlobalConstants.GPT_BASE_URL # route;
            max_response_bytes = null;
            header_host = GlobalConstants.GPT_HOST;
            header_user_agent = GlobalConstants.GPT_USER_AGENT;
            header_content_type = GlobalConstants.GPT_CONTENT_TYPE;
            body = ?bodyAsBlob;
            method = #post;
        };

        let result : HttpTypes.HttpResponse = await HttpHelper.sendPostHttpRequest(request);

        // Decode Body Response
        let decodedText : ?Text = switch (Text.decodeUtf8(result.body)) {
            case (null) { null };
            case (?y) { ?y };
        };

        switch (decodedText) {
            case (null) {
                Debug.print("Data item is null");
            };
            case (?text) {
                switch (JSON.fromText(text, null)) {
                    case (#ok(blob)) {
                        let gptResponse : ?GptTypes.GptResponse = from_candid (blob);
                        Debug.print(debug_show (gptResponse));
                    };
                    case (#err(error)) {
                        Debug.print(debug_show (error));
                    };
                }
            };
        };

        null;
    };
};
