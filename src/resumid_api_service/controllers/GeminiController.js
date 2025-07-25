const GeminiServices = require("../services/GeminiService");

exports.CreateAnalyzeResume = async (req, res, next) => {
  const response = await GeminiServices.AnalyzeResume(req);
  
  return res.status(200).json(response);
};
exports.CreateMockupAnalyzeResume = async (req, res, next) => {
  const response = GeminiServices.MockupAnalyzeResume(req);
  
  return res.status(200).json(response);
};
