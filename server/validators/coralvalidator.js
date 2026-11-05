const { body } = require('express-validator');

const coralValidator = [
  body('imageUrl').notEmpty().withMessage('Image URL is required'),
  body('bleachingSeverity').isIn(['None', 'Mild', 'Moderate', 'Severe', 'Complete']).withMessage('Invalid bleaching severity'),
  body('healthScore').isFloat({ min: 0, max: 100 }).withMessage('Health score must be 0-100'),
];

module.exports = { coralValidator };
