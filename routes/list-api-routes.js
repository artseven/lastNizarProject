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

    theList.save((err) => {
      if (err) {
        res.status(500).json({ message: "List save went to shit"});
      }
    });
  });//Close exec callback
});//Close post('/api/lists')


router.get('/api/lists', (req, res, next) => {
  ListModel
  .find({ owner: req.user._id})
  .populate('cards')
  .exec((err, allTheLists) => {
    if (err) {
      res.status(500).json({ message: "List find catched an error"});
      return;
    }

    res.status(200).json(allTheLists);
  });
});

module.exports = router;
