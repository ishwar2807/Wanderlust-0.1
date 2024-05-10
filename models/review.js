const mongoose = require('mongoose');
// const { schema } = require('./listing');
const Schema=mongoose.Schema;

const reviewSchema=Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        Max:5,
    },createdAt:{
        type:Date,
        default:Date.now() ,
    },author:{
        type:Schema.Types.ObjectId, 
        ref:"User",
    }

});
module.exports=mongoose.model("Review",reviewSchema);