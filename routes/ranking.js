var express = require('express');
var router = express.Router();

var dbControl = require('../db-control');

var rank_list = function(req, res, next, page) {
  var page_cut = 10;
  //select ID,ifnull(SOLVED,0) as SOLVED from user left join (select id,count(*) as solved from status where status=2 group by id)cnt using(id) limit 0,10;
  dbControl.query('select COUNT(*) as COUNT from user left join (select id,count(*) as solved from status where status=2 group by id)cnt using(id)',
    function(err, rows, field) {
      if (err) next(err);
      var pages = Math.ceil(rows[0]['COUNT'] / page_cut);
      dbControl.query('select ID,NICKNAME,ifnull(SOLVED,0) as SOLVED from user left join (select id,count(*) as solved from status where status=2 group by id)cnt using(id) order by SOLVED DESC limit ?,?',
        [(page - 1) * page_cut, page_cut],
        function(err, rows, field) {
          if (err) next(err);
          //console.log(rows);
          res.render('ranklist', {
            session: req.session.user,
            rankList: rows,
            rank: page * 10 - 9,
            page: page,
            pages: pages
          });
        });
    });
}

router.get('/list', function(req, res, next) {
  rank_list(req, res, next, 1);
});

router.get('/list/:page', function(req, res, next) {
  var page = req.params.page;
  page *= 1;
  if (isNaN(page)) throw new Error('Wrong path');
  rank_list(req, res, next, page);
})

router.get('/', function(req, res, next) {
  rank_list(req, res, next, 1);
});

router.get('/user/:id', function(req, res, next) {
  var id = req.params.id;
  //console.log(id+' in rankuser');
  var sendjson = {
    session: req.session.user,
  };
  //console.log(sendjson);
  var default_action = function() {
    dbControl.query('select ID,NICKNAME from user where id = ?',[id],function(err,rows,field){
      if(err)next(err);
      if(!rows[0])next(new Error('Wrong Path'));
      sendjson['idinfo']=rows[0];
      dbControl.query('select status, count(*) as COUNT from scoring where id = ? and status > 0 group by status order by status',[id],function(err,rows,field){
        if(err)next(err);
        var try_info={
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        };
        //console.log(rows);
        rows.forEach(function(v,i,c){
          try_info[v['status']]=v['COUNT'];
        });
        //console.log(try_info);
        sendjson['tryinfo'] = try_info;
        dbControl.query('select no,status from status where id = ? order by no', [id], function(err, rows, field) {
          var status_info = {
            solved: [],
            wrong: []
          };
          //console.log(rows);
          rows.forEach(function(v, i, c) {
            if (v['status'] == 1) status_info['wrong'].push(v['no']);
            else if (v['status'] == 2) status_info['solved'].push(v['no']);
          })
          sendjson['statusinfo'] = status_info;
          //console.log(status_info);
          res.render('rankuser',sendjson);
        })
      });
    })
  };
  if (req.session.user) {
    dbControl.query('select no,status from status where id = ? order by no', [req.session.user['ID']], function(err, rows, field) {
      if (err) next(err);
      //console.log(rows);
      var user_json = {};
      rows.forEach(function(v, i, c) {
        user_json['' + v['no']] = v['status'];
      });
      sendjson['userstatus'] = user_json;
      default_action();
    });
  } else {
    default_action();
  }
});

module.exports = router;
