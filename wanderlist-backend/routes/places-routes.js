const express = require("express");

const HttpError = require("../models/http-error");
const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:pid", placesControllers.getPlacesById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

module.exports = router;
