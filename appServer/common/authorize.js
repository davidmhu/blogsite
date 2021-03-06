var commonFunc = require('../common/common');

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
    var token = req.session.token;//getToken(req,res);

    if (token) {
        return next();
    }

    res.redirect('/login');//,{'prevUrl':'please log in first'});
};

module.exports.accessAllowed=function(req,res) {
    var returnErr = {};
    
    if (!req.params.email || !req.session.userInfo.email || req.params.email !== req.session.userInfo.email){
        returnErr.status = 401;
        returnErr.message = 'You\'re not allowed to access user\'s info.';
        //console.log(req.session.userInfo.email);
        commonFunc.showError(req, res, returnErr);
    }

};

