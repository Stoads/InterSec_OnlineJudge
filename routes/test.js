var express = require('express');
var router = express.Router();

var dbControl=require('../db-control');

router.get('/', function(req, res, next) {

  dbControl.query('select * from user', function (err, rows, fields) {
      if (!err) {
          console.log(rows);
          console.log(fields);
          var result = 'rows : ' + JSON.stringify(rows) + '<br><br>' +
              'fields : ' + JSON.stringify(fields);
          res.send(result);
      } else {
          console.log('query error : ' + err);
          res.send(err);
      }
  });
});

module.exports = router;
