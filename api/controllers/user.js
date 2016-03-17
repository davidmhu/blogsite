var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* GET a user */
/* /api/user/xxx@xx.com */
module.exports.userReadOne=function(req,res){
  //console.log(req.params);
  User.findOne(req.params)
      .exec(function(err,user){
        if (!user) {
          sendJSONresponse(res, 404, {
            "message": "User not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(user);
        sendJSONresponse(res, 200, user);
      });
}

/* GET a user */
/* /api/user?email=xxx@xx.com */
module.exports.userList=function(req,res){
  console.log(req.query.email);
  User.findOne({email:req.query.email})
      .exec(function(err,user){
        if (!user) {
          sendJSONresponse(res, 404, {
            "message": "User not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(user);
        sendJSONresponse(res, 200, user);
      });
}

/* POST a new user */
/* /api/user/ */
module.exports.userCreate = function(req, res) {
  //need to add validation here
  var birthday;
  if (req.body.birthday && req.body.birthday.length>0)
    birthday=new Date(req.body.birthday);
  var createDate=new Date();
  var role=[];role.push('author');//need to modify
  User.create({
  	email:req.body.email,
  	name:req.body.name,
  	password:req.body.password,
    gender:req.body.gender,
    birthday:birthday,
    createdOn:createDate,
    role:role
  }, function(err, user) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      sendJSONresponse(res, 201, user);
    }
  });
  
  };
