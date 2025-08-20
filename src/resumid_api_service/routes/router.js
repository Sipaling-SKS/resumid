const express = require('express');
const presignedUrlRouter = require('./PresignedUrlRouter');
const geminiRouter = require('./GeminiRouter');

const router = express.Router();

router.use('/upload', presignedUrlRouter);
router.use('/analyze', geminiRouter);

module.exports = router;
