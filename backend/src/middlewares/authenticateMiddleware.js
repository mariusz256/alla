const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  authenticate: function (req, res, next) {
    const token = req.cookies.JWT;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, `${process.env.TOKEN_SECRET}`, (err, user) => {
      if (err) return res.sendStatus(403);

      req.user = user;
      next();
    });
  },
};
