require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uglifyJs = require("uglify-js");
var fs = require('fs');

var session = require('express-session');
var passport = require('passport');

require('./api/models/db');
require('./api/config/passport');

var routes = require('./appServer/routes/index');
//var users = require('./appServer/routes/users');
var apiRoutes = require('./api/routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'appServer', 'views'));
app.set('view engine', 'jade');
//app.set('view engine', 'html');
//app.set('view engine', 'ejs');
//app.engine('html',require('ejs').renderFile);

var appClientFiles = [
    'appClient/blogsiteApp.js',
    'appClient/userhome/userhome.controller.js',
    'appClient/userhome/register.controller.js',
    'appClient/userhome/login.controller.js',
    'appClient/common/authentication.service.js',
    'appClient/common/blogsiteData.service.js'
    ];
var uglified = uglifyJs.minify(appClientFiles, { compress : false });
fs.writeFile('public/js/blogsite.min.js', uglified.code, function (err){
  if(err) {
     console.log(err);
  } else {
    console.log('Script generated and saved: blogsite.min.js');
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({ secret: process.env.COOKIE_SECRET, resave:false,saveUninitialized:true,cookie: { maxAge: 900000}}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'appClient')));

app.use(passport.initialize());
app.use(passport.session());

//set tests environment
app.use(function(req, res, next) {
    res.locals.showTests = process.env.NODE_ENV !== 'production' &&
        req.query.test === '1';
    next();
});

// routes
app.use('/', routes);
//app.use('/users', users);
app.use('/api', apiRoutes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Page Not Found');
    err.status = 404;
    res.render('404', {
        message: err.message,
        error: err
    });
    //next(err);
});

// error handlers
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.render('generic-text', {
            "message": err.message,
            error: err
        });
    }
});

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


module.exports = app;