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

    httpResponse;
  };
};
