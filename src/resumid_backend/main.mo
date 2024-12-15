import Text "mo:base/Text";

import GptServices "services/GptServices";

actor ResumId{
    public shared func AnalyzeResume() : async ?Text {
        return await GptServices.AnalyzeResume();
    }
};
