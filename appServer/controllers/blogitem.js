var request = require('request');
var apiOptions = {
  server : "http://localhost:"+process.env.PORT 
};
console.log(apiOptions.server);
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://blogsite.com";//need to modify
}

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    res.render('404', {
      message: "Page not found",
      error:"Cannot find blogs"
    });
  } else if (status === 500) {
    title = "500, internal server error";
    content = "How embarrassing. There's a problem with our server.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};

var renderHomepage = function(req, res, responseBody){ 
	res.render('blog-list', { 
		blogs: responseBody 
	});
};

module.exports.blogList = function(req, res){
  var requestOptions, path,subQueryPath;
  subQueryPath=''
  path = "/api/blog/" ;
  
  if(req.query.userEmail){
    subQueryPath+='?userEmail='+req.query.userEmail+'&'
    //queryData.userEmail=req.query.userEmail; 
  }
  if(req.query.title){
    subQueryPath+='?title='+req.query.title+'&'
    //queryData.title=req.query.title; 
  }
  if (subQueryPath){
    subQueryPath=subQueryPath.substring(0,subQueryPath.length-1);
    path+=subQueryPath;console.log(path);
  } 

  requestOptions = {
    url : apiOptions.server + path ,
    method : "GET",
    json : {}
  };
  
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if (response.statusCode === 200) {        
        renderHomepage(req,res,data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

var renderDetailpage = function(req, res, responseBody){ 
  res.render('blog-detail', { 
    blog: responseBody 
  });
};

module.exports.blogDetail = function(req,res){
  var requestOptions, path;
  path = "/api/blog/"+req.params.blogid ;
  console.log(path);
  requestOptions = {
    url : apiOptions.server + path ,
    method : "GET",
    json : {}
  };
  
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if (response.statusCode === 200) {        
        renderDetailpage(req,res,data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
}