const dotenv = require("dotenv");
const axios = require("axios");

const TrGptRequestLog = require("../models/TrGptRequestLog");

const { API_IDEMPOTENCY_KEY } = require("../constants/global");

const AnalyzeResume = async (req) => {
  const route = "/gpt-mockup";

  console.log(route);
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
    console.log(err);
    return err;
  }
};

module.exports = {
  AnalyzeResume,
};
