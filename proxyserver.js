var express = require("express");
var cors = require("cors");
const axios = require("axios");

var app = express();

app.use(cors());

const API_KEY = "RGAPI-ec025171-908f-40bc-b3fb-e48936aff41e";

app.listen(4000, function () {
  console.log("server started at port 4000");
});
