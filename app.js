require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const homeStartingContent = "Embrace the transformative power of daily journaling. Through self-reflection, stress reduction, goal tracking, and creative exploration, journaling offers a dynamic toolkit for personal growth. It enhances problem-solving skills, preserves memories, nurtures gratitude, and sharpens communication. Uncover patterns, foster mindfulness, and embark on a journey of self-discovery. Your thoughts matter—start journaling and unlock a world of benefits for your well-being and development.";
const aboutContent = "";
const contactContent = "";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// connecting to mongoose and creating its model (mongoDB cloud connected)
mongoose.connect(process.env.CONNECTION_URL);

const Post = mongoose.model("Post", {
  title : String,
  content : String
});

const Contact = mongoose.model("Contact",{
  full_name: String,
  email: String,
  phone_number: String,
  query: String
});

// rendering the post from database to home route
app.get("/", function(req,res){
  Post.find({})
    .then(function(posts){
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    })
    .catch(function(err){
      console.log(err);
    });

});

app.get("/about", function(req,res){
  res.render("about",{aboutContent:aboutContent});
});

app.get("/contact", function(req,res){
  res.render("contact",{contactContent:contactContent});
});

app.get("/compose", function(req,res){
  res.render("compose");
});

// composing new post in database
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save()     // for saving in the database

  res.redirect("/");

});

// using route parameters for displaying full content of the blog-post
app.get("/posts/:postId", function(req,res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id : requestedPostId})
  .then(function(post){
    res.render("post", {
      title : post.title,
      content : post.content
    });
  })
  .catch(function(err){
    console.log(err);
  });
});

// storing contact info in database
app.post("/contact", function(req, res){
  const contact = new Contact({
    full_name: req.body.fname +" "+ req.body.lname,
    email: req.body.email,
    phone_number: req.body.number,
    query: req.body.feedback
  });

  contact.save()     // for saving in the database
  res.redirect("/submit");
});

app.get("/submit", function(req,res){
  res.render("submit");
});

// listening port
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Server started on port: ",PORT);
});
