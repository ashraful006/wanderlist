const express = require("express");
const { check } = require("express-validator");
const placesControllers = require("../controllers/places-controllers");
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get("/:pid", placesControllers.getPlacesById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 }),
    check("location").notEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 })
  ],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
