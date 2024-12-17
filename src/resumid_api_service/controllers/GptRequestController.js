const GptRequestServices = require("../services/GptRequestServices");

exports.CreateAnalyzeResume = async (req, res, next) => {
  const response = await GptRequestServices.AnalyzeResume(req);
  
  return res.status(response.status).json(response.data);
};
