const config = require("./utils/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogs");

console.log("connecting to", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });

app.use(cors());
app.use(bodyParser.json());
app.use("/api/blogs", blogRouter);
app.use(middleware.errorHandler);

module.exports = app;
