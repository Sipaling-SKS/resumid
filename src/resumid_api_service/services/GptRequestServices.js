const path = require("path")
const dotenv = require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const axios = require("axios");

const TrGptRequestLog = require("../models/TrGptRequestLog");

const { API_IDEMPOTENCY_KEY } = require("../constants/global");

const AnalyzeResume = async (req) => {
  const route = "/chat/completions";
  console.log(req.body);
  console.log(process.env.EXPRESS_API_KEY)
  const cleanedContent = req.body.messages[0].content.replaceAll(
    "<ACK0006>",
    "\n"
  );
  req.body.messages[0].content = cleanedContent;
  try {
    const response = await axios.post(
      process.env.EXPRESS_GPT_BASE_URL + route,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${process.env.EXPRESS_GPT_API_KEY}`,
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

const AnalyzeMockupResume = async (req) => {
  console.log("ini mockup");
  const mockupData = {
    id: "chatcmpl-AfWUupU1vXniH9GQNI047b33YDwMa",
    object: "chat.completion",
    created: 1734459732,
    model: "gpt-4o-mini-2024-07-18",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content:
            "Strength:\n- Solid educational background with a Bachelor's degree in Informatics Engineering.\n- Relevant internship experience in software development, utilizing modern frameworks and languages (React.js, .NET Core, Golang).\n- Demonstrated experience with agile methodologies, indicating adaptability and understanding of contemporary development practices.\n- Knowledge of both front-end (React.js, JavaScript) and back-end (Node.js, .NET) technologies.\n- Experience in database design and management (SQL, MongoDB).\n- Certifications in cloud technologies, showcasing commitment to continuous learning and relevant skills.\n- Participation in team projects, indicating ability to collaborate effectively.\n- Strong problem-solving skills evidenced by project work and internships.\n\nWeakness:\n- Lack of direct experience in a Senior Software Engineer role, which may be a barrier given the job requires proven experience.\n- Proficiency in programming languages such as Java, C++, Python, or Ruby is not explicitly stated; primarily focused on JavaScript and associated frameworks.\n- Limited mention of experience with software testing and debugging techniques, which are crucial for the senior role.\n- No demonstrable experience in mentoring or guiding junior engineers as required in the job description.\n\nGaps:\n- Missing experience or projects that showcase the design and development of complex software applications, which is a key requirement.\n- No mention of familiarity with AWS or cloud platforms other than Google Cloud, which may limit appeal for the position.\n- Insufficient detail on experience with code reviews and collaboration with product managers or stakeholders.\n- Lack of comprehensive testing and performance analysis experience mentioned, which is essential for quality assurance.\n\nSuggestions:\n- Emphasize any experience or projects that involved complex software systems to align better with the job requirements.\n- Include specific programming languages mentioned in the job description (Java, C++, Python, Ruby) in your skills or experience section if applicable.\n- Highlight any experience in software testing and debugging, providing examples where possible.\n- Elaborate on any mentoring or leadership roles held, even informally, to demonstrate ability to guide junior staff.\n- Consider obtaining additional certifications or courses related to AWS to enhance cloud technology knowledge.\n- Provide clearer examples of collaboration with cross-functional teams and involvement in code reviews or project management.\n- Focus on showcasing achievements and results from projects that demonstrate high-quality deliverables.\n\nSummary:\nOverall, while Calvin has a strong foundational background in software engineering and relevant experiences, he needs to address gaps in direct senior-level experience, proficiency in required programming languages, and lack of emphasis on testing and collaboration aspects. By enhancing his resume to highlight these areas, Calvin can better position himself as a suitable candidate for the Senior Software Engineer role.\n\nScore:\n65/100",
          refusal: null,
        },
        logprobs: null,
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 1683,
      completion_tokens: 526,
      total_tokens: 2209,
      prompt_tokens_details: {
        cached_tokens: 0,
        audio_tokens: 0,
      },
      completion_tokens_details: {
        reasoning_tokens: 0,
        audio_tokens: 0,
        accepted_prediction_tokens: 0,
        rejected_prediction_tokens: 0,
      },
    },
    system_fingerprint: "fp_39a40c96a0",
  };

  const response = {
    status: 200,
    data: mockupData,
  };

  try {
    const now = new Date();
    const expired_date = new Date(now.getTime() + 2 * 60 * 1000);

    const newData = new TrGptRequestLog({
      idempotency_key: req.headers[API_IDEMPOTENCY_KEY],
      gpt_request: JSON.stringify(req.body),
      gpt_response: JSON.stringify(mockupData),
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
  AnalyzeMockupResume,
};
