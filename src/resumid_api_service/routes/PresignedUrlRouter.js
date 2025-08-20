const express = require("express");
const { CreatePresignedUrl } = require("../controllers/PresignedUrlController.js"); 

const router = express.Router();

router.get("presigned_url", CreatePresignedUrl);

module.exports = router;