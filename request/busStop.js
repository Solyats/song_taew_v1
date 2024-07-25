const { body } = require("express-validator");

const busStopValidator = [
  body("busStop_name")
    .exists()
    .withMessage("busStop_name is required")
    .isString()
    .withMessage("busStop_name must be a string")
    .notEmpty()
    .withMessage("busStop_name cannot be empty"),
  body("busStop_subname")
    .exists()
    .withMessage("busStop_subname is required")
    .isString()
    .withMessage("busStop_subname must be a string")
    .notEmpty()
    .withMessage("busStop_subname cannot be empty"),
  body("busStop_status")
    .exists()
    .withMessage("busStop_status is required")
    .isString()
    .withMessage("busStop_status must be a string")
    .notEmpty()
    .withMessage("busStop_status cannot be empty"),
  body("busStop_latitude")
    .exists()
    .withMessage("busStop_latitude is required")
    .isFloat()
    .withMessage("busStop_latitude must be a float")
    .notEmpty()
    .withMessage("busStop_latitude cannot be empty"),
  body("busStop_longitude")
    .exists()
    .withMessage("busStop_longitude is required")
    .isFloat()
    .withMessage("busStop_longitude must be a float")
    .notEmpty()
    .withMessage("busStop_longitude cannot be empty"),
];

module.exports = { busStopValidator };
