import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
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

                        switch (gptResponse) {
                            case (null) {
                                Debug.print("Fail decode the json string");
                            };
                            case (?analizeResult) {
                                // Ensure content is a non-null and non-empty string before splitting
                                let content = analizeResult.choices[0].message.content;
                                if (content != "") {
                                    let sections = Text.split(content, #text "\n\n");
                                    var strength : [Text] = [];
                                    var gap : [Text] = [];
                                    var suggestion : [Text] = [];
                                    var weakness : [Text] = [];
                                    for (item in sections) {
                                        if (Text.startsWith(item, #text "Strength")) {
                                            // var rest = Text.drop(item, 8); // 8 characters for "Strength"
                                            for(subitem in Text.split(item, #text "\n")) {
                                                Array.append<Text>(strength, [subitem]);
                                                null;
                                            }
                                        } else if (Text.startsWith(item, #text "Weakness")) {
                                            var rest = Text.drop(item, 9); // 9 characters for "Weakness"
                                            weakness := Text.split(item, "\n").toVector();
                                        } else if (Text.startsWith(item, #text "Gaps")) {
                                            var rest = Text.drop(item, 4); // 4 characters for "Gaps"
                                            gap := Text.split(rest, "\n").toVector();
                                        } else if (Text.startsWith(item, #text "Suggestions")) {
                                            var rest = Text.drop(item, 13); // 13 characters for "Suggestions"
                                            suggestion := Text.split(rest, "\n").toVector();
                                        };

                                        Debug.print("aa" # item); // Debug output for each section
                                    };
                                } else {
                                    Debug.print("Content is null or empty");
                                };
                            };
                        };

                    };
                    case (#err(error)) {
                        Debug.print(debug_show (error));
                    };
                };
            };
        };

        null;
    };
};
