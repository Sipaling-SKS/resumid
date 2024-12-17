const express = require('express');

const GptController = require("../controllers/GptRequestController");

const router = express.Router();

router.post('/gpt-service', GptController.CreateAnalyzeResume);
router.post('/gpt-mockup', GptController.CreateMockupAnalyzeResume);

module.exports = router;