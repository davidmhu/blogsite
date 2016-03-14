var express = require('express');
var router = express.Router();

var ctrlUser=require('../controllers/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/api/user/new',ctrlUser.userCreate);
module.exports = router;
