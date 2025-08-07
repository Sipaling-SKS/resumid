import pinataConfig from "../constants/pinataConfig";
import { PinataSDK } from 'pinata'

export async function CreatePresignedUrl(req, res) {
  try {
    const { expires = 60 } = req.body;

    const pinata = new PinataSDK({
      pinataJwt: pinataConfig.PINATA_JWT,
      pinataGateway: pinataConfig.PINATA_GATEWAY_URL
    });

    const url = await pinata.upload.public.createSignedURL({
      expires
    });

    return res.status(200).json({ url, message: "Success creating presigned url" });
  } catch (error) {
    return res.status(500).json({ message: `Error creating presigned url: ${error.message || error}` });
  }
}