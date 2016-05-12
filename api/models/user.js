var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    createdOn: Date,
    modifiedOn: {
        type: Date,
        "default": Date.now
    },
    hash: String,
    salt: String,
    role: {
        type:[String],
        "default":['Author']
    },
    portrait: String,
    gender: Number, //0 F,1 M,2 unknown
    birthday: Date,
    grade: {
        type: Number,
        "default": 0,
    }
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    var name=new Buffer(this.name,'utf8').toString('base64');//for chinese language support
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: name,
        exp: parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET);
};
mongoose.model('User', userSchema);