const pinataConfig = require("../constants/pinataConfig");
const { PinataSDK } = require('pinata');

function buildMimeTypes(fileType) {
  switch (fileType) {
    case "image":
      return ["image/png", "image/jpeg", "image/jpg"];
    case "document":
      return [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"       // .xlsx
      ];
    default:
      return [];
  }
}

async function CreatePresignedUrl(req, res) {
  try {
    const {
      expires = 60, 
      uploadFileType, // required field
      maxFileSizeInMb = 5,
      isPrivate = false
    } = req.body;

    const mimeTypes = buildMimeTypes(uploadFileType);
    if (mimeTypes.length === 0) {
      return res.status(400).json({ message: `Unsupported fileType: ${fileType}` });
    }
    const maxFileSize = maxFileSizeInMb * 1024 * 1024;

    const pinata = new PinataSDK({
      pinataJwt: pinataConfig.PINATA_JWT,
      pinataGateway: pinataConfig.PINATA_GATEWAY_URL
    });

    const singnedUrlOptions = {
      expires,
      mimeTypes,
      maxFileSize
    };
    let url;
    
    if (isPrivate) {
      url = await pinata.upload.private.createSignedURL(singnedUrlOptions);
    } else {

      url = await pinata.upload.public.createSignedURL(singnedUrlOptions);
    }
    
    return res.status(200).json({ 
      url,
      message: `Success creating ${isPrivate ? "private" : "public"} presigned url`
    });
  } catch (error) {
    return res.status(500).json({ 
      message: `Error creating ${isPrivate ? "private" : "public"} presigned url: ${error.message || error}`
    });
  }
}

module.exports = { CreatePresignedUrl };