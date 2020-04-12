const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    "mongodb://badri:" +
      process.env.MONGO_SECRET +
      "@ds239967.mlab.com:39967/heroku_fb2tpnzs"
  )
  .then(() => console.log("Connected to MongoDb.."))
  .catch(() => console.log("Connection to MongoDb failed.."));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTION, PUT"
  );
  next();
});

app.use("/api/posts", postsRoutes);

app.use("/api/user", userRoutes);

module.exports = app;
