//'use strict';

var request = require('request');
var commonFunc = require('../common/common');
var apiOptions = {
    server: "http://localhost:" + process.env.PORT
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://blogsite.com"; //need to modify
}

var renderHomepage = function(req, res, responseBody) {
    for (var i = 0; i < responseBody.length; i++) {
        if (responseBody[i].content && responseBody[i].content.length > 201)
            responseBody[i].content = responseBody[i].content.substring(0, 200) + '  ...more';
    }
    res.render('blog-list', {
        blogs: responseBody,
        title: 'Blogsite- blog list',
        userInfo: req.session.userInfo
    });
};

module.exports.blogList = function(req, res) {
    var requestOptions,
        subQueryPath = '',
        path = "/api/blog/";

    if (req.query.userEmail) {
        subQueryPath += '?userEmail=' + req.query.userEmail + '&';
        //queryData.userEmail=req.query.userEmail; 
    }
    if (req.query.title) {
        subQueryPath += '?title=' + req.query.title + '&';
        //queryData.title=req.query.title; 
    }
    if (subQueryPath) {
        subQueryPath = subQueryPath.substring(0, subQueryPath.length - 1);
        path += subQueryPath;
        console.log(path);
    }

    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };

    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                renderHomepage(req, res, data);
            } else {
                var returnErr = {};
                if (response.statusCode) {
                    returnErr.status = response.statusCode;
                } else {
                    returnErr.status = 500;
                }
                returnErr.message = 'search blog list in db failed';
                commonFunc.showError(req, res, returnErr);
            }
        }
    );
};

var renderDetailpage = function(req, res, responseBody) {
    res.render('blog-detail', {
        blog: responseBody,
        title: 'Blogsite- blog Detail',
        userInfo: req.session.userInfo
    });
};

module.exports.blogDetail = function(req, res) {
    var requestOptions, path;
    path = "/api/blog/" + req.params.blogid;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };

    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                renderDetailpage(req, res, data);
            } else {
                var returnErr = {};
                if (response.statusCode) {
                    returnErr.status = response.statusCode;
                } else {
                    returnErr.status = 500;
                }
                returnErr.message = 'search a blog in db failed';
                commonFunc.showError(req, res, returnErr);
            }
        }
    );
};

/* get create page
/blog/new */
module.exports.blogNew = function(req, res) {
    var blog = { // need to modify
        userEmail: 'david@blogsite.com',
        userName: 'david',
        title: '',
        allCategory: ['Travel', 'Tech', 'Food', 'Music', 'Film'], //need to modify
        category: []
    };
    res.render('blog-edit', {
        method: 'POST',
        blog: blog,
        title: 'Blogsite- blog create',
        userInfo: req.session.userInfo
    });
};

/* post a new blog
/blog */
module.exports.blogCreate = function(req, res) {
    var requestOptions, path, postData, category = [];
    path = "/api/blog/";
    if (!req.body.userEmail || !req.body.userName || !req.body.title) {
        var returnErr = {};
        returnErr.status = 400;
        returnErr.message = "user's Email,user's Name,title are all required";
        commonFunc.showError(req, res, returnErr);
        return;
    }
    postData = {
        userEmail: req.body.userEmail,
        userName: req.body.userName,
        title: req.body.title,
        content: req.body.content
    };
    if (req.body.category && req.body.category.length) {
        category = req.body.category.join('|');
        postData.category = category;
    }

    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
    };

    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 201) {
                renderDetailpage(req, res, data);
            } else {
                console.log(response.statusCode);
                var returnErr = {};
                if (response.statusCode) {
                    returnErr.status = response.statusCode;
                } else {
                    returnErr.status = 500;
                }
                returnErr.message = 'create a blog in db failed';
                commonFunc.showError(req, res, returnErr);
            }
        }
    );
};

/* get edit page
'/blog/:blogid' */
module.exports.blogShowEdit = function(req, res) {
    var requestOptions, path, returnErr = {};
    if (!req.params.blogid) {
        returnErr.status = 500;
        returnErr.message = "Not found, blogid is required";
        commonFunc.showError(req, res, returnErr);
        return;
    }
    path = "/api/blog/" + req.params.blogid;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };

    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                data.allCategory = ['Travel', 'Tech', 'Food', 'Music', 'Film']; //need to modify
                res.render('blog-edit', {
                    method: 'post',
                    blog: data,
                    title: 'Blogsite- blog edit',
                    userInfo: req.session.userInfo
                });
            } else {

                if (response.statusCode) {
                    returnErr.status = response.statusCode;
                } else {
                    returnErr.status = 500;
                }
                returnErr.message = 'search a blog in db failed';
                commonFunc.showError(req, res, returnErr);
            }
        }
    );
};

/* put blog edit 
'/blog/edit/:blogid' */
module.exports.blogEdit = function(req, res) { //console.log('in blog edit');
    var requestOptions, path, postData, category = [],
        returnErr = {};
    if (!req.params.blogid) {
        returnErr.status = 500;
        returnErr.message = "Not found, blogid is required";
        commonFunc.showError(req, res, returnErr);
        return;
    }
    path = "/api/blog/" + req.params.blogid;
    console.log(path);
    if (!req.body.userEmail || !req.body.userName || !req.body.title) {
        returnErr.status = 400;
        returnErr.message = "user's Email,user's Name,title are all required";
        commonFunc.showError(req, res, returnErr);
        return;
    }

    postData = {
        userEmail: req.body.userEmail,
        userName: req.body.userName,
        title: req.body.title,
        content: req.body.content
    };
    if (req.body.category && req.body.category.length) {
        category = req.body.category.join('|');
        postData.category = category;
    }

    requestOptions = {
        url: apiOptions.server + path,
        method: "PUT",
        json: postData
    };

    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                renderDetailpage(req, res, data);
            } else { //console.log(response.statusCode);
                var returnErr = {};
                if (response.statusCode) {
                    returnErr.status = response.statusCode;
                } else {
                    returnErr.status = 500;
                }
                returnErr.message = 'update a blog in db failed';
                commonFunc.showError(req, res, returnErr);
            }
        }
    );
};

/* delete page
'/blog/:blogid' */
module.exports.blogDelete = function(req, res) {

};