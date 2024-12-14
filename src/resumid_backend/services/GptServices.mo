import Text "mo:base/Text";

import HttpHelper "../helpers/HttpHelper";

// import HttpTypes "../types/HttpTypes";

module GptServices {
    public func AnalyzeResume() : async Text {
        let host: Text = "192.168.11.115:5000";
        let url: Text = "http://192.168.11.115:5000/api/auth";

        // let host : Text = "putsreq.com";
        // let url = "https://putsreq.com/aL1QS5IbaQd4NTqN3a81";
        let result : Text = await HttpHelper.sendPostHttpRequest(host, url);

        result;
    };
};
