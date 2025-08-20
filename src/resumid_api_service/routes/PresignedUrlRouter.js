const express = require("express");
const { CreatePresignedUrl } = require("../controllers/PresignedUrlController.js"); 

const router = express.Router();

router.post("presigned_url", CreatePresignedUrl);

module.exports = router;