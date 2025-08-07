import express from 'express';
import { CreateAnalyzeResume, CreateMockupAnalyzeResume } from "../controllers/GptRequestController";

const router = express.Router();

// Connected endpoint with open ai gpt service
router.post('/gpt-service', CreateAnalyzeResume);

// Mockup endpoint to return open ai gpt response mockup (static response)
router.post('/gpt-mockup', CreateMockupAnalyzeResume);

export default router;