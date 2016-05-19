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
  var blogid=req.params.blogid;
  if (!blogid){
    sendJSONresponse(res, 400, {
      "message": "invalid blog"
    });
    return;
  }
  var authAccount = getAuthAccount(req.headers);
  if (!authAccount.email ) {
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
    content:commentStr,
    blogitem_id:blogid
  };

  if (req.body.parentId===0){
  	Comment.create(comment, function(err, comment) {
	    if (err) {
	      console.log(err);
	      sendJSONresponse(res, 400, err);
	    } else {
	      //console.log(blog);
	      sendJSONresponse(res, 201, comment);
	    }
	  });
  }else{//this is a reply
  	console.log('the reply');console.log(req.body.parentId);
  	Comment.findOne({_id:req.body.parentId})
  	.exec(function(err, parentComment) {
		if (!parentComment) {
	        sendJSONresponse(res, 404, {
	          "message": "parent comment not found"
	        });
	        return;
	      } else if (err) {
	        console.log(err);
	        sendJSONresponse(res, 404, err);
	        return;
	      }
	      comment.depth=parentComment.depth+1;
	      comment.path=(parentComment.path?parentComment.path+':':'')+req.body.parentId;
	      Comment.create(comment, function(err, comment) {
		    if (err) {
		      console.log(err);
		      sendJSONresponse(res, 400, err);
		    } else {
		      console.log(comment);
		      sendJSONresponse(res, 201, comment);
		    }
		  });
	    });
  }
   
};

/* delete a comment
delete '/comment/:id',auth */
module.exports.delete= function(req, res) {
//need to add authorization,only by comment user ,blog's owner and admin users.
//need to delete all its child comments.
  var id = req.params.id;
  if (!id){
    sendJSONresponse(res, 400, {
      "message": "invalid comment id"
    });
    return;
  }
  Comment.remove({_id:id})
    .exec(function(err, comment) {
      if (!comment) {
        sendJSONresponse(res, 404, {
          "message": "comments not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      //console.log(blog);
      sendJSONresponse(res, 200, comment);
    });

};

/* get a comment by id
get '/comment/:id' */
module.exports.readById= function(req, res) {
	var id = req.params.id;
	if (!id){
    sendJSONresponse(res, 400, {
      "message": "invalid comment id"
    });
    return;
  }
  Comment.findOne({_id:id})
    .exec(function(err, comment) {
      if (!comment) {
        sendJSONresponse(res, 404, {
          "message": "comments not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      sendJSONresponse(res, 200, comment);
    });
};

/* get a comment by blogid
get '/comment/blog/:blogid' */
module.exports.readByBlogId= function(req, res) {
  var blogid=req.params.blogid;
  if (!blogid){
    sendJSONresponse(res, 400, {
      "message": "invalid blog"
    });
    return;
  }
  Comment.find({blogitem_id:blogid})
  	.sort('-createdOn')
    .exec(function(err, commentList) {
      if (!commentList && commentList.length) {
        sendJSONresponse(res, 404, {
          "message": "comments not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      //console.log(blog);
      sendJSONresponse(res, 200, commentList);
    });
};

/* get a comment by user email
get '/comment/user/:email' */
module.exports.readByUser= function(req, res) {
  var email=req.params.email;
  if (!email){
    sendJSONresponse(res, 400, {
      "message": "invalid account"
    });
    return;
  }
  Comment.find({userEmail:email})
    .exec(function(err, commentList) {
      if (!commentList && commentList.length) {
        sendJSONresponse(res, 404, {
          "message": "comments not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      //console.log(blog);
      sendJSONresponse(res, 200, commentList);
    });
};

