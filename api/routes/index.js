var express = require('express');
var router = express.Router();
var ctrlUser=require('../controllers/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'sExpress' });
});

router.post('/user',ctrlUser.userCreate);
module.exports = router;
