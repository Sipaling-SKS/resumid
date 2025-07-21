const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TrGeminiRequestLog = new Schema(
  {
    idempotency_key: {
      type: String,
      require: true,
    },
    gemini_request: {
      type: String,
      require: true,
    },
    gemini_response: {
      type: String,
      require: true,
    },
    expired_date: {
      type: String,
      require: true,
    },
    created_at: {
      type: String,
      require: true,
    },
    updated_at: {
      type: String,
    },
  },
  { collection: "tr_gemini_request_log" }
);

module.exports = mongoose.model("tr_gemini_request_log", TrGeminiRequestLog);
