const uuid = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
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

  let hashedPassword;
  
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Signup failed please try again later", 500);
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    places: [],
    image: req.file.path
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(new HttpError('Cannot sign you up, please try again', 500));
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: newUser.id, 
        email: newUser.email
      }, 
      "topSecret", 
      {
        expiresIn: "1h"
      }
    );
  } catch (err) {
    const error = new HttpError("Failed to sign you up, please try again later.", 500);

    return next(error);
  }

  res.status(201).json({ userId: newUser.id, email: newUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError('Cannot signin now, please try again later', 500));
  }

  if (!user) {
    return next(new HttpError('Wrong email or password', 401));
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError("Cannot sign you in, please check your credentials and try again.", 500);
    return next(error);    
  }

  if (!isValidPassword) {
    return next(new HttpError('Wrong email or password', 401));
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: user.id, 
        email: user.email
      }, 
      "topSecret", 
      {
        expiresIn: "1h"
      }
    );
  } catch (err) {
    const error = new HttpError("Failed to log you in, please try again later.", 500);

    return next(error);
  }

  res.json({ 
    userId: user.id,
    email: user.email,
    token: token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
