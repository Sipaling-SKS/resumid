import express from "express";

import { CreatePresignedUrl } from "../controllers/PresignedUrlController"; 

const router = express.Router();

router.get("presigned_url", CreatePresignedUrl);

export default router;