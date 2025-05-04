var express = require('express');
var router = express.Router();
const passport = require('passport');
const userModel =require("./users");
const postModel =require("./posts");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));



router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
  
  const errorMessages = req.flash("error");
  res.render("login", { error: errorMessages });
});

router.get('/feed', function(req, res, next) {
  res.render("feed");
});

router.get('/profile', isLoggedIn,  async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  
  res.render("profile",{user});
});

router.post("/register", function(req,res){
  const { fullname, username, email } = req.body;
  const userData = new userModel({ fullname, username, email });

  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
})

router.post("/login", passport.authenticate("local", {
  successRedirect :"/profile",
  failureRedirect: "/login",
  failureFlash: true,
}),function(req,res){
   
});

router.get("/logout",function(req,res){
  req.logout(function(err){
    if(err) { return next(err);}
    res.redirect('/login');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated() ) return next();
  res.redirect('/login');
}
module.exports = router;
