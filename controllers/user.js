const User = require("../models/user");


module.exports.renderSignupForm = (req,res)=>{
    res.render('./users/signup.ejs');
    
}

module.exports.signup = async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    let newUser = new User({username,email});
    let registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,err=>{
        if(err){
            return next(err);
        }
        req.flash('success','registered successfully');
        res.redirect('/listing');
    });
    
    }catch(err){
        req.flash('error',err.message);
        res.redirect('/signup');
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render('./users/login.ejs');
}

module.exports.login = async(req,res)=>{
    
    req.flash('success','welcome back to WanderLust');
    let redirectUrl = res.locals.redirectUrl || '/listing';
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            req.flash('error',err);
            next(err);
        }
        req.flash("success",'you logged out!');
        res.redirect('/listing');

    })
}