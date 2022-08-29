const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authenticateMiddleware");
const { userValidator } = require("../middlewares/userValidatorMiddleware");
require("dotenv").config();
const userController = require("../controllers/userController");

router.post("/new", userValidator, userController.create);

router.post("/auth/login", userController.login);

router.post("/auth/refresh", userController.refresh);

router.get("/me", authenticate, userController.get);

router.get("/auth/confirmation", userController.confirmEmial);

module.exports = router;
