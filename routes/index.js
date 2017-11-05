var express = require("express");
var router = express.Router();;
var toDoListService = require("../lib/dbAccess.js");
var resGen = require("../lib/responseGenerator.js");

//router.use(express.static("public")); - done in app.js
/*router.use("/", (req, res, next) => {
  console.log(req.method + " " + req.url);
  next();
});*/
router.get("/", (req, res) => res.sendFile("/home.html"));
/*var reAllLists = /^\/toDoLists\/?$/i;
var reListSearch = /^\/toDoLists\/(\d+)\/?$/i;
var reAddToDo = /^\/toDoLists\/add\/(.+)$/i;
var reUpsertPerson = /^\/people\/add\/(.+)$/i;*/
module.exports = router;