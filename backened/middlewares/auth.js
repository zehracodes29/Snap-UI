const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorise = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log(token);

  if (!token) {
    res.status(400).json({ message: "token not found" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      } else {
        req.user = data;
        next();
      }
    });
  }
};
module.exports = authorise;
