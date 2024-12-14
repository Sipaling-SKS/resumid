// import JSON "mo:json.mo";

// module JsonHelper {
//     public func createObject() : JSON.JSON {
//         return #Object([]);
//     };

//     public func addKeyValue(jsonObj : JSON.JSON, key : Text, value : JSON.JSON) : JSON.JSON {
//         switch (jsonObj) {
//             case (#Object(fields)) {
//                 return #Object(fields # [(key, value)]);
//             };
//             case (_) {
//                 return jsonObj;
//             };
//         };
//     };

//     // Function to create a JSON string
//     public func createString(value : Text) : JSON.JSON {
//         return #String(value);
//     };

//     // Function to create a JSON number
//     public func createNumber(value : Int) : JSON.JSON {
//         return #Number(value.toText());
//     };

//     // Function to create a JSON array
//     public func createArray(values : [JSON.JSON]) : JSON.JSON {
//         return #Array(values);
//     };
// }