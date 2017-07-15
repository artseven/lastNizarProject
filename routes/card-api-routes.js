const ensureLoggedInApiVersion = require('../lib/ensure-logged-in-api-version');
const ListModel = require('../models/list-model');
const CardModel = require('../models/card-model');
const express = require('express');
const router = express.Router();


router.post('/lists/:id/cards', ensureLoggedInApiVersion, (req, res, next) => {
  CardModel
  .findOne({ owner: req.user._id})
  // -1 means opposite order
  .sort({ position: -1})
  //Tell mongo to execute query
  .exec((err, lastCard) => {
    if (err) {
      res.status(500).json({ message: 'Find List went to shit'});
      return;
    }
    //Defaults to 1 if the er are no cards (new user)
    let newPosition = 1;

    if(lastCard) {
      //but use the last card's position (+1) if we have one
      newPosition = lastCard.position +1;
    }

    const theCard = new CardModel({
      title: req.body.cardTitle,
      position: newPosition,
      list: req.params.id
    });

    theCard.save((err) => {
      if (err) {
        res.status(500).json({ message: "Card save went to shit"});
      }

      ListModel.findByIdAndUpdate(
        req.params.id,
        { $push: {cards: theCard._id} },
        (err, listFromDb) => {
          if (err) {
            res.status(500).json({ message: 'List update went to'});
            return;
          }

          res.status(200).json(theCard);
        }
      );

      res.status(200).json(theCard);
    });
  });//Close exec callback
});//Close post('/lists/:id/cards')


router.patch('/api/cards/:id', (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.cardTitle,
      description: req.body.cardDescription,
      dueDate: req.body.dueDate
    },
    (err, cardFromDB) => {
      if (err) {
        res.status(500).json();
      }
    }
  );
});
module.exports = router;
