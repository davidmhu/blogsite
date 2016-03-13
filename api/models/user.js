var mongoose = require('mongoose');

var userSchema=new mongoose.Schema({
	email:{
		type:String,
		required:true,
        unique:true
	},
	name:{
		type:String,
		required:true
	},
	createdOn: {
        type: Date,
        "default": Date.now
    },
    password:{
    	type:String,
    	required:true,
    },
    role:[String]
});

mongoose.model('User', userSchema);