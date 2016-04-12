var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* GET a user */
/* /api/user/xxx@xx.com */
module.exports.userReadOne=function(req,res){
  //console.log('in api user readone');
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
        //console.log(user);
        sendJSONresponse(res, 200, user);
      });
};

/* GET a user */
/* /api/user?email=xxx@xx.com */
module.exports.userList=function(req,res){
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
      function(err,user){
        if (err) {
          sendJSONResponse(res, 404, {
            "message": "this user is not existed"
          });
          return;
        }
        
        var birthday;
        if (req.body.birthday && req.body.birthday.length>0)
           user.birthday=new Date(req.body.birthday);
        if (req.body.name && req.body.name.replace(/ /g,'').length>0)
           user.name=req.body.name;
        if (req.body.gender && parseInt(req.body.gender)>=0)
           user.gender=req.body.gender;
        if (req.body.role && req.body.role.length>0)
            user.role=req.body.role;
        
        user.save(function(err,user){
          if (err) {
            console.log(err);
            sendJSONresponse(res, 404, {"message":"update this user is failed by db"});
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
module.exports.portraitUpload=function(req,res){console.log(req);
  var file = req.files.file;//uploadPath = path.normalize(cfg.data + '/uploads')
    //var file=req.file;
    console.log(file.name);
    console.log(file.type);
    console.log(__dirname);
    
  if (file.type.substr(0,5) !== 'image') {
    sendJSONresponse(res, 404,{"message":"only image file is accepted"});
  }
  if (file.size > 2*1024*1024) {
    sendJSONresponse(res, 404,{"message":"only image file of less than 2M size is accepted"});
  }
  sendJSONresponse(res, 200, {name:file.name,type:file.type,path:file.path});
};
