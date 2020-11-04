var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log(req.query.next || '/');
  req.session.destroy();
  res.redirect(req.query.next || '/');
});

module.exports = router;
