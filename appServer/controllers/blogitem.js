var request = require('request');
var apiOptions = {
  server : "http://localhost:3100"//+process.env.PORT ;
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
  var requestOptions, path;
  path = "/api/blog/" ;
  requestOptions = {
    url : apiOptions.server + path ,
    method : "GET",
    json : {}
  };
  console.log(req.query.querystring);
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if (response.statusCode === 200) {console.log(data);        
        renderHomepage(req,res,data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};