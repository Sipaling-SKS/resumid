import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import { JSON } = "mo:serde";

import GlobalConstants "../constants/Global";
import GPTConstants "../constants/GPT";

import HttpTypes "../types/HttpTypes";
import GptTypes "../types/GptTypes";

import HttpHelper "../helpers/HttpHelper";

module GptServices {
    public func AnalyzeResume(resumeContent : Text, jobTitle: Text, jobDescription : Text) : async ?GptTypes.AnalyzeStructure {
        // let route : Text = "/gpt-service";
        let route : Text = "/gpt-mockup";

        // Construct Request Body
        let messages : [GptTypes.GptRequestMessage] = [
            {
                role = "system";
                content = "";
            },
            { role = "user"; content = "Resume: " # resumeContent },
            {
                role = "user";
                content = "Job Description: " # "Job Title: " # jobTitle # "Job Description: " # jobDescription;
            },
        ];

        let body : GptTypes.GptRequest = {
            model = GlobalConstants.MODEL_NAME;
            messages = messages;
            max_tokens = GlobalConstants.MAX_TOKENS;
            temperature = GlobalConstants.TEMPERATURE;
        };

        let bodyKeys = ["model", "messages", "max_tokens", "temperature", "role", "content"];
        let blobBody = to_candid (body);

        switch (JSON.toText(blobBody, bodyKeys, null)) {
            case (#err(error)) {
                Debug.print("Error occured when create request body" # error);
                null;
            };
            case (#ok(jsonBody)) {

                Debug.print(debug_show (jsonBody));

                let bodyAsBlob = Text.encodeUtf8(jsonBody);
                Debug.print(debug_show (bodyAsBlob));
                // Construct HttpRequest Data
                let request : HttpTypes.HttpRequest = {
                    url = GPTConstants.GPT_BASE_URL # route;
                    max_response_bytes = null;
                    header_host = GPTConstants.GPT_HOST;
                    header_user_agent = GPTConstants.GPT_USER_AGENT;
                    header_content_type = GPTConstants.GPT_CONTENT_TYPE;
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
                                            var score : Text = "";
                                            var summary : Text = "";

                                            Debug.print("============================");
                                            Debug.print(content);
                                            for (item in sections) {
                                                // Get Key
                                                let strengthKey = GlobalConstants.STRENGTH_KEY;
                                                let weaknessesKey = GlobalConstants.WEAKNESSES_KEY;
                                                let gapsKey = GlobalConstants.GAPS_KEY;
                                                let sugesstionsKey = GlobalConstants.SUGESSTIONS_KEY;
                                                let summaryKey = GlobalConstants.SUMMARY_KEY;
                                                let scoreKey = GlobalConstants.SCORE_KEY;

                                                if (Text.startsWith(item, #text strengthKey)) {
                                                    for (subitem in Text.split(item, #text "\n")) {
                                                        strengths := Array.append<Text>(strengths, [subitem]);
                                                    };
                                                } else if (Text.startsWith(item, #text weaknessesKey)) {
                                                    for (subitem in Text.split(item, #text "\n")) {
                                                        weakness := Array.append<Text>(weakness, [subitem]);
                                                    };
                                                } else if (Text.startsWith(item, #text gapsKey)) {
                                                    for (subitem in Text.split(item, #text "\n")) {
                                                        gaps := Array.append<Text>(gaps, [subitem]);
                                                    };
                                                } else if (Text.startsWith(item, #text sugesstionsKey)) {
                                                    for (subitem in Text.split(item, #text "\n")) {
                                                        suggestions := Array.append<Text>(suggestions, [subitem]);
                                                    };
                                                } else if (Text.startsWith(item, #text summaryKey)) {
                                                    for (subitem in Text.split(item, #text "\n")) {
                                                        summary := subitem;
                                                    };
                                                } else if (Text.startsWith(item, #text scoreKey)) {
                                                    for (subitem in Text.split(item, #text "\n")) {
                                                        score := subitem;
                                                    };
                                                };
                                            };

                                            ?{
                                                strengths = strengths;
                                                gaps = gaps;
                                                suggestions = suggestions;
                                                weakness = weakness;
                                                score = score;
                                                summary = summary;
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
    };
};
