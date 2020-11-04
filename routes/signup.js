var express = require('express');
var router = express.Router();

var dbControl = require('../db-control');

router.get('/', function(req, res, next) {
  //res.send('Signin Test');
  if (req.session.user)
    req.session.save(()=>{
      res.redirect('/');
    });
  else{
    res.render('signup', {
      session: req.session.user
    });
  }
});
router.post('/ajax', function(req, res, next) {
  // console.log(req.body.type, req.body.data);
  // console.log('select * from user where '+req.body.type+' = ?');
  dbControl.query('select * from user where ' + req.body.type + ' = ?', [req.body.data], function(err, rows, fields) {
    var responseData = {
      result: "err"
    };
    if (!err) {
      if (rows[0]) {
        responseData.result = "no";
      } else {
        responseData.result = "ok";
      }
      res.json(responseData);
    }
    else{
      next(err);
    }
  });
});
router.post('/', function(req, res, next) {
  if (req.body.password == req.body.passwordrepeat) {
    dbControl.query('insert into user values (?,?,?,?,0)', [req.body.id, req.body.name, req.body.nickname, req.body.password], function(err, rows, fields) {
      if (!err) {
        var row = {
          ID: req.body.id,
          NAME: req.body.name,
          NICKNAME: req.body.nickname,
          AUTHORITY: req.body.nickname
        }
        req.session.user = row;
        req.session.save(() => {
          res.redirect('/');
        });
      } else {
        next(err);
      }
    });
  } else {
    res.render('/signup', {
      session: req.session.user
    });
  }
});
module.exports = router;
