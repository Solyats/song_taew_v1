const { body } = require("express-validator");

const busStopValidator = [
  body("busStop_name")
    .exists()
    .withMessage("busStop_name is required")
    .isString()
    .withMessage("busStop_name must be a string"),
  body("busStop_latitude")
    .exists()
    .withMessage("busStop_latitude is required")
    .isFloat()
    .withMessage("busStop_latitude must be a float"),
  body("busStop_longitude")
    .exists()
    .withMessage("busStop_longitude is required")
    .isFloat()
    .withMessage("busStop_longitude must be a float"),
];

module.exports = { busStopValidator };
