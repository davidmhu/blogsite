var mongoose = require('mongoose');

var blogItemSchema=new mongoose.Schema({
	userId:{
        type:String,
        required:true
    },
    userName:String,
    title:String,
    content:String,
    readCnt:Number,
    review:[String],
    email:{
		type:String,
		required:true,
        unique:true
	},
    createdOn: Date,
    modifiedOn:{
    	type:Date,
    	"default":Date.now
    },
    allowReview:Boolean,
    pics:[String],
    category:[String]
});

mongoose.model('BlogItem', blogItemSchema);