const listing= require("../models/listing.js");
const mbxGeoCoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken=process.env.MAP_TOKEN;
const geoCodingClient=mbxGeoCoding({accessToken:mapToken});

module.exports.index=async(req,res)=>{
    const allListing=await listing.find();
    res.render("listing/index.ejs",{allListing});
   };

module.exports.renderNewForm=(req,res)=>{
    res.render("listing/new.ejs");
      };

module.exports.renderShowRoute=async(req,res)=>{
        let {id}=req.params;
       const Listing=await listing.findById(id)
       .populate({path:"reviews",populate:{
        path:"author"
       },
       }).populate("owner");
       console.log(Listing);
       if(!Listing){
        req.flash("error","Listing You Requested Does Not Existed!");
       }
       
       res.render("listing/show.ejs",{Listing});
       };
module.exports.CreateListing=async(req,res,next)=>{
        // let {title,description,image,price,country,location}=req.body;
        // let listing=req.body.listing;
        
        // <------------------------  validation for schema ------------------------------------------>
        
          // let result =listingSchema.validate(req.body);
          // console.log(result);
          //  if(result.error)
          //  throw new expressError(400,result.error);
        
          // <------------------------------------------------------------------------------------->

          let response=await geoCodingClient
          .forwardGeocode({
            query:req.body.listing.location,  
            limit: 1,
          })
            .send();

          // console.log(req.body.Listing.location); 
          
          // res.send("!done")


         let url=req.file.path;
         let filename=req.file.filename;
         let newListing=new listing(req.body.listing)
           newListing.owner=req.user._id;
           newListing.image={url,filename};
           newListing.geometry=response.body.features[0].geometry

           let savedListing=await newListing.save();
           console.log(savedListing);
            // console.log(listing);
            req.flash("success","New Listing Created !")
            res.redirect("/listing")
        };

module.exports.renderEditForm=async(req,res)=>{
            let {id}=req.params;
            const Listing=await listing.findById(id);
            if(!Listing){
              req.flash("error","Listing You Requested Does Not Existed!");
             }
             let originalImageUrl=Listing.image.url;
              originalImageUrl=originalImageUrl.replace("/upload","/upload/h_250,w_200")
            res.render("listing/edit.ejs",{Listing,originalImageUrl});
          };

 module.exports.renderUpdateRoute=async(req,res)=>{
            let {id}=req.params;
            // if(!req.body.listing){
            //   next(new expressError(400,"Send Valid Data"))
            // }
            const Listing=await listing.findByIdAndUpdate(id,{...req.body.listing});
            if(typeof req.file !== "undefined")
              {
              let url=req.file.path;
              let filename=req.file.filename;
              Listing.image={url,filename};
              await Listing.save();
            }
         
            req.flash("success"," Listing Updated!");
            res.redirect(`/listing/${id}`)
          };

module.exports.renderDeleteRoute=async(req,res)=>{
            let {id}=req.params;
           const deleteChat= await listing.findByIdAndDelete(id);
           console.log(deleteChat);
           req.flash("success","Listing Deleted !")
           res.redirect("/listing");
          };