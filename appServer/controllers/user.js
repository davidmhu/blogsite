var request = require('request');
var apiOptions = {
  server : "http://localhost:"+process.env.PORT
};
console.log(apiOptions.server);
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://blogsite.com";//need to modify
}

var _showError = function (req, res, err) {
  if (!err.status) err.status=500;
  if (err.status === 404) {
      err.title="ErrorCode:404, Page not found";
  } else if(err.status === 500) {
      err.title = "ErrorCode:500, internal server error";
  } else {
      err.title = "ErrorCode:"+err.status + ", something's gone wrong";
  }
  if (!err.message) err.message='unknow Error';
  err.prevUrl='';
  console.log(err);
  res.status(err.status);
  res.render('generic-text', {err:err});
};

/*post create a user
/user */
module.exports.register = function(req, res){
  var requestOptions, path,postdata;
  //need to add validation here
  postdata = {
    name: req.body.name,
    email:req.body.email,
    password:req.body.password,
    gender:parseInt(req.body.gender, 10),
    birthday:req.body.birthday
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
        res.render('user-detail',{user:data});//need to be modifed to go to previous viewing page
      } else {
        _showError(req, res, response.statusCode,data.message);
      }
    }
  );
};

/* get a user 56f0e8be3381a5600f9cc187
/user/show/:email */
module.exports.userDetail = function(req,res){
  var email=req.params.email,
      returnErr={},requestOptions, path;
  if (!email){
    returnErr.status=404;
    returnErr.message='not valid user email';
    _showError(req, res, returnErr);
    return;
  }
  
  path = "/api/user/"+req.params.email ;
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
        res.render('user-detail',{user:data,title:'user information'});
      } else {
        var returnErr={};
        if (response.statusCode) {
          returnErr.status=response.statusCode;
         } else {
          returnErr.status=500;
         }
         returnErr.message='search a user information in db failed';
        _showError(req, res, returnErr);
      }
    }
  );

  
};