var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});
var ctrlBlogitem = require('../controllers/blogItem');
var ctrlUser = require('../controllers/user');
var ctrlAuth = require('../controllers/authentication');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'blogsite api'
    });
});

router.get('/user/:email', ctrlUser.userReadOne);
router.get('/user', ctrlUser.userList);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
//router.post('/user', ctrlUser.userCreate);
router.put('/user/:email',auth, ctrlUser.userEdit);

router.get('/blog/:blogid', ctrlBlogitem.blogDetail);
router.get('/blog', ctrlBlogitem.blogList);
router.post('/blog', auth, ctrlBlogitem.blogCreate);
router.put('/blog/:blogid', auth, ctrlBlogitem.blogEdit);
router.delete('/blog/:blogid', auth, ctrlBlogitem.blogDelete);

/*router.get('/blog/:blogid/review',ctrlBlogitem.reviewList);
router.post('blog/:blogid/review',ctrlBlogitem.reviewCreate);
router.put('blog/:blogid/review/:reviewid',ctrlBlogitem.reviewEdit);
router.delete('blog/:blogid/review/:reviewid',ctrlBlogitem.reviewDelete);
*/
module.exports = router;