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

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("Invalid information given", 422));
  }

  const { name, email, password, places } = req.body;

  let isEmailExists;

  try {
    isEmailExists = await User.findOne({email: email});
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
    places,
    image: 'data:image/'
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(new HttpError('Cannot sign you up, please try again', 500));
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError("Given email and password seems to be wrong!"));
  }

  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
