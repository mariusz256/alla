const User = require("../models/userModel");
const ConfirmationToken = require("../models/confirmationTokenModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function create(req, res) {
  const email = req.body.email ? req.body.email : "";
  const password = req.body.password ? req.body.password : "";
  const salt = await bcrypt.genSalt(10);

  if (!email) {
    return res.json({ success: false, message: "Email is required!" });
  }
  if (!password) {
    return res.json({ success: false, message: "Password is required!" });
  }

  const user = {
    email: email,
    password: await bcrypt.hash(password, salt),
  };

  return User.query()
    .where("email", "=", email)
    .then((row) => {
      if (row.length == 1) {
        res.status(409);
        return res.json({ success: false, message: "Email alredy exist!" });
      }
      if (row.length == 0) {
        User.query()
          .insert(user)
          .then((user) => {
            res.status(201);
            return res.json({
              email: user.email,
              id: user.id,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(400);
            res.json(err.data);
          });
      }
    });
}

async function login(req, res) {
  const email = req.body.email ? req.body.email : "";
  const password = req.body.password ? req.body.password : "";
  const user = (await User.query().where("email", email))[0];

  const validPassword = user?.email
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!email) {
    return res.json({ success: false, message: "Email is required!" });
  }
  if (!password) {
    return res.json({ success: false, message: "Password is required!" });
  }

  if (user?.email && validPassword) {
    const payload = { email: user.email, id: user.id };

    const accessToken = jwt.sign(payload, `${process.env.TOKEN_SECRET}`, {
      expiresIn: 86400,
    });

    res.cookie("JWT", accessToken, {
      maxAge: 86400,
      httpOnly: true,
    });

    const refreshToken = jwt.sign(payload, `${process.env.REFRESH_TOKEN}`, {
      expiresIn: 525600,
    });

    res.cookie("REFRESH_TOKEN", refreshToken, {
      maxAge: 525600,
      httpOnly: true,
    });

    await user.$query().patch({
      refresh_token: refreshToken,
    });

    return res.send(payload);
  } else if (user?.email && !validPassword) {
    res.status(401);
    res.send({ success: false, message: "Wrong password. Please try again!" });
  } else {
    res.status(401);
    return res.json({ success: false, message: "User not found!" });
  }
}

async function get(req, res) {
  const token = req.cookies.JWT;
  await jwt.verify(token, `${process.env.TOKEN_SECRET}`, (err, user) => {
    if (err) return res.sendStatus(403);
    res.send({ user });
  });
}

async function refresh(req, res) {
  const refreshToken = req.cookies.REFRESH_TOKEN;

  if (!refreshToken) {
    return res.status(401);
  }

  if (refreshToken) {
    const userID = jwt.decode(refreshToken).id;

    const user = await User.query().findById(userID);
    if (user?.refresh_token) {
      await jwt.verify(
        refreshToken,
        `${process.env.REFRESH_TOKEN}`,
        (err, user) => {
          if (err) return res.sendStatus(403);
          const accessToken = jwt.sign(
            { email: user.email, id: user.id },
            `${process.env.TOKEN_SECRET}`,
            { expiresIn: 86400 }
          );

          res.cookie("JWT", accessToken, {
            maxAge: 86400,
            httpOnly: true,
          });
          res.send({ user });
        }
      );
    }
  }
}

async function confirmEmial(req, res) {
  const token = req.query.token;
  const confirmation_token = await ConfirmationToken.query().findOne(
    "token",
    token
  );

  if (!token) {
    res.status(400);
    return res.json({ succes: false, message: "No token" });
  }

  if (!confirmation_token) {
    res.status(400);
    return res.json({ succes: false, message: "No token" });
  }

  if (confirmation_token) {
    const user = await User.query().findById(confirmation_token.user_id);
    if (!user) {
      res.status(404);
      return res.json({ succes: false, message: "User not found" });
    }

    await user.$query().patch({ confirmed: 1 });
    confirmation_token.$query().delete();

    return res.json({ succes: true, message: "Email confirmed" });
  }
}

module.exports = {
  create,
  login,
  get,
  refresh,
  confirmEmial,
};
