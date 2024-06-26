
const { body } = require("express-validator");

const authValidator = [
  body("username")
    .exists()
    .withMessage("username is required")
    .isString()
    .withMessage("username must be a string")
    .notEmpty()
    .withMessage("username cannot be empty"),
  body("password")
    .exists()
    .withMessage("password is required")
    .isString()
    .withMessage("password must be a string")
    .notEmpty()
    .withMessage("password cannot be empty"),
];

module.exports = { authValidator };
