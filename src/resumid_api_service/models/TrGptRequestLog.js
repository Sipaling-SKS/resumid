const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TrGptRequestLog = new Schema(
  {
    idempotency_key: {
      type: String,
      require: true,
    },
    gpt_request: {
      type: String,
      require: true,
    },
    gpt_response: {
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
  { collection: "tr_gpt_request_log" }
);

module.exports = mongoose.model("tr_gpt_request_log", TrGptRequestLog);
