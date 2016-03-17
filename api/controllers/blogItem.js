var mongoose = require('mongoose');
var BlogItem = mongoose.model('BlogItem');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};


/* GET a blog */
/* /api/blog?email=xxx@xx.com */
module.exports.blogByAuthor=function(req,res){
  console.log(req.query.email);
  BlogItem.findOne({email:req.query.email})
      .exec(function(err,blog){
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
        console.log(blog);
        sendJSONresponse(res, 200, blog);
      });
}

module.exports.blogList = function(req,res){
  var queryCond={};console.log(req.body.userEmail);
  if(req.body.userEmail){
    
    queryCond.userEmail=req.body.userEmail; 
  }
  if(req.body.title){
    
    queryCond.title=req.body.title; 
  }

  if(!queryCond)  
    console.log('no query condition');
  else
    console.log(queryCond);

  BlogItem.find(queryCond)
    .exec(function(err,blogs){
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
    })
}
/* POST a new blog */
/* /api/blog/ */
module.exports.blogCreate = function(req, res) {
  console.log(req.body);

  var createDate=new Date();
  var category=[];category.push('travel');category.push('tech');
  BlogItem.create({
  	userEmail:req.body.userEmail,
  	userName:req.body.userName,
  	title:req.body.title,
    content:req.body.content,
    createdOn:createDate,
    category:category
  }, function(err, blog) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(blog);
      sendJSONresponse(res, 201, blog);
    }
  });
  
  };
