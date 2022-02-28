// Don't forget to use NPM to install Express and Mongoose.

"use strict";

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/mad9124", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDB ..."))
  .catch((err) => {
    console.error("Problem connecting to MongoDB ...", err.message);
    process.exit(1);
  });

const morgan = require("morgan");
const express = require("express");
const app = express();

app.use(morgan("tiny"));
app.use(express.json());

app.use("/api/cars", require("./routes/cars"));

app.use("/api/people", require("./routes/people"));

const port = process.env.PORT || 3030;
app.listen(port, () =>
  console.log(`HTTP server listening on port ${port} ...`)
);
