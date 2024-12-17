const GptRequestServices = require("../services/GptRequestServices");

exports.CreateAnalyzeResume = async (req, res, next) => {
  const response = await GptRequestServices.AnalyzeResume(req);
  
  return res.status(response.status).json(response.data);
};
exports.CreateMockupAnalyzeResume = async (req, res, next) => {
  const response = await GptRequestServices.AnalyzeMockupResume(req);
  console.log(response)
  console.log(response.data.choices[0])
  return res.status(response.status).json(response.data);
};
