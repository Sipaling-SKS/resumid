const GeminiServices = require("../services/GeminiService");

exports.CreateAnalyzeResume = async (req, res, next) => {
  const response = await GeminiServices.AnalyzeResume(req);
  
  return res.status(200).json(response);
};

//extract resume
exports.ExtractResume = async (req, res, next) => {
  const response = await GeminiServices.ExtractResume(req);
  
  return res.status(200).json(response);
};

exports.CreateMockupAnalyzeResume = async (req, res, next) => {
  const response = GeminiServices.MockupAnalyzeResume(req);
  
  return res.status(200).json(response);
};

exports.ExtractResumeMock = async (req, res, next) => {
  const response = GeminiServices.ExtractResumeMock(req);
  
  return res.status(200).json(response);
};
