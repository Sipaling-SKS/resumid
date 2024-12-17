import Text "mo:base/Text";
import Random "mo:base/Random";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";

import UUID "mo:idempotency-keys/idempotency-keys";
import IC "ic:aaaaa-aa";
import Serde "mo:serde";

import HttpTypes "../types/HttpTypes";

import GlobalConstants "../constants/Global";

module HttpHelper {
  public func _generateIdempotencyKey() : async Text {
    let entropy = await Random.blob();
    let idempotency_key : Text = UUID.generateV4(entropy);

    return idempotency_key;
  };

  // public func _transform({
  //   context : Blob;
  //   response : IC.http_request_result;
  // }) : async IC.http_request_result {
  //   {
  //     response with headers = [];
  //   };
  // };

  public func sendPostHttpRequest(req : HttpTypes.HttpRequest) : async HttpTypes.HttpResponse {

    // Prepare Idempotency Key
    let idempotencyKey = await _generateIdempotencyKey();

    // Construct HttpHeader
    let requestHeader : [HttpTypes.HttpHeader] = [
      { name = "Host"; value = req.header_host },
      { name = "User-Agent"; value = req.header_user_agent },
      { name = "Content-Type"; value = req.header_content_type },
      { name = "Idempotency-Key"; value =  idempotencyKey},
      { name = "x-api-key"; value =  GlobalConstants.API_KEY},
    ];

    // Construct IC HTTP Request Arguments
    let HttpRequest : IC.http_request_args = {
      url = req.url;
      max_response_bytes = req.max_response_bytes;
      headers = requestHeader;
      body = req.body;
      method = #post;
      transform = null;
    };

    Cycles.add<system>(230_850_258_000);

    let httpResponse : HttpTypes.HttpResponse = await IC.http_request(HttpRequest);

    // Debug.print("Masuk");

    // Debug.print("URL: " # http_request.url);
    // Debug.print("Method: " # debug_show (http_request.method));
    // Debug.print("Headers: " # debug_show (http_request.headers));

    // let bodyText = switch (http_request.body) {
    //   case (?blob) { debug_show (blob) };
    //   case (null) { "null" };
    // };
    // Debug.print("Body: " # bodyText);

    // let maxResponseBytesText = switch (http_request.max_response_bytes) {
    //   case (?bytes) { debug_show (bytes) };
    //   case (null) { "null" };
    // };
    // Debug.print("Max Response Bytes: " # maxResponseBytesText);

    // let transformText = switch (http_request.transform) {
    //   case (?transform) { "Transform function present" };
    //   case (null) { "null" };
    // };
    // Debug.print("Transform: " # transformText);

    // // Debug.trap(http_request);
    // Debug.print(debug_show (http_response));

    // let decodedText : Text = switch (Text.decodeUtf8(httpResponse.body)) {
    //   case (null) { null };
    //   case (?y) { y };
    // };

    // if (decodedText != null) {
    //   Serde(decodedText);
    // }

    httpResponse;
  };
};
