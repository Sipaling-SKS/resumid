const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI_PROD)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });