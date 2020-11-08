var express = require('express');
var router = express.Router();

var dbControl = require('../db-control');

function problem_query(req, res, next, page) {
  dbControl.query("select count(no) as COUNT from problem where no >=1000;", function(err, rows, fields) {
    if (!err) {
      var pages = Math.ceil(rows[0]['COUNT'] / 10);
      //console.log(pages);
      dbControl.query("select problem.no as NO,problem.title as TITLE,ifnull(status.status,0) as STATUS from problem " +
        "left join status on (problem.no = status.no and status.ID = ?) " +
        "where problem.NO >= 1000 " +
        "order by problem.NO " +
        "limit 10 offset ?", [req.session.user ? req.session.user['ID'] : null, 10 * (page - 1)],
        function(err, rows, fields) {
          if (!err) {
            if (page <= pages) {
              console.log(rows);
              res.render('problemset', {
                session: req.session.user,
                problemList: rows,
                pages: pages,
                page: page
              });
            } else {
              next(new Error("Wrong Path"));
            }
          } else {
            next(err);
          }
        });
    } else {
      next(err);
    }
  });
}

router.get('/', function(req, res, next) {
  problem_query(req, res, next, 1);
});


router.get('/:page', function(req, res, next) {
  var page = req.params.page;
  page *= 1;
  if (isNaN(page) || page <= 0)
    throw new Error("Wrong Path");
  console.log(page);
  problem_query(req, res, next, page);
});

module.exports = router;
