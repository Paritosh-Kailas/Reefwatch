const { body } = require('express-validator');

const pollutionValidator = [
  body('imageUrl').notEmpty().withMessage('Image URL is required'),
  body('waterClarityIndex').isFloat({ min: 0, max: 100 }).withMessage('Water clarity index must be 0-100'),
  body('pollutionSeverity').isIn(['Pristine', 'Low', 'Moderate', 'High', 'Critical']).withMessage('Invalid pollution severity'),
];

module.exports = { pollutionValidator };
