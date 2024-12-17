const dotenv = require("dotenv");
const axios = require("axios");

const TrGptRequestLog = require("../models/TrGptRequestLog");

const { API_IDEMPOTENCY_KEY } = require("../constants/global");

const AnalyzeResume = async (req) => {
  const route = "/chat/completions";
  console.log(req.body);
  const cleanedContent = req.body.messages[0].content.replaceAll("<ACK0006>", "\n")
  req.body.messages[0].content = cleanedContent;
  try {
    const response = await axios.post(
      process.env.GPT_BASE_URL + route,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${process.env.GPT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);

    const now = new Date();
    const expired_date = new Date(now.getTime() + 2 * 60 * 1000);

    const newData = new TrGptRequestLog({
      idempotency_key: req.headers[API_IDEMPOTENCY_KEY],
      gpt_request: JSON.stringify(req.body),
      gpt_response: JSON.stringify(response.data),
      expired_date: expired_date,
      created_at: now,
      updated_at: now,
    });

    await newData.save();
    return response;
  } catch (err) {
    // console.log(err);
    console.log(err.message);
    console.log(err.response.data);
    console.log(err.response.data.message);
    return err;
  }
};

module.exports = {
  AnalyzeResume,
};
