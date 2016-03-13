var mongoose = require('mongoose');
var User = mongoose.model('User');

/* POST a new location */
/* /api/locations */
module.exports.locationsCreate = function(req, res) {
  console.log(req.body);
  User.create({
  	email:req.body.email,
  	name:req.body.name,
  	password:req.body.password,
  	role.push('admin')
  }, function(err, user) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(location);
      sendJSONresponse(res, 201, user);
    }
});
