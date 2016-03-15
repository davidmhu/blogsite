var express = require('express');
var router = express.Router();
var ctrlBlogitem=require('../controllers/blogItem');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/blog',ctrlBlogitem.blogList);
module.exports = router;
