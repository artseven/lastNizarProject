const UserModel = require('../models/user-model');
const passport  = require('passport');
const express = require('express');
const bcrypt  = require('bcrypt');
const router  = express.Router();

router.post('/api/signup', (req, res, next) => {
  const theFullName = req.body.signupFullName;
  const theEmail = req.body.signupEmail;
  const thePassword = req.body.signupPassword;

  if (!theEmail || !thePassword) {
    res.status(400).json( { message: 'Please provide an email & password'});
    return;
  }

  UserModel.findOne(
  { email: theEmail},
  (err, userFromDb) => {

    if (err) {
      res.status(500).json ({ message: 'Oops,backend failed'});
      return;
    }

    if (userFromDb) {
      res.status(400).json({ message: 'Email is taken, friend'});
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const scrambledPassword = bcrypt.hashSync(thePassword, salt);

    const theUser = new UserModel({
      fullName: theFullName,
      email: theEmail,
      encryptedPassword: scrambledPassword
    });

    theUser.save((err) => {
      if (err) {
        res.status(500).json ({ message: 'Oops,backend failed'});
        return;
      }
    // Log in the user automatically after signup
      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json ({ message: 'Oops,log in failed'});
          return;
        }

        res.status(200).json(theUser);
      });
    });
  }
  );
});


router.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    console.log(failureDetails);
    if (err) {
      res.status(500).json ({ message: 'Something went wrong'});
      return;
    }

    if (!theUser) {
      // failureDetails contains the error messages
      // from our logic in LocalStrategy.
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Passport login failed'});
        return;
      }
    });
  });
});
module.exports = router;
