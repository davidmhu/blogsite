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
                //console.log(err);
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
        sendJSONresponse(res, 400, {
            "message": "Not found, user email is required"
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
                        //console.log(err);
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

/*check if an email account exists
get /api/user/emailcheck/:email*/
module.exports.checkEmail = function(req, res) {
    if (!req.params.email) {
        sendJSONresponse(res, 400, {
            "message": " email is requried"
        });
        return;
    }
    if (!req.params.email.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
        sendJSONresponse(res, 400, {
            "message": " wrong email format"
        });
        return;
    }

    User.findOne({
        email: req.params.email
    })
        .select('email -_id')
        .exec(
            function(err, data) {
                if (err) {
                    sendJSONresponse(res, 500, {
                        "message": "checking email failed by db"
                    });
                    return;
                }
                console.log(data);
                if (data) { //already exists
                    sendJSONresponse(res, 200, data);
                    return;
                } else { // not found , new email is valid
                    sendJSONresponse(res, 200, {});
                    return;
                }
            });
};

/*upload a portrait
post /api/user/uploads/:email*/
module.exports.portraitUpload = function(req, res) {
    var file = req.files.file; //console.log(req.files);//uploadPath = path.normalize(cfg.data + '/uploads')

    if (file.type.substr(0, 5) !== 'image') {
        sendJSONresponse(res, 400, {
            "message": "only image file is accepted"
        });
    }
    if (file.size > 2 * 1024 * 1024) {
        sendJSONresponse(res, 400, {
            "message": "only image file of less than 2M size is accepted"
        });
    }
    var userPortraitDir = process.env.DATA_DIR + '/user-portrait';
    if (!fs.existsSync(userPortraitDir)) fs.mkdirSync(userPortraitDir);
    file.path = file.path.replace(process.env.UPLOAD_DIR + '\\', '');
    file.path = file.path.replace(process.env.UPLOAD_DIR + '\/', '');

    sendJSONresponse(res, 200, {
        path: file.path
    });
};

/*change a user's portrait
post /api/user/portrait/:email*/
module.exports.changePortrait = function(req, res) {
    var isFile = false;

    if (!req.params.email || !req.params.email.length || !req.body.filename) {
        sendJSONresponse(res, 400, {
            "message": "Not found, user email and filename are both required"
        });
        return;
    }

    console.log(process.env.UPLOAD_DIR + '/' + req.body.filename);
    try {
        isFile = fs.statSync(process.env.UPLOAD_DIR + '/' + req.body.filename).isFile();

    } catch (e) {
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
                var filename = req.body.filename;
                var newfilename = Date.now() + filename.substring(filename.lastIndexOf('.'));
                var filepath = process.env.DATA_DIR + '/user-portrait/' + newfilename;
                //console.log('newfilename:'+newfilename);console.log('oldfilename:'+process.env.UPLOAD_DIR + '/' + filename);
                try {
                    fs.renameSync(process.env.UPLOAD_DIR + '/' + filename, filepath);
                } catch (e) {
                    sendJSONresponse(res, 500, {
                        "message": "server error: Image File Not Copied"
                    });
                }

                user.portrait = '/user-portrait/' + newfilename;
                user.save(function(err, user) {
                    if (err) {
                        sendJSONresponse(res, 500, {
                            "message": "update user's portrait failed by db"
                        });
                    } else {
                        //console.log(user);
                        sendJSONresponse(res, 200, {
                            portrait: user.portrait
                        });
                    }
                });
            });
};

/*get /user/list/
set fuzzyname or fuzzyemail to true, if want to inplement fuzzy search
*/
module.exports.getUserByPage = function(req, res) {
    var page, pagesize, rowcnt;
    if (req.body.page) {
        if (!/^[0-9]+$/.test(req.body.page)) {
            sendJSONresponse(res, 400, {
                "message": " wrong page format:must be a positive integar"
            });
            return;
        }
    }
    if (req.body.pagesize) {
        if (!/^[0-9]+$/.test(req.body.pagesize)) {
            sendJSONresponse(res, 400, {
                "message": " wrong pagesize format:must be a positive integar"
            });
            return;
        }
    }
    page = parseInt(req.body.page) || 1;
    pagesize = parseInt(req.body.pagesize) || 10;

    var queryCond = req.body.queryCond || {};console.log(queryCond);
    if (queryCond.fuzzyname && queryCond.name) {
        queryCond.name=new RegExp(queryCond.name);
        
    }
    if (queryCond.fuzzyemail && queryCond.email) {
        queryCond.email=new RegExp(queryCond.email);
        
    }
    queryCond.fuzzyname=undefined;
    queryCond.fuzzyemail=undefined;
    console.log(queryCond);//console.log(page);console.log(pagesize);

    var sortCond={createdOn:-1};
    console.log(sortCond);

    User.count(queryCond)
        .exec(
            function(err, data) {
                if (err) {
                    sendJSONresponse(res, 500, {
                        "message": "Query user list count failed by db"
                    });
                    return;
                }
                if (!data || parseInt(data) < 0) {
                    rowcnt = 0;
                    sendJSONresponse(res, 200, []);
                    return;
                }
                rowcnt = parseInt(data);
                console.log('rowcount=' + rowcnt);

                if (rowcnt && rowcnt >= (page-1) * pagesize) {
                    User.find(queryCond).sort(sortCond)
                        .skip(pagesize * (page - 1)).limit(pagesize)
                        .select('-_id -salt -hash')
                        .exec(
                            function(err, data) {
                                if (err) {
                                    sendJSONresponse(res, 500, {
                                        "message": "Query user failed by db"
                                    });
                                    return;
                                }
                                var result={rowcnt:rowcnt,userlist:data};
                                sendJSONresponse(res, 200, result);
                                return;
                                
                            });
                }
                else {
                    sendJSONresponse(res, 404, {"message": "Invalid page or result"});
                                return;
                }
            });
};