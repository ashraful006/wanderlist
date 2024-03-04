const HttpError = require("../models/http-error");
const uuid = require("uuid");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

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
  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new HttpError(
      'Cannot find place',
      500
    );

    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.length === 0) {
    return next(
      new HttpError("Could not find places for the given user id", 404)
    );
  }

  res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs are passed.", 422));
  }

  const { title, description, location, creator, image } = req.body;

  let user;
  
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  const newPlace = new Place({
    title,
    description,
    location: location,
    image,
    creator,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newPlace.save({session: sess});
    user.places.push(newPlace);
    await user.save({session: sess});
    await sess.commitTransaction();
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
    place = await Place.findById(id).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Cannot delete place",
      500
    );

    return next(error);
  }

  if (!place) {
    return next(new HttpError('Cannot find given place', 404));
  }
  
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await place.deleteOne({ session: sess });
    await sess.commitTransaction();
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
