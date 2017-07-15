const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const UserModel = require('../models/user-model');
router.post('/api/signup', (req, res, next) => {
  const theFullName = req.body.signupFullName;
  const theEmail = req.body.signupEmail;
  const thePassword = req.body.signupPassword;

  if (!theUsername || !thePassword) {
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
    });
  }
  );
});

module.exports = router;
