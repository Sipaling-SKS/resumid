import Debug "mo:base/Debug";

import GptTypes "types/GptTypes";
import GptServices "services/GptServices";

actor ResumId {
    public shared func AnalyzeResume(resumeContent : Text, jobTitle : Text, jobDescription : Text) : async ?GptTypes.AnalyzeStructure {
        let analyzeResult = await GptServices.AnalyzeResume(resumeContent, jobTitle, jobDescription);
        Debug.print(debug_show(analyzeResult));
        analyzeResult;
    };
};
