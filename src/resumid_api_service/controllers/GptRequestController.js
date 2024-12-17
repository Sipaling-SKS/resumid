const GptRequestServices = require("../services/GptRequestServices");

exports.CreateAnalyzeResume = async (req, res, next) => {
  console.log("triggered");
  const response = await GptRequestServices.AnalyzeResume(req);

  res.status(response.status).json(response.data);
};
