import Nat "mo:base/Nat";
import Nat16 "mo:base/Nat16";
import Blob "mo:base/Blob";

module HttpTypes {
    public type HttpRequest =  {
        url : Text;
        max_response_bytes: Nat16;
        headers: [HttpHeader];
        body: ?Blob;
        method: HttpMethod;
        // transform: ;
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