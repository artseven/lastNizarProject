const ListModel = require('../models/list-model');
const express = require('express');
const router = express.Router();

router.post('/api/lists', (req, res, next) => {
  ListModel
  .findOne({ owner: req.user._id})
  // -1 means opposite order
  .order({ position: -1})
  //Tell mongo to execute query
  .exec((err, lastList) => {
    if (err) {
      res.status(500).json({ message: 'Find List went to shit'});
      return;
    }
    //Defaults to 1 if the er are no lists (new user)
    let newPosition = 1;

    if(lastList) {
      //but use the last list's position (+1) if we have one
      newPosition = lastList.position +1;
    }

    const theList = new ListModel({
      title: req.body.listTitle,
      position: newPosition,
      owner: req.user._id,

    });
  });//Close exec callback

});

module.exports = router;
