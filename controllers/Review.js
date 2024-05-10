const Review=require("../models/review.js");
const listing= require("../models/listing.js");

module.exports.createRoute=async(req,res)=>{
    let Listing=await listing.findById(req.params.id);
    let newReviews=new Review(req.body.review)
    newReviews.author=req.user._id;
    // console.log(newReviews);
    Listing.reviews.push(newReviews);
    
    await newReviews.save();
    await Listing.save();
    // console.log("new reviews saved");
    req.flash("success","New Review Created !")
    res.redirect(`/listing/${Listing._id}`);
    };

module.exports.deleteRoute=async(req,res)=>{
        let {id,reviewId}=req.params;
        await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted !")
        res.redirect(`/listing/${id}`);
       };