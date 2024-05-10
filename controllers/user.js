const userSchema=require("../models/userSchema.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/sign-up.ejs");
    };

 module.exports.loginForm=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new userSchema({email,username});
        const registerdUser=await userSchema.register(newUser,password);
        console.log(registerdUser);
        req.login(registerdUser,(err)=>{
            if(err){
                 return next(err);
            }
            req.flash("success","Welcome To Wanderlust")
            res.redirect("/listing")
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
  
};
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/Login.ejs");
    };