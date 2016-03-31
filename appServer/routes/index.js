var express = require('express');
var router = express.Router();
var ctrlBlogitem = require('../controllers/blogItem');
var ctrlUsers = require('../controllers/user');
var authFunc = require('../common/authorize');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.cookies.token) {
        var token=req.cookies.token;
        var strPayload = new Buffer((token.split('.')[1]),'base64').toString('utf8');
        var payload = JSON.parse(strPayload);
        console.log(payload.email+' '+payload.name);
    }
    res.render('index', {
        title: 'Express',
        ngController:'IndexCtrl',
        userInfo:req.session.userInfo
    });
});

router.get('/blog', ctrlBlogitem.blogList);
router.get('/blog/show/:blogid', ctrlBlogitem.blogDetail);
router.get('/blog/new', ctrlBlogitem.blogNew);
router.post('/blog', ctrlBlogitem.blogCreate);
router.get('/blog/:blogid', ctrlBlogitem.blogShowEdit);
router.post('/blog/edit/:blogid', ctrlBlogitem.blogEdit);
//router.delete('/blog/:blogid',ctrlBlogitem.blogDelete);

/* GET user's register. */
router.get('/register', function(req, res) {
    res.render('register', {
        title: 'Blogsite- register',
        ngController:'RegisterCtrl'
    });/**/
});
router.get('/login',function (req,res,next) {
	res.render('login',{
		title:'Login',
		ngController:'LoginCtrl'
	});
});
router.post('/login',ctrlUsers.login);
router.post('/register', ctrlUsers.register);
router.get('/logout',function(req,res){
    res.clearCookie('token');req.session.userInfo={};
    res.redirect('/');
});

router.all('/user*',authFunc.ifLoggedIn);
router.get('/user/show/:email', ctrlUsers.userDetail);
router.get('/user/:email', ctrlUsers.userShowEdit);
router.post('/user/edit/:email', ctrlUsers.userEdit);
module.exports = router;