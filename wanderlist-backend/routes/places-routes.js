const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 90.45,
      lng: -45.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  const place = DUMMY_PLACES.find((plcaes) => plcaes.id === req.params.pid);
  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const place = DUMMY_PLACES.find((place) => place.creator === req.params.uid);
  res.json({ place });
});

module.exports = router;
