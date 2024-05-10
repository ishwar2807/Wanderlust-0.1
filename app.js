if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}


const express=require("express");
const mongoose = require('mongoose');
const app=express();

const path=require("path");
const methodoverride=require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/userSchema.js");




const ListingRouter=require("./routes/Listing.js");
const ReviewsRuter=require("./routes/Review.js");
const UserRouter=require("./routes/user.js");

const dbUrl=process.env.ATLASDB_URL;

const port=3002;



main().then((res)=>{
  console.log("connected to DB");
  })
  
  .catch((err) => { console.log(err)
  });
  
  async function main() {
    await mongoose.connect(dbUrl);
  }
  




app.set("view engine","ejs");
app.engine("ejs", ejsMate);
app.set("listing/views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",()=>{
  console.log("Error In Mongo Session Store",err);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currtUser=req.user;
  next();
});


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// <-----------   connected to mongoose database  ----------->




// <-----------   connected to mongoose database  ----------->

app.listen(port,()=>{
    console.log(`server is listening:${port}`);
});


app.use("/listing",ListingRouter);
app.use("/listing/:id/reviews",ReviewsRuter);
app.use("/",UserRouter);


app.all("*",(req,res,next)=>{
  next( new expressError(404,"page not found!"));
});

;

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something Went's Wrong"}=err;
  // statusCode=statusCode||500;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("listing/error.ejs",{error:{message}});
})











