const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/post");

const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://badri:12td0426@ds239967.mlab.com:39967/heroku_fb2tpnzs")
  .then(() => console.log("Connected to MongoDb.."))
  .catch(() => console.log("Connection to MongoDb failed.."));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: "Post added successfully",
  });
});

app.get("/api/posts", (req, res) => {
  Post.find().then((posts) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: posts,
    });
  });
});

module.exports = app;
