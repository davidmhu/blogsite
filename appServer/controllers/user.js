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

module.exports.register = function(req, res){
  var requestOptions, path,postdata;
  //need to add validation here
  postdata = {
    name: req.body.name,
    email:req.body.email,
    password:req.body.password,
    gender:parseInt(req.body.gender, 10),
    year: req.body.year,
    month:req.body.month,
    day:req.body.day
  };

  path = "/api/user" ;
  requestOptions = {
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if (response.statusCode === 201) {        
        res.redirect('/blog');
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};