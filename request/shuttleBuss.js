const { body } = require('express-validator');

const shuttlebusValidator = [
  body('shuttleBus_id').notEmpty().withMessage('shuttleBus_id is required'),
  body('shuttleBus_name').notEmpty().withMessage('shuttleBus_name is required'),
  body('shuttleBus_color').notEmpty().withMessage('shuttleBus_color is required'),
  body('shuttleBus_time').notEmpty().withMessage('shuttleBus_time is required'),
  body('shuttleBus_price').isFloat({ min: 0 }).withMessage('shuttleBus_price must be a positive number'),
  body('shuttleBus_picture').notEmpty().withMessage('shuttleBus_picture is required'),
  body('polylineColor').optional().isString().withMessage('polylineColor must be a string'),
  body('symbolColor').optional().isString().withMessage('symbolColor must be a string'),
  body('icon_shuttle_bus').optional().isString().withMessage('icon_shuttle_bus must be a string')
];

module.exports = shuttlebusValidator;

module.exports = {
  shuttlebusValidator,
};
