import Text "mo:base/Text";
import Random "mo:base/Random";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import UUID "mo:idempotency-keys/idempotency-keys";
import IC "ic:aaaaa-aa";
import Debug "mo:base/Debug";

import HttpTypes "../types/HttpTypes";

module HttpHelper {
  public func _generateIdempotencyKey() : async Text {
    let entropy = await Random.blob();
    let idempotency_key : Text = UUID.generateV4(entropy);

    return idempotency_key;
  };

  public func _transform({
    context : Blob;
    response : IC.http_request_result;
  }) : async IC.http_request_result {
    {
      response with headers = [];
    };
  };

  public func sendPostHttpRequest(host : Text, url : Text) : async Text {
    Debug.print("Masuk");

    let idempotency_key = await _generateIdempotencyKey();

    let request_headers : [HttpTypes.HttpHeader] = [
      { name = "Host"; value = host },
      { name = "User-Agent"; value = "http_post_sample" },
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = idempotency_key },
    ];

    let request_body_json = "{\"email\": \"calvinny2@mail.com\", \"password\": \"pard\"}";

    let request_body = Text.encodeUtf8(request_body_json);

    let http_request : IC.http_request_args = {
      url = url;
      max_response_bytes = null;
      headers = request_headers;
      body = ?request_body;
      method = #post;
      transform = null;
    };

    Cycles.add<system>(230_850_258_000);

    let http_response : HttpTypes.HttpResponse = await IC.http_request(http_request);

    Debug.print("Masuk");

    Debug.print("URL: " # http_request.url);
    Debug.print("Method: " # debug_show (http_request.method));
    Debug.print("Headers: " # debug_show (http_request.headers));

    let bodyText = switch (http_request.body) {
      case (?blob) { debug_show (blob) };
      case (null) { "null" };
    };
    Debug.print("Body: " # bodyText);

    let maxResponseBytesText = switch (http_request.max_response_bytes) {
      case (?bytes) { debug_show (bytes) };
      case (null) { "null" };
    };
    Debug.print("Max Response Bytes: " # maxResponseBytesText);

    let transformText = switch (http_request.transform) {
      case (?transform) { "Transform function present" };
      case (null) { "null" };
    };
    Debug.print("Transform: " # transformText);

    // Debug.trap(http_request);
    Debug.print(debug_show (http_response));

    let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
      case (null) { "No value returned" };
      case (?y) { y };
    };

    let result : Text = decoded_text # ". See more info of the request sent at: " # url;
    result;
  };
};
