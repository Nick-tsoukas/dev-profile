const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile');

const Profile = require('../../models/Profile');
const User = require('../../models/Users');

//passport will return the user object in the payload
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {};

  Profile.findOne({user: req.user.id})
    .then(profile => {
      if(!profile){
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors)
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route Post api/profile
// @desc Create user profile
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  // Get fields
  const { errors, isValid } = validateProfileInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }

  const profileFields = {};
  // We have the user object on the req.user
  // Start building the profile object
  profileFields.user = req.user.id;
  //checks to see if data was given
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.company) profileFields.company = req.body.company;



  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  if(typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }
  // Create social Object because social does not exist as a field on the front end
  profileFields.social = {};
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if(profile){
        // Update profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
        .then( profile => res.json(profile));
      } else {
        // Create profile
        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle})
          .then(profile => {
            if(profile){
              errors.handle = "That handle already exists";
              res.status(400).json(errors);
            }

            // Save profileFieldsnew Profile()
            new Profile(profileFields).save().then(profile => res.json(profile));
          });
      }
    });

});

module.exports = router;
