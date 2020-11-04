var express = require('express');
var router = express.Router();

var dbControl = require('../db-control');

router.get('*', function(req, res, next) {
  if (!req.session.user || !req.session.user['AUTHORITY'])
    res.redirect('/');
  next('route');
});

router.get('/problemset', function(req, res, next) {
  if (!req.session.user || !req.session.user['AUTHORITY'])
    res.redirect('/');
  res.render('manage-problemset', {
    session: req.session.user
  });
});

router.post('/search', function(req, res, next) {
  dbControl.query('select NO,TITLE from problem where NO = ?', [req.body.data], function(err, rows, fields) {
    if (!err) {
      var respondData = {
        result: 'no data'
      };
      if (rows[0])
        respondData = {
          result: 'ok',
          no: rows[0]['NO'],
          title: rows[0]['TITLE']
        };
      console.log(respondData);
      res.json(respondData);
    } else {
      next(err);
    }
  });
});

router.post('/delete', function(req, res, next) {
  dbControl.query('delete from problem where NO = ?', [req.body.data], function(err, rows, fields) {
    var respondData = {
      result: 'failed'
    };
    if (!err)
      respondData = {
        result: 'ok',
        no: req.body.data
      };
    console.log(respondData);
    res.json(respondData);
  });
});

router.get('/update/:no', function(req, res, next) {
  var no = req.params.no;
  no *= 1;
  if (isNaN(no))
    throw new Error("Wrong Path");
  dbControl.query('select * from problem where no = ?', [no], function(err, rows, fields) {
    if (!err) {
      if (rows[0]) {
        res.render('add-problem', {
          session: req.session.user,
          problem: rows[0],
          type: 'update'
        });
      } else {
        next(new Error("Wrong Path"));
      }
    } else {
      next(err);
    }
  });
});

router.get('/insert', function(req, res, next) {
  res.render('add-problem', {
    session: req.session.user,
    type: 'insert'
  });
})

router.post('/update/:no',function(req,res,next){
  var no = req.params.no;
  no *= 1;
  if (isNaN(no))
    throw new Error("Wrong Path");
  dbControl.query('update problem set ' +
  'title = ?, content = ?, input_text = ?, output_text = ?, ' +
  'input_ex = ?, output_ex = ?, timelimit = ?, memorylimit = ? '+
  'where no = ?;',
  [req.body.title,req.body.content,req.body.input_text,req.body.output_text,
  req.body.input_ex,req.body.output_ex,req.body.timelimit,req.body.memorylimit,
  no],function(err,rows,fields){
    if(!err){
      res.redirect('/manage/problemset');
    }
    else {
      nexr(err);
    }
  })
});

router.post('/insert',function(req,res,next){
  dbControl.query('insert into problem (title,content,input_text,output_text,' +
  'input_ex,output_ex,timelimit,memorylimit) values (?,?,?,?,?,?,?,?)',
  [req.body.title,req.body.content,req.body.input_text,req.body.output_text,
  req.body.input_ex,req.body.output_ex,req.body.timelimit,req.body.memorylimit],
  function(err,rows,fields){
    if(!err){
      res.redirect('/manage/problemset');
    }
    else{
      next(err);
    }
  })
});

module.exports = router;
