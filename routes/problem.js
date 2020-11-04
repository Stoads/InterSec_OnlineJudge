var express = require('express');
var router = express.Router();

var dbControl = require('../db-control');

router.get('/:no', function(req, res, next) {
  var no = req.params.no;
  no *= 1;
  if(isNaN(no))
    throw new Error("Wrong Path");
  dbControl.query("select * from problem where no = ?",[no],function(err,rows,field){
    if(!err){
      if(rows[0]){
        console.log(rows[0]);
        res.render('problem', { session:req.session.user, problem:rows[0]});
      }
      else {
        next(new Error("Wrong Path"));
      }
    }
    else{
      next(err);
    }
  })
});

module.exports = router;
