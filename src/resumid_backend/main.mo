import Debug "mo:base/Debug";

import GptTypes "types/GptTypes";
import GptServices "services/GptServices";

actor ResumId {
    public shared func AnalyzeResume() : async ?GptTypes.AnalyzeStructure {
        let test = await GptServices.AnalyzeResume();
        Debug.print("Test Masuk");
        test;
    };
};
