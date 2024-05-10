const express=require("express");
const router=express.Router();
const userSchema=require("../models/userSchema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const routeController=require("../controllers/user.js");

router.get("/signup",(routeController.renderSignupForm));


router.post("/signup",wrapAsync(routeController.loginForm));

router.get("/Login",(routeController.renderLoginForm));

router.post("/Login",saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/Login',failureFlash:true }),async(req,res)=>{
req.flash("success","Welcomeback To Wanderlust");
let redirectUrl= res.locals.redirectUrl || "/listing";
res.redirect(redirectUrl);
});

router.get("/Logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
        return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listing");
    });
});


module.exports=router;