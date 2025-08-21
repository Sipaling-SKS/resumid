const express = require('express');
const { CreateAnalyzeResume, CreateMockupAnalyzeResume } = require("../controllers/GeminiController");

const router = express.Router();

// Connected endpoint with open ai gemini service
router.post('/gemini-service', CreateAnalyzeResume);

// Mockup endpoint to return open ai gemini response mockup (static response)
router.post('/gemini-mockup', CreateMockupAnalyzeResume);

module.exports = router;