var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
path = require('path');

//Config the app
var app = express();
app.use(express.static(__dirname + '/..'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

//Backend, use socket client on localhost port 3000
var http = require('http');
var server = http.createServer(app).listen(3000, function(){
  console.log("Express server listening on port 3000" );
   });
require('./routes/sockets_server_lines.js').initialize(server);

module.exports = app;

// frontend url: http://localhost:3000
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../index.html'));
});
