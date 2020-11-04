var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
// var FileStore = require('session-file-store')(session);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dbControl = require('./db-control');

var testRouter = require('./routes/test');
var indexRouter = require('./routes/index');
var manageRouter = require('./routes/manage');
var removeRouter = require('./routes/remove');
var signinRouter = require('./routes/signin');
var signupRouter = require('./routes/signup');
var statusRouter = require('./routes/status');
var submitRouter = require('./routes/submit');
var problemRouter = require('./routes/problem');
var rankingRouter = require('./routes/ranking');
var signoutRouter = require('./routes/signout');
var problemsetRouter = require('./routes/problemset');

const port = 3000;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // store : New FileStore()
}));

dbControl.connect();

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/test', testRouter);
app.use('/manage', manageRouter);
app.use('/remove', removeRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/status', statusRouter);
app.use('/submit', submitRouter);
app.use('/problem', problemRouter);
app.use('/ranking', rankingRouter);
app.use('/signout', signoutRouter);
app.use('/problemset', problemsetRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    session: req.session.user
  });
});
app.listen(port, function() {
  console.log("Server Running on PORT:" + port)
});
module.exports = app;
