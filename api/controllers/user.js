var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};
/* POST a new user */
/* /api/user/ */
module.exports.userCreate = function(req, res) {
  console.log(req.body);
  User.create({
  	email:req.body.email,
  	name:req.body.name,
  	password:req.body.password,
    gender:req.body.gender
  }, function(err, user) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(user);
      sendJSONresponse(res, 201, user);
    }
  });
  
  };
