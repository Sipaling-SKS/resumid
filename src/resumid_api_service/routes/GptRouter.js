const express = require('express');
const { CreateAnalyzeResume, CreateMockupAnalyzeResume } = require("../controllers/GptRequestController");

const router = express.Router();

// Connected endpoint with open ai gpt service
router.post('/gpt-service', CreateAnalyzeResume);

// Mockup endpoint to return open ai gpt response mockup (static response)
router.post('/gpt-mockup', CreateMockupAnalyzeResume);

module.exports = router;