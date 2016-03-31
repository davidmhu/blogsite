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