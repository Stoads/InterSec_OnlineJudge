var express = require('express');
var router = express.Router();

var dbControl = require('../db-control');

router.get('/', function(req, res, next) {
  // console.log(req.query);
  // console.log(req.query.status=='');
  var ret=req.query;
  var from_problem = req.query.from_problem == undefined ? 0 : req.query.from_problem;
  var no = isNaN(req.query.no * 1) ? 0 : req.query.no * 1;
  var id = req.query.id == undefined ? 0 : req.query.id;
  var status = req.query.status=='' ? NaN : req.query.status * 1;
  var page = isNaN(req.query.page * 1) ? 1 : req.query.page * 1;;
  var page_cut = 10;
  // console.log(from_problem);
  // console.log(no);
  // console.log(id);
  // console.log(status);
  ret['id'] = id ? '' + id : '';
  ret['from_problem'] = from_problem ? '' +from_problem : '';
  ret['no']= no ? '' + no : '';
  ret['status']= isNaN(status) ? '' : '' + status;
  // console.log(ret);
  var query = '';
  var argjson = {};
  var args = [];
  if (no) argjson['no'] = no;
  if (id) argjson['id'] = id;
  if (!isNaN(status)) argjson['status'] = status;
  // console.log(argjson);
  for (var v in argjson) {
    query += ' and ' + v + ' = ?';
    args.push(argjson[v]);
  }
  query = query.replace('and', 'where');
  console.log(query, args);
  var sendjson={session:req.session.user,page:page,ret:ret,from_problem:from_problem};
  var default_action=function(){
    dbControl.query('select count(*) as COUNT from scoring'+query, args,function(err,rows,field){
      query += ' order by number DESC limit ?,' + page_cut;
      args.push(page_cut * (page - 1));
      if(err)next(err);
      if(!rows[0])next(new Error('DB Access error in count'));
      var pages=Math.ceil(rows[0]['COUNT']/10);
      sendjson['pages']=pages;
      dbControl.query('select * from scoring' + query, args, function(err, rows, filed) {
        if (!err) {
          // console.log(rows);
          sendjson['statusList']=rows;
          if (from_problem&&no>=1000) {
            dbControl.query('select NO,TITLE from problem where no = ?', [no], function(err, rows, field) {
              if(!err){
                if(rows[0]){
                  sendjson['problem']=rows[0];
                //  console.log(sendjson);
                  res.render('status', sendjson)
                }
                else{
                  next(new Error('Wrong parameters'))
                }
              }
              else{
                next(new Error('DB Access error'));
              }
            });
          } else {
            //console.log(sendjson);
            res.render('status',sendjson);
          }
        } else {
          next(new Error('DB Access error with paging'));
        }
      })
    })
  }
  if(req.session.user){
    dbControl.query('select no,status from status where id = ? order by no',[req.session.user['ID']],function(err,rows,field){
      if(err)next(err);
      console.log(rows);
      var user_json={};
      rows.forEach(function(v,i,c){
        user_json[''+v['no']]=v['status'];
      });
      sendjson['userstatus']=user_json;
      default_action();
    });
  }
  else default_action();
  // res.render('status', {
  //   session: req.session.user,
  //   // problem: ,
  // });
});

module.exports = router;
