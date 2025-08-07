import dotenv from "dotenv";
dotenv.config();

const cfg = {
  PINATA_JWT: process.env.EXPRESS_PINATA_JWT,
  PINATA_GATEWAY_URL: process.env.EXPRESS_PINATA_GATEWAY_URL
}

export default cfg;