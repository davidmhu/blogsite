var mongoose = require('mongoose');

var blogItemSchema=new mongoose.Schema({
	userEmail:{
        type:String,
        required:true
    },
    userName:String,
    title:String,
    content:String,
    readCnt:Number,
    review:[String],
    createdOn: Date,
    modifiedOn:{
    	type:Date,
    	"default":Date.now
    },
    allowReview:{
        type:Boolean,
        "default":true
    },
    pics:[String],
    category:[String]
});

mongoose.model('BlogItem', blogItemSchema);