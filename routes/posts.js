const express = require("express");
const Post = require("../models/post");

const router = express.Router();

router.post("", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.get("", (req, res) => {
  Post.find().then((posts) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: posts,
    });
  });
});

router.get("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({
      message: "Posts deleted successfully!",
    });
  });
});

module.exports = router;
