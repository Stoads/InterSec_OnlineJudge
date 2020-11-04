var express = require('express');
var router = express.Router();

var dbControl = require('../db-control');

router.get('/', function(req, res, next) {
  res.render('remove', {
    session: req.session.user
  });
});
router.post('/', function(req, res, next) {
  dbControl.query('delete from user where id = ?', [req.body.id], function(err, rows, fields) {
    if(!err){
      req.session.destroy();
      res.redirect('/');
    }else{
      next(err);
    }
  });
});

module.exports = router;
