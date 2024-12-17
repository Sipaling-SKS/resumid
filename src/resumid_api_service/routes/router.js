const express = require('express');
const GptController = require("../controllers/GptRequestController");

const router = express.Router();

router.post('/gpt-service', GptController.CreateAnalyzeResume);

module.exports = router;