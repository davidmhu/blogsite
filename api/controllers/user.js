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
  console.log(req.body);

  
  //if (!year||!month||!day) {
    sendJSONresponse(res, 400, {"message": "wrong birthday format"});
    return;
    //var birthday=new Date(year,month-1,day);
  
  var createDate=new Date();
  var role=[];role.push('author');
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
