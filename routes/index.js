var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user)
    console.log('index with', req.session.user);
  res.render('index', { title: 'Index' , session:req.session.user});
});

module.exports = router;
