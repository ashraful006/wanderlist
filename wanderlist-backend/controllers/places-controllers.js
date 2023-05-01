const HttpError = require("../models/http-error");

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

const getPlacesById = (req, res, next) => {
  const place = DUMMY_PLACES.find((plcaes) => plcaes.id === req.params.pid);

  if (!place) {
    throw new HttpError("Could not find place for the given place id", 404);
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const place = DUMMY_PLACES.find((place) => place.creator === req.params.uid);

  if (!place) {
    return next(
      new HttpError("Could not find place for the given user id", 404)
    );
  }

  res.json({ place });
};

exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
