const express = require("express");
const bodyParser = require("body-parser");

const placeRoutes = require("./routes/places-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placeRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error has occured" });
});

app.listen("5000");
