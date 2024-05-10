 const listing= require("./models/listing.js");
 const Review= require("./models/review.js");
 const expressError = require("./utils/expressError.js");
 const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        // console.log( req.session.redirectUrl);
        req.flash("error","you must be loggedin to create new listing");
        res.redirect("/Login");  
      }
      next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if( req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl

}
next();
}


module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let Listing=await listing.findById(id);
    if(!Listing.owner._id.equals(res.locals.currtUser._id)){
        req.flash("error","You Don't Have Permission To Edit");
        res.redirect(`/listing/${id}`);
      }
     next();
}

module.exports.validateListing=(req,res,next)=>{ 
    let {error} =listingSchema.validate(req.body);
    // console.log(result);
     if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new expressError(400,errMsg);
     }
    else{
      next();
    }
  
  }


  module.exports.validateReviews=(req,res,next)=>{ 
      let {error} =reviewSchema.validate(req.body);
      // console.log(result);
       if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
       }
      else{
        next();
      }
    
    }


    
module.exports.isReviewAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currtUser._id)){
      req.flash("error","You Are Not The  Author Of This Review");
      return res.redirect(`/listing/${id}`);
    }
   next();
}


