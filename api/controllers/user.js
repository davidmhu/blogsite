var mongoose = require('mongoose');
var User = mongoose.model('User');
var fs = require('fs');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

/* GET a user */
/* /api/user/xxx@xx.com */
module.exports.userReadOne = function(req, res) {
    User.findOne(req.params)
        .select('-hash -salt -_id')
        .exec(function(err, user) {
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
            sendJSONresponse(res, 200, user);
        });
};

/* GET a user */
/* /api/user?email=xxx@xx.com */
module.exports.userList = function(req, res) {
    User.findOne({
        email: req.query.email
    })
        .select('-hash -salt -_id')
        .exec(function(err, user) {
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
            //console.log(user);
            sendJSONresponse(res, 200, user);
        });
};

/* modify a  user */
/* /api/user/:email */
module.exports.userEdit = function(req, res) {
    //need to add validation here
    //console.log(req.params.email);
    if (!req.params.email && !req.params.email.length) {
        sendJsonResponse(res, 404, {
            "message": "Not found, user email is required"
        });
        return;
    }
    User.findOne(req.params)
        .exec(
            function(err, user) {
                if (err) {
                    sendJSONResponse(res, 404, {
                        "message": "this user is not existed"
                    });
                    return;
                }

                var birthday;
                if (req.body.birthday && req.body.birthday.length > 0)
                    user.birthday = new Date(req.body.birthday);
                if (req.body.name && req.body.name.replace(/ /g, '').length > 0)
                    user.name = req.body.name;
                if (req.body.gender && parseInt(req.body.gender) >= 0)
                    user.gender = req.body.gender;
                if (req.body.role && req.body.role.length > 0)
                    user.role = req.body.role;

                user.save(function(err, user) {
                    if (err) {
                        console.log(err);
                        sendJSONresponse(res, 500, {
                            "message": "update this user failed by db"
                        });
                    } else {
                        //console.log(user);
                        sendJSONresponse(res, 200, user);
                    }
                });

            }
    );
};

/*upload a portrait
post /api/user/uploads/:email*/
module.exports.portraitUpload = function(req, res) {
    var file = req.files.file; //uploadPath = path.normalize(cfg.data + '/uploads')

    if (file.type.substr(0, 5) !== 'image') {
        sendJSONresponse(res, 404, {
            "message": "only image file is accepted"
        });
    }
    if (file.size > 2 * 1024 * 1024) {
        sendJSONresponse(res, 404, {
            "message": "only image file of less than 2M size is accepted"
        });
    }
    var userPortraitDir = process.env.DATA_DIR + '/user-portrait';
    if (!fs.existsSync(userPortraitDir)) fs.mkdirSync(userPortraitDir);
    file.path=file.path.replace(process.env.UPLOAD_DIR + '\\', '');
    file.path=file.path.replace(process.env.UPLOAD_DIR + '\/', '');
    
    //fs.renameSync(file.path,userPortraitDir+'/'+file.name);
    sendJSONresponse(res, 200, {
        path: file.path
    });
};

/*change a user's portrait
post /api/user/portrait/:email*/
module.exports.changePortrait = function(req, res) {
    var isFile=false;
  console.log(process.env.UPLOAD_DIR + '/' + req.body.filename);
    if (!req.params.email || !req.params.email.length || !req.body.filename) {
        sendJSONresponse(res, 404, {
            "message": "Not found, user email and filename are both required"
        });
        //return;
    }

    try{
          isFile=fs.statSync(process.env.UPLOAD_DIR + '/' + req.body.filename).isFile();

    }
    catch(e){
        sendJSONresponse(res, 404, {
            "message": "Image File Not found"
        });
        return;
    }

    User.findOne(req.params)
        .exec(
            function(err, user) {
                if (err) {
                    sendJSONresponse(res, 404, {
                        "message": "this user is not existed"
                    });
                    return;
                }
                var filename= req.body.filename;
                var newfilename =  Date.now()+filename.substring(filename.lastIndexOf('.'));
                var filepath = process.env.DATA_DIR + '/user-portrait/' + newfilename;
                //console.log('newfilename:'+newfilename);console.log('oldfilename:'+process.env.UPLOAD_DIR + '/' + filename);
                try{
                  fs.renameSync(process.env.UPLOAD_DIR + '/' + filename, filepath);
                }catch(e){
                  sendJSONresponse(res, 500, {
                      "message": "server error: Image File Not Copied"
                  });
                }

                user.portrait='/user-portrait/' + newfilename;
                user.save(function(err, user) {
                    if (err) {
                        sendJSONresponse(res, 500, {
                            "message": "update user's portrait failed by db"
                        });
                    } else {
                        //console.log(user);
                        sendJSONresponse(res, 200, {portrait:user.portrait});
                    }
                });
            });
    
};