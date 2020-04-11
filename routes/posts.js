const express = require("express");
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");

const Post = require("../models/post");

const router = express.Router();

const IMG_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = IMG_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (ext) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = IMG_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    post.save().then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res) => {
    let imagePath = req.body.imagePath;

    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    const post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath,
    });
    Post.updateOne({ _id: req.params.id }, post).then((data) => {
      res.json({
        message: "Post updated successfully",
        postId: data._id,
      });
    });
  }
);

router.get("", (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
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

router.delete("/:id", checkAuth, (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({
      message: "Posts deleted successfully!",
    });
  });
});

module.exports = router;
