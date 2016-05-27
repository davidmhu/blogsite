var mongoose = require('mongoose');
var blogItemSchema=new mongoose.Schema({
	userEmail:{
        type:String,
        required:true,
        index:true
    },
    userName:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
        index:true
    },
    content:String,
    brief:String,
    readCnt:{
        type:Number,
        index:true,
        "default":0
    },
    review:[String],
    createdOn: {
        type:Date,
        "default":Date.now,
        index:true
    },
    modifiedOn:Date,
    allowReview:{
        type:Boolean,
        "default":true
    },
    pics:[String],
    category:{
        type:[String],
        index:true
    },
    public:{
        type:Number,
        "default":1 //1 public 0 private -1 defined
    }
});


blogItemSchema.index({userEmail:1,createdOn:-1,title:1,category:1});

mongoose.model('BlogItem', blogItemSchema);