const uuid = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Md. Ashraful Islam",
    email: "asif@gmail.com",
    password: "testpassword",
  },
];

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, '-password');
  } catch (err) {
    return next(new HttpError('Cannot get users at this time, please try again later', 500));
  }

  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("Invalid information given", 422));
  }

  const { name, email, password } = req.body;

  let isEmailExists;

  try {
    isEmailExists = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError('Cannot signin now, please try again later', 500));
  }

  if (isEmailExists) {
    return next(new HttpError('Email already exists', 422));
  }

  const newUser = new User({
    name,
    email,
    password,
    places: [],
    image: req.file.path
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(new HttpError('Cannot sign you up, please try again', 500));
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError('Cannot signin now, please try again later', 500));
  }

  if (!user || user.password !== password) {
    return next(new HttpError('Wrong email or password', 401));
  }

  res.json({ 
    message: "Logged in",
    user: user.toObject({ getters: true })
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
