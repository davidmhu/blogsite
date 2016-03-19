var express = require('express');
var router = express.Router();
var ctrlUsers=require('../controllers/user');
/* GET users listing. */
router.get('/register',function(req, res){
	res.render('register');
});
router.post('/register', ctrlUsers.register);

module.exports = router;
