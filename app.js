var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    Book = require("./models/books"),
    Comment = require("./models/comment"),
    User = require("./models/user");
    
var commentRoutes = require("./routes/comments"),
    bookRoutes = require("./routes/books"),
    authRoutes = require("./routes/index");

// seedDB();

//mongoose.connect("mongodb://localhost/book_comment");
//mongoose.connect("mongodb://xiaoxu:hxx199329@ds229918.mlab.com:29918/book_comment");
mongoose.connect(process.env.databaseURL); 

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport CONFIG
app.use(require("express-session")({
   secret: "asdfghjkl",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser = req.user; //{currentUser:req.user}
    res.locals.error = req.flash("error");//{error:error message}
    res.locals.success = req.flash("success"); // {succesee:success message}
    next();
});


app.use("/",authRoutes);
app.use("/books/:id/comments",commentRoutes);
app.use("/books",bookRoutes);






app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server is listening");
});