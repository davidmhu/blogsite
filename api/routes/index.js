var express = require('express');
var router = express.Router();

var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({uploadDir:process.env.UPLOAD_DIR});

var ctrlBlogitem = require('../controllers/blogItem');
var ctrlUser = require('../controllers/user');
var ctrlAuth = require('../controllers/authentication');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'blogsite api'
    });
});

router.get('/user/:email', auth,ctrlUser.userReadOne);
router.get('/user', ctrlUser.userList);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.put('/user/:email', auth, ctrlUser.userEdit);
router.post('/user/changepwd/:email',auth,ctrlAuth.changePwd);
router.post('/user/uploads', multipartyMiddleware,ctrlUser.portraitUpload);//need to add auth
router.post('/user/portrait/:email',auth,ctrlUser.changePortrait);//need to add auth


router.get('/blog/:blogid', ctrlBlogitem.blogDetail);
router.get('/blog', ctrlBlogitem.blogList);
router.post('/blog', auth, ctrlBlogitem.blogCreate);
router.put('/blog/:blogid', auth, ctrlBlogitem.blogEdit);
router.delete('/blog/:blogid', auth, ctrlBlogitem.blogDelete);

module.exports = router;