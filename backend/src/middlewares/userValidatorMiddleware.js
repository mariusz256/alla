const { check, validationResult } = require("express-validator");

exports.userValidator = [
  check("email").isEmail().withMessage("Invalid email").bail(),
  check("password")
    .isLength({ min: 5 })
    .withMessage("The password must have at least 5 characters")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });
    next();
  },
];
