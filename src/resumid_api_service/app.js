const path = require("path");
const dotenv = require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const express = require("express");
const mongoose = require("mongoose");

const router = require("./routes/router");

const { API_HEADERS_KEY, API_IDEMPOTENCY_KEY } = require("./constants/global");

const app = express();

// Validate api key
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers[API_HEADERS_KEY];

  if(!apiKey) {
    return res.status(401).json({ message: "API key is missing" });
  }
  if(apiKey != process.env.API_KEY) {
    return res.status(403).json({ message: "Invalid API key" });
  }

  next();
}

// Validate idempotency key
// TODO: Change this logic to caching flow
const idempotencyKeys = new Set();
const attachIdempotencyKeys = (req, res, next) => {
  const requestKey = req.headers[API_IDEMPOTENCY_KEY];
  if(idempotencyKeys.has(requestKey)) {
    return res.send(409).json({ "message": "Duplicate request detected" });
  }

  idempotencyKeys.add(requestKey);

  // Delete after 4 sec
  setTimeout(() => {
    idempotencyKeys.delete(requestKey); 
  }, 4000);
  
  next();
};

app.use(express.json());

app.use(validateApiKey);
app.use(attachIdempotencyKeys);
app.use("/api", router);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });