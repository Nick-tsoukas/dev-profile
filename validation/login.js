const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  /*
   Validator must take in a string ... if user does not enter a name/email/password
   value when registering we must provide an Empty string
  */

  /*  if a name/email/password was given then it is req.body (the data) else data['whatever property'] is an empty string
  this is for the validator isEmpty method
  */

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if(!Validator.isEmail(data.email)){
    errors.email = 'Not a proper email format'
  }
  if(Validator.isEmpty(data.email)){
    errors.email = 'Email field is required'
  }
  if(Validator.isEmpty(data.password)){
    errors.password = 'Password field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
