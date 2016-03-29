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

module.exports._getToken = function() {
    return req.cookies.token;
};

module.exports._isLoggedIn = function() {
    var token = _getToken();
    if (!token) {
        return false;
    }
    var strPayload = new Buffer((token.split('.')[1]), 'base64').toString('utf8');
    var payload = JSON.parse(strPayload);
    return payload.exp > Date.now() / 1000;
};

module.exports.currentUser = function() {
    if (_isLoggedIn()) {
        var token = _getToken();
        var strPayload = new Buffer((token.split('.')[1]), 'base64').toString('utf8');
        var payload = JSON.parse(strPayload);
        return {
            email: payload.email,
            name: payload.name
        };
    }
};

/*module.exports.commonFunc = function() {
    return {
        currentUser: _currentUser,
        isLoggedIn: _isLoggedIn,
        getToken: _getToken,
        showError: _showError
    };
};*/