const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("this is the get request of place router");
  res.json({ message: "this works" });
});

module.exports = router;
