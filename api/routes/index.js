var express = require('express');
var router = express.Router();
var ctrlBlogitem=require('../controllers/blogItem');
var ctrlUser=require('../controllers/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'blogsite api' });
});

router.get('/user/:email',ctrlUser.userReadOne);
router.get('/user',ctrlUser.userList);
router.post('/user',ctrlUser.userCreate);

router.get('/blog/:blogid',ctrlBlogitem.blogDetail);
router.get('/blog',ctrlBlogitem.blogList);
router.post('/blog',ctrlBlogitem.blogCreate);
router.put('/blog/:blogid',ctrlBlogitem.blogEdit);
router.delete('/blog/:blogid',ctrlBlogitem.blogDelete);

/*router.get('/blog/:blogid/review',ctrlBlogitem.reviewList);
router.post('blog/:blogid/review',ctrlBlogitem.reviewCreate);
router.put('blog/:blogid/review/:reviewid',ctrlBlogitem.reviewEdit);
router.delete('blog/:blogid/review/:reviewid',ctrlBlogitem.reviewDelete);
*/
module.exports = router;
