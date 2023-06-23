var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const admin = require("firebase-admin");
var serviceAccount = require('./config/config.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var profileRouter = require('./routes/auth/profile');
var registerRouter = require('./routes/auth/register');
var receiptRouter = require('./routes/receipt');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth/profile', profileRouter);
app.use('/auth/register', registerRouter);
app.use('/receipt', receiptRouter);

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
  res.render('error');
});

module.exports = app;
