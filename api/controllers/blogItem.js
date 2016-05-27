var mongoose = require('mongoose');
var BlogItem = mongoose.model('BlogItem');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var getAuthAccount = function(reqHeaders) {
  if (reqHeaders.hasOwnProperty('authorization') && reqHeaders.authorization) {
    var token = reqHeaders.authorization.replace(/Bearer /, '');
    var payloadstr = token.split('.')[1];
    payloadstr = new Buffer(payloadstr, 'base64').toString('utf8');
    var payload = JSON.parse(payloadstr);
    return (payload.email);
  } else {
    return "";
  }
};

/* GET a blog */
/* /api/blog/123*/
module.exports.blogDetail = function(req, res) {
  BlogItem.findById(req.params.blogid)
    .exec(function(err, blog) {
      if (!blog) {
        sendJSONresponse(res, 404, {
          "message": "Blog not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      //console.log(blog);
      sendJSONresponse(res, 200, blog);
    });
};

module.exports.blogList = function(req, res) {
  var queryCond = {};
  if (req.query.userEmail) {
    queryCond.userEmail = req.query.userEmail;
  }
  if (req.query.title) {
    queryCond.title = req.query.title;
  }

  if (!queryCond)
    console.log('no query condition');
  else
    console.log(queryCond);

  if (!queryCond.hasOwnProperty('public')){
    queryCond.public=1;
  } 
  
  BlogItem.find(queryCond)
    .sort('-createdOn')
    .exec(function(err, blogs) {
      if (!blogs) {
        sendJSONresponse(res, 404, {
          "message": "Blog not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      console.log('bloglist is successfully retrieved');
      sendJSONresponse(res, 200, blogs);
    });
};

/* POST a new blog */
/* /api/blog/ */
module.exports.blogCreate = function(req, res) {
  var authAccount = getAuthAccount(req.headers);
  if (!authAccount || !req.body.userEmail || authAccount !== req.body.userEmail) {
    sendJSONresponse(res, 400, {
      "message": "invalid user account"
    });
  }

  var category, createDate = new Date();
  if (req.body.category) {
    category = req.body.category.split('|');
    //console.log(category);
  }
  BlogItem.create({
    userEmail: req.body.userEmail,
    userName: req.body.userName,
    title: req.body.title,
    content: req.body.content,
    brief:req.body.brief,
    modifiedOn: createDate,
    category: category
  }, function(err, blog) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      //console.log(blog);
      sendJSONresponse(res, 201, blog);
    }
  });
};

/*PUT a existed blog
api/blog/:blogid*/
module.exports.blogEdit = function(req, res) {
  console.log('in api blog edit');
  if (!req.params.blogid) {
    sendJsonResponse(res, 404, {
      "message": "Not found, blogid is required"
    });
    return;
  }
  BlogItem.findById(req.params.blogid)
    .exec(
      function(err, blog) {
        if (err) {
          sendJsonResponse(res, 404, {
            "message": "this blog is not existed"
          });
          return;
        }
        blog.title = req.body.title;
        blog.content = req.body.content;
        blog.allowReview = req.body.allowReview;
        blog.modifiedOn = new Date();
        if (req.body.category) {
          var category = req.body.category.split('|');
          if (category.length) blog.category = category;
        }
        blog.save(function(err, blog) {
          if (err) {
            console.log(err);
            sendJSONresponse(res, 404, {
              "message": "update this blog is failed by db"
            });
          } else {
            //console.log(blog);
            sendJSONresponse(res, 200, blog);
          }
        });
      }
  );
};

/* DELETE a existed blog
api/blog/:blogid */
module.exports.blogDelete = function(req, res) {
  console.log('in blog delete');
  var blogid = req.params.blogid;
  if (blogid) {
    BlogItem.findByIdAndRemove(blogid)
      .exec(function(err, blog) {
        if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
        } else {
          //console.log(blog);
          sendJSONresponse(res, 204, blog);
        }
      });
  } else {
    sendJSONresponse(res, 204, {
      "message": "no blog id"
    });
  }

};