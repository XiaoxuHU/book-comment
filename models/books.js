var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    name:String,
    price:String,
    image:String,
    description:String,
    bookAuthor:String,
    like:{type:Number,default:0},
    dislike:{type:Number,default:0},
    author:{
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
        username:String
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        rep:  "Comment",
    }]
});

module.exports = mongoose.model("Book",bookSchema);