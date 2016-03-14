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
	createdOn: Date,
    modifiedOn:{
    	type:Date,
    	"default":Date.now
    },
    password:{
    	type:String,
    	required:true,
    },
    role:[String],
    portrait:String,
    gender:Number,//0 F,1 M,2 unknown
    birthday:Date
});

mongoose.model('User', userSchema);