const express = require('express');
const router  = express.Router();

router.post('/api/signup', (req, res, next) => {

  const theEmail = req.body.signupEmail;
  const thePassword = req.body.signupPassword;

  if (!theUsername || !thePassword) {
    res.status(400).json( { message: 'Please provide an email & password'});
    return;
  }
});

module.exports = router;
