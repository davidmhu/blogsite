require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ueditor = require("ueditor");
var uglifyJs = require("uglify-js");
var fs = require('fs');
if (!fs.existsSync(process.env.UPLOAD_DIR)) fs.mkdirSync(process.env.UPLOAD_DIR);
if (!fs.existsSync(process.env.DATA_DIR)) fs.mkdirSync(process.env.DATA_DIR);

var session = require('express-session');
var passport = require('passport');

require('./api/models/db');
require('./api/config/passport');

var routes = require('./appServer/routes/index');
//var ueditorRoutes=require('./appServer/routes/ueditor');
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
    'appClient/home/home.controller.js',
    'appClient/blog/articleView.controller.js',
    'appClient/blog/articleEdit.controller.js',
    'appClient/userhome/userhome.controller.js',
    'appClient/userhome/register.controller.js',
    'appClient/userhome/login.controller.js',
    'appClient/userhome/userEdit.controller.js',
    'appClient/userhome/userList.controller.js',
    'appClient/userhome/passwordModal.controller.js',
    'appClient/userhome/picUploadModal.controller.js',
    'appClient/common/authentication.service.js',
    'appClient/common/blogsiteData.service.js',
    'appClient/common/navigation.directive.js',
    'appClient/common/comment.directive.js',
    'appClient/blog/commentEdit.directive.js',
    'appClient/common/ngThumb.directive.js',
    //'appClient/common/footerGeneric.directive.js',
    'appClient/common/navigation.controller.js',
    'appClient/common/comment.controller.js',
    'appClient/common/formatTime.filter.js',
    'appClient/blog/commentEdit.controller.js'
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
    extended: true
}));
app.use(cookieParser());
app.use(session({ secret: process.env.COOKIE_SECRET, resave:false,saveUninitialized:true,cookie: { maxAge: 900000}}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'appClient')));
app.use(express.static(path.join(__dirname, process.env.UPLOAD_DIR)));
app.use(express.static(path.join(__dirname, process.env.DATA_DIR)));

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

//app.use("/ueditor/",ueditorRoutes);
app.use("/ueditor/ue/", ueditor(path.join(__dirname, 'public'), function(req, res,next) {
    // ueditor 客户发起上传图片请求
    console.log(req.query);
    console.log(path.join(__dirname, 'public'));
    if (req.query.action === 'uploadimage') {console.log('in uploadimage');
        var foo = req.ueditor;
        var date = new Date();
        var imgname = req.ueditor.filename;

        var img_url = '/uploads';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/uploads';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
         console.log('config.json');
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/js/vendor/ueditor/nodejs/config.json');
    }
}));

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