const pinataConfig = require("../constants/pinataConfig");
const { PinataSDK } = require('pinata');

async function CreatePresignedUrl(req, res) {
  try {
    const { expires = 60, private } = req.body;

    const pinata = new PinataSDK({
      pinataJwt: pinataConfig.PINATA_JWT,
      pinataGateway: pinataConfig.PINATA_GATEWAY_URL
    });

    let url;
    if (private === "true") {
      url = await pinata.upload.private.createSignedURL({
        expires
      });
    } else {
      url = await pinata.upload.public.createSignedURL({
        expires
      });
    }

    return res.status(200).json({ url, message: `Success creating ${private === "true" ? "private" : "public"} presigned url` });
  } catch (error) {
    return res.status(500).json({ message: `Error creating ${private === "true" ? "private" : "public"} presigned url: ${error.message || error}` });
  }
}

module.exports = { CreatePresignedUrl };