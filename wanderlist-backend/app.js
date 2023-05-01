const express = require("express");
const bodyParser = require("body-parser");

const placeRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placeRoutes);

app.use((req, res, next) => {
  return next(new HttpError("Could not find given route", 404));
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error has occured" });
});

app.listen("5000");
