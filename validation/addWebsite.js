const Validator = require('validator');
const isEmpty = require('./utility/is-empty');

module.exports = function validateWebsiteInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.url = !isEmpty(data.url) ? data.url : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name is required.';
  }

  if (Validator.isEmpty(data.url)) {
    errors.url = 'URL is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
