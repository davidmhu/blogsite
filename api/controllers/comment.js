var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

var getAuthAccount=function(reqHeaders){
    if (reqHeaders.hasOwnProperty('authorization') && reqHeaders.authorization) {
        var token=reqHeaders.authorization.replace(/Bearer /,'');
        var payloadstr=token.split('.')[1];
        payloadstr=new Buffer(payloadstr, 'base64').toString('utf8');
        var payload=JSON.parse(payloadstr);
        payload.name=new Buffer(payload.name, 'base64').toString('utf8');
        return(payload);
    }else {
        return "";
    }
};

/* create a comment
post '/comment/:blogid',auth */
module.exports.create= function(req, res) {
  var authAccount = getAuthAccount(req.headers);
  if (!authAccount.email || !req.body.userEmail || authAccount.email !== req.body.userEmail) {
    sendJSONresponse(res, 400, {
      "message": "invalid user account"
    });
    return;
  }
  if (!req.body.comment|| !req.body.comment.replace(/(^\s*)|(\s*$)/g, "") || req.body.comment.length>255) {
    sendJSONresponse(res, 400, {
      "message": "invalid comment length"
    });
    return;
  }
  var commentStr=req.body.comment.replace(/(^\s*)|(\s*$)/g, "");
  var comment={
    userEmail:authAccount.email,
    userName:authAccount.name,
    comment:commentStr,
    blogitem_id:req.params.blogid
  };console.log('before create');
  Comment.create(comment, function(err, comment) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      //console.log(blog);
      sendJSONresponse(res, 201, comment);
    }
  });
};

/* delete a comment
delete '/comment/:id',auth */
module.exports.delete= function(req, res) {

};

/* get a comment by id
get '/comment/:id' */
module.exports.readById= function(req, res) {

};

/* get a comment by blogid
get '/comment/blog/:blogid' */
module.exports.readByBlogId= function(req, res) {

};

/* get a comment by user email
get '/comment/user/:email' */
module.exports.readByUser= function(req, res) {

};

