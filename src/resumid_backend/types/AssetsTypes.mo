import Blob "mo:base/Blob";
import Time "mo:base/Time";

module AssetsTypes {
    public type PDFFile = {
        id: Text;
        name: Text;
        userId: Text;        
        content: Blob;
        uploadedAt: Time.Time;
    };


}