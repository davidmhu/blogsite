var express = require('express');
var router = express.Router();
var ctrlBlogitem=require('../controllers/blogItem');
var ctrlUser=require('../controllers/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'sExpress' });
});

router.get('/user/:email',ctrlUser.userReadOne);
router.get('/user',ctrlUser.userList);
router.post('/user',ctrlUser.userCreate);

router.get('/blog/:email',ctrlBlogitem.blogByAuthor);
router.get('/blog',ctrlBlogitem.blogList);
router.post('/blog',ctrlBlogitem.blogCreate);


module.exports = router;
