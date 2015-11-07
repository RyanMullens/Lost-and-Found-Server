var express = require('express');
var router = express.Router();




var mongoose = require('mongoose');
mongoose.connect(process.env.mongo || 'mongodb://localhost/lost');

var Lost = mongoose.model('Lost', {
  title: String,
  description : String,
  email : String,
  found : Boolean,
  location : {
    typeLocation : Number,
    points : []
  },
  checkedLocations : []
});



router.post('/', function(req, res, next) {

  var title = req.body.title;
  var description = req.body.description;
  var location = req.body.location;
  var email = req.body.email;

  var lost = new Lost({
     title: title,
     description : description,
     location : location,
     email : email,
     found : false
  });

  lost.save(function (err, data) {
    res.send(err || data);
  });

});

router.get('/', function(req, res, next) {
  Lost.find({}, function(err, data){

    if(data){

      data = {
        items : data
      }

    }

    res.send(err || data);
  })
});

router.get('/:lostId', function(req, res, next) {
  var id = req.params.lostId;
  Lost.findById(id, function(err, data){
    res.send(err || data);
  })
});

router.post('/:lostId/check', function(req, res, next) {
  var id = req.params.lostId;
  var points = req.body.points;

  Lost.findByIdAndUpdate(id,
    { $push: { checkedLocations: { $each: points } } },
    {safe: true, upsert: true},
    function(err, model) {
        res.send(err || model);
    }
  );
});

router.put('/:lostId', function(req, res, next) {
  var id = req.params.lostId;
  var found = req.body.found;

  Lost.findByIdAndUpdate(id,{},
    function(err, model) {
        model.found = found;
        model.save(function (err, data) {
          res.send(err || data);
        });
    }
  );
});


module.exports = router;
