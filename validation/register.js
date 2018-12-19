const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  /*
   Validator must take in a string ... if user does not enter a name/email/password
   value when registering we must provide an Empty string
  */

  /*  if a name/email/password was given then it is req.body (the data) else data['whatever property'] is an empty string
  this is for the validator isEmpty method
  */

  data.name = !isEmpty(data) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // if name is not between 2 and 30 characters create error message on the error object
  if(!Validator.isLength(data.name, {min: 2, max: 30} )){
    errors.name = 'Name must be between 2-30 charaters';
  }

  if(Validator.isEmpty(data.name)){
    errors.name = 'Name field is required'
  }
  if(Validator.isEmpty(data.email)){
    errors.email = 'Email field is required'
  }
  if(!Validator.isEmail(data.email)){
    errors.email = 'Not a proper email format'
  }
  if(Validator.isEmpty(data.password)){
    errors.password = 'Password field is required'
  }
  if(!Validator.isLength(data.password, {min: 6, max: 30})){
    errors.password = 'Password must be at least 6 characters'
  }
  if(Validator.isEmpty(data.password2)){
    errors.password2 = 'Please confirm the password'
  }
  if(!Validator.equals(data.password, data.password2)){
    errors.password2 = 'Passwords do not match'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
