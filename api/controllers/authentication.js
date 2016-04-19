var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function(req, res) {
    //need to add validation here
    var birthday, user = new User();
    if (req.body.birthday && req.body.birthday.length > 0)
        user.birthday = new Date(req.body.birthday);
    var createDate = new Date();
    if (req.body.role && req.body.role.length)
        user.role = req.body.role; //need to modify
    user.setPassword(req.body.password);
    user.email = req.body.email;
    user.name = req.body.name;
    user.gender = req.body.gender;
    user.createdOn = createDate;

    user.save(function(err, user) {
        var token;
        if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
        } else {
            token = user.generateJwt();
            var userinfo = {
                'email': user.email,
                'name': user.name,
                'gender': user.gender
            };
            sendJSONresponse(res, 200, {
                "token": token,
                "userInfo": userinfo
            });
        }
    });
};

module.exports.login = function(req, res) {
    if (!req.body.email || !req.body.password) {

        sendJSONresponse(res, 400, {
            "message": "Email and password are both required"
        });
        return;
    }
    passport.authenticate('local', function(err, user, info) {
        var token;
        if (err) {
            sendJSONresponse(res, 404, err);
            return;
        }
        if (user) {
            token = user.generateJwt();
            var userinfo = {
                'email': user.email,
                'name': user.name,
                'gender': user.gender
            };
            sendJSONresponse(res, 200, {
                "token": token,
                "userInfo": userinfo
            });
        } else {
            sendJSONresponse(res, 401, info);
        }
    })(req, res);
};

/* change a user's password */
/* /api/user/changepwd/:email */
module.exports.changePwd = function(req, res) {
  //need to add validation here
  console.log(req.params.email);
  if (!req.params.email && !req.params.email.length) {
    sendJSONresponse(res, 404, {
      "message": "Not found, user email is required"
    });
    return;
  }
  if (!req.body.oldpassword || !req.body.newpassword) {
    sendJSONresponse(res, 404, {
      "message": "Old password or new password should not be empty."
    });
    return;
  }
  
  var type1=typeof(req.body.oldpassword);
  var type2=typeof(req.body.newpassword);

  if (type1 !=="string" || type2 !== "string") {
    sendJSONresponse(res, 404, {
      "message": "Old password or new password should  be string."
    });
    return;
}

  User.findOne(req.params)
    .exec(
      function(err,user){
        if (err) {
          sendJSONresponse(res, 404, {
            "message": "this user is not existed"
          });
          return;
        }
        if (user){
            if (user.validPassword(req.body.oldpassword)) {
                user.setPassword(req.body.newpassword);
                user.save(function(err,user){
                  if (err) {
                    sendJSONresponse(res, 404, {"message":"updating user's password is failed by db"});
                  } else {
                    token = user.generateJwt();
                    sendJSONresponse(res, 200, token);
                  }
                });
            }else{
                sendJSONresponse(res, 404, {
                    "message": "wrong old password"
                  });
                return;
            }
        }else{
            sendJSONresponse(res, 404, {
                "message": "found invalid user"
              });
        }
      }
    );
};