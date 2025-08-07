import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import { JSON } = "mo:serde";

import GlobalConstants "../constants/Global";
import GeminiContants "../constants/Gemini";

import HttpTypes "../types/HttpTypes";
import HttpHelper "../helpers/HttpHelper";

import GeminiTypes "../types/GeminiTypes";

module GeminiServices {
    public func AnalyzeResume(resumeContent : Text, jobTitle : Text) : async ?GeminiTypes.AnalyzeStructureResponse {
        let route : Text = "/analyze/gemini-service";
        // let route : Text = "/analyze/gemini-mockup";

        // Construct Request Body
        let body : GeminiTypes.AnalyzeResumeRequest = {
            cvContent = resumeContent;
            jobTitle = jobTitle;
        };

        let bodyKeys = ["cvContent", "jobTitle"];
        let blobBody = to_candid (body);

        switch (JSON.toText(blobBody, bodyKeys, null)) {
            case (#err(error)) {
                Debug.print("Error occured when create request body" # error);
                null;
            };
            case (#ok(jsonBody)) {

                // Debug json body
                Debug.print(debug_show (jsonBody));

                let bodyAsBlob = Text.encodeUtf8(jsonBody);

                // Construct HttpRequest Data
                let request : HttpTypes.HttpRequest = {
                    url = GlobalConstants.API_BASE_URL # route;
                    max_response_bytes = null;
                    header_host = GlobalConstants.API_HOST;
                    header_user_agent = GeminiContants.GEMINI_USER_AGENT;
                    header_content_type = GlobalConstants.API_CONTENT_TYPE;
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
                        Debug.print(debug_show(text));
                        switch (JSON.fromText(text, null)) {
                            case (#ok(blob)) {                                
                                let geminiResponse : ?GeminiTypes.AnalyzeStructureResponse = from_candid (blob);
                                Debug.print(debug_show (geminiResponse));

                                geminiResponse;
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
