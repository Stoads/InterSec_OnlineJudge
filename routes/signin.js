var express = require('express');
var router = express.Router();

var dbControl = require('../db-control');

router.get('/', function(req, res, next) {
  console.log(req.query.next || '/');
  if (req.session.user)
    req.session.save(() => {
      res.redirect('/');
    });
  else
  res.render('signin', {
    id: '',
    error: 0,
    next: req.query.next || '/',
    session: req.session.user
  });
});

router.post('/', function(req, res, next) {
  console.log('post');
  dbControl.query('Select * from user where id = ?', [req.body.id], function(err, rows, fields) {
    if (!err) {
      if (rows[0] && req.body.password == rows[0]['PASSWORD']) {
        delete rows[0]['PASSWORD'];
        console.log(rows[0]);
        req.session.user = rows[0];
        req.session.save(() => {
          res.redirect(req.body.next || '/');
        });
      } else {
        console.log('wronged');
        res.render('signin', {
          id: req.body.id,
          error: 1,
          next:req.body.next || '/',
          session: req.session.user
        });
      }
    } else {
      next(err);
    }
  });
  //res.send('um');
});

module.exports = router;
