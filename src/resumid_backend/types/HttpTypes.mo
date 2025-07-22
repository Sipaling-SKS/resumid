import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Blob "mo:base/Blob";

module HttpTypes {
    public type HttpRequest =  {
        url : Text;
        max_response_bytes: ?Nat64;
        
        // Headers Data
        header_host : Text;
        header_user_agent : Text;
        header_content_type : Text;
        
        body: ?Blob;
        method: HttpMethod;
    };

    public type HttpResponse = {
        status : Nat;
        headers : [HttpHeader];
        body : Blob;
    };

    public type HttpHeader = { 
        name : Text; 
        value : Text 
    };

    public type HttpMethod = {
        #post;
    }

}