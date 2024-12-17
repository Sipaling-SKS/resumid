const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const router = require("./routes/router");

const app = express();

app.use(express.json());
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