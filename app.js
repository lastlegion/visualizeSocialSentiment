var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var debug = require('debug')('webapp');
var routes = require('./routes/index');
var users = require('./routes/users');

var Twitter = require("node-tweet-stream");
var sentiyapa = require("sentiyapa");
var twitterKeys = require("./twitter"); //Your twitter secret data

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);
console.log(twitterKeys.keys)
var t = new Twitter(twitterKeys.keys);

var s = new sentiyapa.Sentiyapa();
s.init();

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
  t.track("modi");
  console.log("Running");

  console.log(sentiyapa)
  io.on("connection", function (socket){
        console.log("new connection")
      t.on("tweet", function(tweet){
        
        //console.log(tweet)
        //console.log(tweet.text);
        
        var tweetText = tweet.text;
        var score = s.score(tweetText);
        console.log(tweetText+ " "+s.score(tweetText));
        socket.emit("tweet", {tweet: tweetText, score:score})
      });
  });

});


var io = require("socket.io")(server);
