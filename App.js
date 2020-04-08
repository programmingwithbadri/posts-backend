const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

const postsRoutes = require("./routes/posts");

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

app.use("/api/posts", postsRoutes);

module.exports = app;
