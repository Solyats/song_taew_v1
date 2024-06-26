const { body } = require('express-validator');

const shuttlebusValidator = [
  body('shuttleBus_name')
    .exists().withMessage('shuttleBus_name is required')
    .notEmpty().withMessage('shuttleBus_name cannot be empty'),
  body('shuttleTHname')
    .exists().withMessage('shuttleTHname is required')
    .notEmpty().withMessage('shuttleTHname cannot be empty'),
  body('shuttleBus_color')
    .exists().withMessage('shuttleBus_color is required')
    .notEmpty().withMessage('shuttleBus_color cannot be empty'),
  body('shuttleBus_time')
    .exists().withMessage('shuttleBus_time is required')
    .notEmpty().withMessage('shuttleBus_time cannot be empty'),
  body('shuttleBus_price')
    .exists().withMessage('shuttleBus_price is required')
    .isFloat({ min: 0 }).withMessage('shuttleBus_price must be a positive number'),
  body('shuttleBus_picture')
    .exists().withMessage('shuttleBus_picture is required')
    .notEmpty().withMessage('shuttleBus_picture cannot be empty'),
  body('polylineColor')
    .optional()
    .isString().withMessage('polylineColor must be a string'),
  body('symbolColor')
    .optional()
    .isString().withMessage('symbolColor must be a string'),
  body('icon_shuttle_bus')
    .optional()
    .isString().withMessage('icon_shuttle_bus must be a string'),
  body('detailData')
    .optional()
    .isArray().withMessage('icon_shuttle_bus must be a array')
];

module.exports = shuttlebusValidator;

module.exports = {
  shuttlebusValidator,
};
