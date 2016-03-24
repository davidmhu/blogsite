var express = require('express');
var router = express.Router();
var ctrlBlogitem=require('../controllers/blogItem');
var ctrlUsers=require('../controllers/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/blog',ctrlBlogitem.blogList);
router.get('/blog/show/:blogid',ctrlBlogitem.blogDetail);
router.get('/blog/new',ctrlBlogitem.blogNew);
router.post('/blog',ctrlBlogitem.blogCreate);
router.get('/blog/:blogid',ctrlBlogitem.blogShowEdit);
router.post('/blog/edit/:blogid',ctrlBlogitem.blogEdit);
//router.delete('/blog/:blogid',ctrlBlogitem.blogDelete);

/* GET user's register. */
router.get('/register',function(req, res){
	res.render('register',{title:'Blogsite- register'});
});
router.post('/register', ctrlUsers.register);
router.get('/user/show/:email',ctrlUsers.userDetail);
router.get('/user/:email',ctrlUsers.userShowEdit);
router.post('/user/edit/:email',ctrlUsers.userEdit);
module.exports = router;
