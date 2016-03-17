var express = require('express');
var router = express.Router();
var ctrlBlogitem=require('../controllers/blogItem');
var ctrlUsers=require('../controllers/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/blog',ctrlBlogitem.blogList);

/* GET user's register. */
router.get('/register',function(req, res){
	res.render('register');
});
router.post('/register', ctrlUsers.register);

module.exports = router;
