var express = require('express');
var fs = require('fs');
var router = express.Router();
var childProcess = require('child_process');

var dbControl = require('../db-control');
var exec = childProcess.exec;
var execSync = childProcess.execSync;

router.get('/:no', function(req, res, next) {
  var no = req.params.no;
  no *= 1;
  if (isNaN(no))
    throw new Error("Wrong Path");
  if (!req.session.user)
    res.redirect('/signin?next=/submit/' + no);
  dbControl.query("select NO,TITLE from problem where no = ?", [no], function(err, rows, field) {
    if (!err) {
      if (rows[0]) {
        console.log(rows[0]);
        res.render('submit', {
          session: req.session.user,
          problem: rows[0]
        });
      } else {
        next(new Error("Wrong Path"));
      }
    } else {
      next(err);
    }
  })
});
router.post('/:no', function(req, res, next) {
  var no = req.params.no;
  var user_id = req.session.user['ID'];
  no *= 1;
  if (isNaN(no))
    throw new Error("Wrong Path");
  if (!req.session.user)
    res.redirect('/signin?next=/submit/' + no);
  dbControl.query("insert into status(ID,NO) values(?,?)",[user_id,no],function(err,rows,field){
    if(!err){

    }
    else if(err.message.split(':')[0]=='ER_DUP_ENTRY'){

    }
    else{
      next(err);
    }
    dbControl.query("insert into scoring(ID,NO,STATUS) values(?,?,0)",[user_id,no],function(err,rows,field){
      if(err){

      }
      else{
        next(err);
      }
      setTimeout(function(){
        dbControl.query("select * from problem where no = ?",no,function(err,rows,field){
          if(err){
            // next(err);
          }
          if(!rows[0]){
            // next(new Error("Wrong access"));
          }
          var timelimit = rows[0]['TIMELIMIT'], memorylimit = rows[0]['MEMORYLIMIT'];
          dbControl.query("select NUMBER from scoring order by number DESC limit 1",function(err,rows,field){
            if(!err){
              var number = rows[0]['NUMBER'];
              console.log(number);
              var set_score = (sta) =>{
                dbControl.query('update scoring set status = ? where number = ?',[sta,number],function(err,rows,field){
                  if(err)next(err);
                  if(sta==2){
                    dbControl.query('update status set status = 2 where no = ? and id = ?',[no,user_id],function(err,rows,field){
                      if(err)next(err);
                    });
                  }
                });
              }
              fs.writeFile('C:/onlinejudge_source/'+number+'.cpp',req.body.code,'utf8',function(err){
                if(err) return;
                console.log('File Writing Complete');
                exec('g++ -o C:/onlinejudge_execute/'+number+'.exe C:/onlinejudge_source/'+number+'.cpp',function(err,stdout,stderr){
                  console.log('compile Log');
                  if(err){
                    console.log(err);
                    set_score(5);
                    console.log('compile Error');
                    return;
                  }
                  console.log(stdout);
                  console.log(stderr);
                  console.log('compile Complete');
                  try{
                    var set_num = 1;
                    for(;fs.existsSync('C:/onlinejudge_problemdata/'+no+'/'+set_num+'.in');set_num++){
                      var correct_answer = fs.readFileSync('C:/onlinejudge_problemdata/'+no+'/'+set_num+'.out');
                      var users_answer = execSync('C:\\onlinejudge_execute\\'+number+' < C:/onlinejudge_problemdata/'+ no +'/'+set_num+'.in'
                      ,{
                        encoding: 'utf8',
                        timeout: timelimit * 1000,  // msec
                        maxBuffer: 200*1024,
                        killSignal: 'SIGTERM',
                        cwd: null,
                        env: null
                      });
                      console.log(correct_answer);
                      correct_answer=correct_answer.toString();
                      correct_answer=correct_answer.replace(/[\t\v\f]/gi,' ');
                      users_answer=users_answer.replace(/[\t\v\f]/gi,' ');
                      if(users_answer.substring(users_answer.length-2)=='\r\n')
                        users_answer = users_answer.substring(0,users_answer.length-2);
                      if(correct_answer.substring(correct_answer.length-2)=='\r\n')
                        correct_answer = correct_answer.substring(0,correct_answer.length-2);
                      console.log(no,set_num,number);
                      console.log(correct_answer.length,correct_answer);
                      console.log(users_answer.length,users_answer);
                      if(correct_answer!=users_answer){
                        //실패
                        set_score(1);
                        console.log('failure');
                        return;
                      }
                    }
                    if(set_num==1){
                      //데이터셋 없음
                      set_score(-1);
                      console.log('no data');
                    }
                    else{
                      set_score(2);
                      console.log('correct');
                    }
                  }catch(e){
                    console.log(e);
                    if(e.signal=='SIGTERM'){
                      //TLE
                      set_score(3);
                      console.log('Time Limit Exeed');
                    }
                    else{
                      //Runtime Error??
                      set_score(4);
                      console.log('Runtime Error??');
                    }
                  }
                });
              });
            }
            else{
              // next(err);
            }
          });
        })
      },0);
      res.redirect('/status?from_problem=2&id='+req.session.user['ID']+'&no='+no);
    })
  })
  console.log(req.body.code);
  //res.send(req.body.code);
});

module.exports = router;
