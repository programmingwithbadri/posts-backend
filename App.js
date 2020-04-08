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
    "GET, POST, PATCH, DELETE, OPTION, PUT"
  );
  next();
});

app.post("/api/posts", (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((data) => {
    res.status(201).json({
      message: "Post added successfully",
      postId: data._id,
    });
  });
});

app.put("/api/posts/:id", (req, res) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((data) => {
    res.json({
      message: "Post updated successfully",
      postId: data._id,
    });
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

app.get("/api/posts/:id", (req, res) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json({
        message: "Post fetched successfully!",
        post: post,
      });
    } else {
      res.status(401).json({ message: "Post not found" });
    }
  });
});

app.delete("/api/posts/:id", (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({
      message: "Posts deleted successfully!",
    });
  });
});

module.exports = app;
