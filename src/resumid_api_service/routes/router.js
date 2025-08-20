const express = require('express');

const GptController = require("../controllers/GptRequestController");
const GeminiController = require("../controllers/GeminiController");

const router = express.Router();

// Connected endpoint with open ai gpt service
router.post('/gpt-service', GptController.CreateAnalyzeResume);

// Mockup endpoint to return open ai gpt response mockup (static response)
router.post('/gpt-mockup', GptController.CreateMockupAnalyzeResume);

// Connected endpoint with open ai gemini service
router.post('/gemini-service', GeminiController.CreateAnalyzeResume);

// Mockup endpoint to return open ai gemini response mockup (static response)
router.post('/gemini-mockup', GeminiController.CreateMockupAnalyzeResume);

// Connected endpoint with open ai gemini service
router.post('/gemini-extract', GeminiController.ExtractResume);

router.post('/gemini-extractMock', GeminiController.ExtractResumeMock);


module.exports = router;