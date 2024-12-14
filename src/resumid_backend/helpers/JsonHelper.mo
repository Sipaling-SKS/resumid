// module JsonHelper {
//     public type KeyValue = (Text, Text);

//     public func generateJsonText(properties : ?[(Text, Text)]) : Text {
//         switch (properties) {
//             case (null) { "" };
//             case (?p) {
//                 let jsonParts = Array.map<(Text, Text), Text>(
//                     p,
//                     func(prop : (Text, Text)) : Text {
//                         let key = prop.0;
//                         let value = prop.1;
//                         "\"" # key # "\": \"" # value # "\"";
//                     },
//                 );

//                 let jsonString = "{" # Text.join(", ", jsonParts) # "}";

//                 {
//                     next = () { some(jsonString) };
//                 };
//             };
//         };
//     };
// };
