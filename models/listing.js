const mongoose = require('mongoose');
const { listingSchema } = require('../schema');
const Review=require("../models/review.js");
const User=require("../models/userSchema.js");
const { required } = require('joi');




const Schema =  mongoose.Schema;
const list =new Schema({


title:{
    type:String,
},
description:{
    type:String,
    
    
},
image:{
    filename:String,
    url:String,
    // type:String,
    // default:"https://ideas.sybernews.com/wp-content/uploads/2020/03/christian-praise-and-worship-backgrounds-for-powerpoint-with-regard-to-praise-and-worship-powerpoint-templates.jpeg",
    // set:(v)=>v===""?"https://ideas.sybernews.com/wp-content/uploads/2020/03/christian-praise-and-worship-backgrounds-for-powerpoint-with-regard-to-praise-and-worship-powerpoint-templates.jpeg" : v,
},
price:Number,
location: String,
country:String,
reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
},],
owner:{
    type:Schema.Types.ObjectId, 
    ref:"User",
},
geometry:{
    type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }

},

// category:{
//     type: String,
//     enum:["mountains", "rooms","iconic cities","castles","amazing pools","camping","farms","beach"],
//     required: true
// },

});

list.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_ID:{$in: listing.reviews}});
    }
})

const listing=mongoose.model("listing",list);
module.exports=listing;