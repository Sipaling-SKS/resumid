const express = require('express');

const GptController = require("../controllers/GptRequestController");

const router = express.Router();

// Connected endpoint with open ai gpt service
router.post('/gpt-service', GptController.CreateAnalyzeResume);

// Mockup endpoint to return open ai gpt response mockup (static response)
router.post('/gpt-mockup', GptController.CreateMockupAnalyzeResume);

module.exports = router;