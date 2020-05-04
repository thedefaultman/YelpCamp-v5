const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport')
      LocalStrategy = require('passport-local')
      Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      User = require('./models/user')
      seedDB = require("./seeds")

const commentRoute = require("./routes/comments")

seedDB()
mongoose.connect("mongodb://localhost/yelp_camp_v6")
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Daniel is the best!",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function (req, res, next) {  
    res.locals.currentUser = req.user
    next()
})

//landing page route
app.get("/", function (req, res) {  
    res.render("landing")
})

//campgrounds page route
//INDEX ROUTE
app.get("/campgrounds", function (req, res) {  
    //get all campground from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
        }
      })
})


//post route
//CREATE - add new campground to DB
app.post("/campgrounds", function (req, res) {  
    //get data from form and add to camps array
    let name = req.body.name
    let image = req.body.image
    let desc = req.body.description
    let newCampground = {name: name, image: image, description: desc}
    //Create a new campground and save to database
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect to camps page
            res.redirect("/campgrounds")
        }
      })
})

//NEW - show form to create new campground
app.get("/campgrounds/new", function (req, res) {  
    res.render("campgrounds/new")
})

//SHOW - shows more info about the one campground
app.get("/campgrounds/:id", function (req, res) {
    //find the with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})

//=========================
// COMMENTS ROUTE
//=========================

app.get("/campgrounds/:id/comments/new", isloggedIn, function (req, res) {  
    //find campground by id
    Campground.findById(req.params.id, function (err, campground) {  
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground})
        }
    })
})

app.post("/campgrounds/:id/comments", isloggedIn, function (req, res) {
    //lookup campground using id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            //create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
            //connect new comment to campground
            //redirect campground/show page
        }
    })
})

//AUTH ROUTE
// show register form
app.get("/register", function(req, res){
    res.render("register"); 
});
//handle sign up logic
app.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds"); 
        });
    });
});

//show login form
app.get("/login", function (req, res) {  
    res.render("login")
})

//handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {  
    
})

//logout route
app.get("/logout", function (req, res) {  
    req.logOut()
    res.redirect("/campgrounds")
})

function isloggedIn (req, res, next) {  
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

app.listen(3000, function () {  
    console.log("YELPCAMP SERVER HAS STARTED");
})


