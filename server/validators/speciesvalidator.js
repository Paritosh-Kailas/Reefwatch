const { body } = require('express-validator');

const speciesValidator = [
  body('name').trim().notEmpty().withMessage('Species name is required'),
  body('scientificName').trim().notEmpty().withMessage('Scientific name is required'),
  body('conservationStatus').isIn(['Least Concern', 'Near Threatened', 'Vulnerable', 'Endangered', 'Critically Endangered', 'Extinct in Wild', 'Extinct']).withMessage('Invalid conservation status'),
];

module.exports = { speciesValidator };
