var request = require('request');
var commonFunc = require('../common/common');
var apiOptions = {
    server: "http://localhost:" + process.env.PORT
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://blogsite.com"; //need to modify
 }


/*post create a user
/register */
module.exports.register = function(req, res) {
    var requestOptions, path, postdata;
    //need to add validation here
    postdata = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        gender: parseInt(req.body.gender, 10),
        birthday: req.body.birthday
    };
    path = "/api/register";
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postdata
    };
    res.clearCookie('token'); //need to modify
    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                res.cookie('token', data.token, {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true
                });

                res.render('user-detail', {
                    user: data.user
                }); //need to be modifed to go to previous viewing page
            } else {
                var returnErr = {};
                if (response.statusCode) {
                    returnErr.status = response.statusCode;
                } else {
                    returnErr.status = 500;
                }
                returnErr.message = data.message;
                commonFunc.showError(req, res, returnErr);
            }
        }
    );
};

/*post user login
/login */
module.exports.login = function(req, res) {
    var requestOptions, path, postdata;
    //need to add validation here
    postdata = {
        email: req.body.email,
        password: req.body.password,
    };
    path = "/api/login";
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postdata
    };
    res.clearCookie('token'); //need to modify
    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                res.cookie('token', data.token, {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true
                });

                res.render('user-detail', {
                    user: data.user
                }); //need to be modifed to go to previous viewing page
            } else {
                console.log(data);
                var returnErr = {};
                if (response.statusCode) {
                    returnErr.status = response.statusCode;
                } else {
                    returnErr.status = 500;
                }
                returnErr.message = data.message;
                commonFunc.showError(req, res, returnErr);
            }
        }
    );
};

/* get a user 
/user/show/:email */
module.exports.userDetail = function(req, res) {console.log(req.payload.email);
    var email = req.params.email,
        returnErr = {},
        requestOptions, path;
    if (!email) {
        returnErr.status = 404;
        returnErr.message = 'not valid user email';
        commonFunc.showError(req, res, returnErr);
        return;
    }

    path = "/api/user/" + req.params.email;
    requestOptions = {
        url: apiOptions.server + path,
        method: "get",
        json: {}
    };

    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                res.render('user-detail', {
                    user: data,
                    title: 'user information'
                });
            } else {
                var returnErr = {};
                if (response.statusCode) {
                    returnErr.status = response.statusCode;
                } else {
                    returnErr.status = 500;
                }
                returnErr.message = 'search a user information in db failed';
                commonFunc.showError(req, res, returnErr);
            }
        }
    );
};

/* get a user edit page 
/user/edit/:email */
module.exports.userShowEdit = function(req, res) {

    var email = req.params.email,
        postdata = {},
        returnErr = {},
        requestOptions, path;
    if (!email) {
        returnErr.status = 404;
        returnErr.message = 'not valid user email';
        commonFunc.showError(req, res, returnErr);
        return;
    }

    path = "/api/user/" + req.params.email;
    requestOptions = {
        url: apiOptions.server + path,
        method: "get",
        json: {}
    };



    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                res.render('user-edit', {
                    user: data,
                    title: 'user-edit'
                });
            } else {
                var returnErr = {};
                if (response.statusCode) {
                    returnErr.status = response.statusCode;
                } else {
                    returnErr.status = 500;
                }
                returnErr.message = 'search a user information in db failed';
                commonFunc.showError(req, res, returnErr);
            }
        }
    );

};

/* update a user 
/user/:email */
module.exports.userEdit = function(req, res) {
    var email = req.params.email,
        postdata = {},
        returnErr = {},
        requestOptions, path;
    if (!email) {
        returnErr.status = 404;
        returnErr.message = 'not valid user email';
        commonFunc.showError(req, res, returnErr);
        return;
    }
    postdata = req.body;
    console.log(req.cookies.token);
    path = "/api/user/" + req.params.email;
    requestOptions = {
        url: apiOptions.server + path,
        method: "put",
        json: postdata,
        headers: {
            Authorization: 'Bearer ' + req.cookies.token
        }
    };

    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                res.redirect('../show/' + data.email);
            } else {
                var returnErr = {};
                if (response.statusCode) {
                    returnErr.status = response.statusCode;
                } else {
                    returnErr.status = 500;
                }
                returnErr.message = 'search a user information in db failed';
                commonFunc.showError(req, res, returnErr);
            }
        }
    );


};