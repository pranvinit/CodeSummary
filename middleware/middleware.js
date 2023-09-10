const express = require("express");
const fileUpload = require("express-fileupload");

const middleware = express();
middleware.use(fileUpload());

module.exports = middleware;
