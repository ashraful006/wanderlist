const HttpError = require("../models/http-error");
const uuid = require("uuid");
const { validationResult } = require("express-validator");

let DUMMY_PLACES = [
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
  const places = DUMMY_PLACES.filter(
    (place) => place.creator === req.params.uid
  );

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the given user id", 404)
    );
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs are passed.", 422);
  }

  const { title, description, coordinates, address, creator } = req.body;
  const newPlace = {
    id: uuid.v4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(newPlace);

  res.status(201).json({ place: newPlace });
};

const updatePlace = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError("Invalid inputs passed", 422);
  }

  const { title, description } = req.body;

  const updatedPlace = {
    ...DUMMY_PLACES.find((place) => place.id === req.params.pid),
  };
  const index = DUMMY_PLACES.findIndex((place) => place.id === req.params.pid);
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[index] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  if (!DUMMY_PLACES.find((place) => (place.id = req.params.pid))) {
    throw new HttpError("Could not found place to delete", 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== req.params.pid);

  res.status(200).json({ message: "A place has beed deleted." });
};

exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
