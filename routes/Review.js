const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Review=require("../models/review.js");
const listing= require("../models/listing.js");
const{validateReviews,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const ReviewController=require("../controllers/Review.js");





// reviews
// post routes


router.post("/",isLoggedIn,validateReviews,wrapAsync(ReviewController.createRoute));
  
  
  // reviews
  // delete route
  
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.deleteRoute));

  module.exports=router;
  