import express from 'express';
import presignedUrlRouter from './routes/PresignedUrlRouter.js';
import geminiRouter from './routes/GeminiRouter.js';

const router = express.Router();

router.use('/upload', presignedUrlRouter);
router.use('/analyze', geminiRouter);

export default router;
