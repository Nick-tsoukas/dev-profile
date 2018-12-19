const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput    = require('../../validation/login');

// Getting User Model from Users.js
const User = require('../../models/Users');

// Creating user
router.post('/register', (req, res) => {
  // Destruct return val from validateRegisterInput and proceed to validate
  const {errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if(!isValid) {
    return res.status(400).json(errors)
  }

  // Checks to see if user already exists
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {

        // Creating the avatar image from gravatar api
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        })

        // Creating user from form data
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password
        });

        //encrypts the password and then saves user to database

        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
         // Adds user to mongo db
            newUser.save()
              .then(user => {
                console.log('user created ============================');
                res.json(user);
              })
              .catch(err => console.log(err));
          });
        });

      }
    })

})

router.post('/login', (req, res) => {
  const {errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if(!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email;
  const password = req.body.password;
  //Find user with mongoose email
  User.findOne({email})
    .then(user => {
      if(!user) {
        errors.email = "User not found"
        res.status(404).json(errors)
      }
      // Check password of user
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            //  User matched
            // create payload jwt
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }

            // Sign jsonwebtoken and return Token
            jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
              console.log(payload)
              res.json({
                success: 'true',
                token: 'Bearer ' + token
              })
            });

          } else {
            errors.password = "Password is incorrect!"
            res.status(400).json(errors)
          }
        })
    })
});

// @route Get api/users/current

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;
