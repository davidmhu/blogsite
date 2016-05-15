var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var commentSchema=new mongoose.Schema({
    depth:{
        type:Number,
        "default":0 //top :0
    },
    path:{// dkdlf:dieiei:dkdkdie
        type:String,
        index:true
    },
    userEmail:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    createdOn: {
        type:Date,
        "default":Date.now
    },
    content:String,
    blogitem_id:{
        type:ObjectId,
        required:true,
        index:true
    }
});

mongoose.model('Comment', commentSchema);