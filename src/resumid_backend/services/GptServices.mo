import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import { JSON } = "mo:serde";

import GlobalConstants "../constants/Global";

import HttpTypes "../types/HttpTypes";
import GptTypes "../types/GptTypes";

import HttpHelper "../helpers/HttpHelper";

module GptServices {
    public func AnalyzeResume() : async ?GptTypes.AnalyzeStructure {
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
                null;
            };
            case (?text) {
                switch (JSON.fromText(text, null)) {
                    case (#ok(blob)) {
                        let gptResponse : ?GptTypes.GptResponse = from_candid (blob);
                        Debug.print(debug_show (gptResponse));

                        switch (gptResponse) {
                            case (null) {
                                Debug.print("Fail decode the json string");
                                null;
                            };
                            case (?analizeResult) {
                                // Ensure content is a non-null and non-empty string before splitting
                                let content = analizeResult.choices[0].message.content;
                                if (content != "") {
                                    let sections = Text.split(content, #text "\n\n");
                                    var strengths : [Text] = [];
                                    var gaps : [Text] = [];
                                    var suggestions : [Text] = [];
                                    var weakness : [Text] = [];
                                    Debug.print("============================");
                                    Debug.print(content);
                                    for (item in sections) {
                                        if (Text.startsWith(item, #text GlobalConstants.STRENGTH_KEY)) {
                                            for (subitem in Text.split(item, #text "\n")) {
                                                strengths := Array.append<Text>(strengths, [subitem]);
                                            };
                                        } else if (Text.startsWith(item, #text "Weakness")) {
                                            for (subitem in Text.split(item, #text "\n")) {
                                                weakness := Array.append(weakness, [subitem]);
                                            };
                                        } else if (Text.startsWith(item, #text "Gaps")) {
                                            for (subitem in Text.split(item, #text "\n")) {
                                                gaps := Array.append(gaps, [subitem]);
                                            };
                                        } else if (Text.startsWith(item, #text "Suggestions")) {
                                            for (subitem in Text.split(item, #text "\n")) {
                                                suggestions := Array.append(suggestions, [subitem]);
                                            };
                                        };
                                    };

                                    ?{
                                        strengths = strengths;
                                        gaps = gaps;
                                        suggestions = suggestions;
                                        weakness = weakness;
                                    };
                                } else {
                                    Debug.print("Content is null or empty");
                                    null; // Explicitly return `null` for the optional type
                                };

                            };
                        };

                    };
                    case (#err(error)) {
                        Debug.print(debug_show (error));
                        null;
                    };
                };
            };
        };
    };
};
