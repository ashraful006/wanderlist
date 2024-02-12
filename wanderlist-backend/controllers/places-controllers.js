const HttpError = require("../models/http-error");
const uuid = require("uuid");
const { validationResult } = require("express-validator");
const Place = require("../models/place");

const getPlacesById = async (req, res, next) => {
  const id = req.params.pid;
  let place;

  try {
    place = await Place.findById(id);
  } catch (err) {
    const error = new HttpError(
      'Cannot find place',
      500
    );

    return next(error);
  }

  if (!place) {
    return next(new HttpError("Could not find place for the given place id", 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'Cannot find place',
      500
    );

    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the given user id", 404)
    );
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs are passed.", 422));
  }

  const { title, description, location, address, creator, image } = req.body;
  const newPlace = new Place({
    title,
    description,
    location: location,
    address,
    image,
    creator,
  });

  try {
    await newPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Cannot create places",
      500
    );

    return next(error);
  }

  res.status(201).json({ place: newPlace });
};

const updatePlace = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { title, description } = req.body;

  const id = req.params.pid;
  let place;

  try {
    place = await Place.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Requested place not found",
      404
    );

    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Cannot update place",
      500
    );

    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const id = req.params.pid;

  let place; 

  try {
    place = await Place.findOne({_id: id});
  } catch (err) {
    const error = new HttpError(
      "Cannot delete place",
      500
    );

    return next(error);
  }

  try {
    await place.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Cannot delete the place",
      500
    );

    return next(error);
  }

  res.status(200).json({ message: "A place has beed deleted." });
};

exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
