const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("Authorization failed.");
    }

    const decodedData = jwt.verify(token, "topsecret");
    req.userData = { userId: decodedData.userId };
    next();
  } catch (error) {
    const err = new HttpError("Authorization failed", 401);
		next(err);
  }
};
