module.exports.showError = function(req, res, err) {
    if (!err.status) err.status = 500;
    if (err.status === 404) {
        err.title = "ErrorCode:404, Page not found";
    } else if (err.status === 500) {
        err.title = "ErrorCode:500, internal server error";
    } else if (err.status === 401) {
        err.title = "ErrorCode:401, no authorization";
        res.redirect('/login');
        return;
    } else {
        err.title = "ErrorCode:" + err.status + ", something's gone wrong";
    }

    if (!err.message) err.message = 'unknow Error';
    err.prevUrl = '';
    res.status(err.status);
    res.render('generic-text', {
        err: err
    });
};

module.exports.getToken = function(req,res) {
    return req.cookies.token;
};

module.exports.isLoggedIn = function(req,res) {
    var token = getToken(req,res);
    if (!token) {
        return false;
    }
    var strPayload = new Buffer((token.split('.')[1]), 'base64').toString('utf8');
    var payload = JSON.parse(strPayload);
    return payload.exp > Date.now() / 1000;
};

module.exports.currentUser = function(req,res) {
    if (isLoggedIn()) {
        var token = getToken();
        var strPayload = new Buffer((token.split('.')[1]), 'base64').toString('utf8');
        var payload = JSON.parse(strPayload);
        return {
            email: payload.email,
            name: payload.name
        };
    }
};

module.exports.ifLoggedIn=function(req, res, next) {
    var token = req.cookies.token;//getToken(req,res);

    if (token) {
        return next();
    }

    res.redirect('/login');//,{'prevUrl':'please log in first'});
};
