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

router.get(/^\/toDoLists\/?$/i, getToDoListHandler);
router.get(/^\/toDoLists\/(\w+)\/?$/i, getToDoListByNameHandler);
router.post(/^\/toDoLists\/?$/i, postUpsertToDoListHandler);
module.exports = router;

//Route handlers
function getToDoListHandler(req, res, next) {
  toDoListService.getToDoLists (function (error, data) {
      if (error) {      
        resGen.send500("Error getting the lists", res);
      }
      else {
        resGen.sendJson(data, res);
      }
    });
}

function getToDoListByNameHandler(req, res, next) {
  var listId = req.params[0];  
  toDoListService.getToDoListByName(listId, function(error, data) {
    if (error) {
      resGen.send500("Error getting list " + listId, res);
    }
    else if (!data) {
      resGen.send404("List " + listId, res);
    }
    else {
      resGen.sendJson(data, res);
    }      
  });
}

function postUpsertToDoListHandler(req, res, next) {
  console.log("Tried to add one!");
  toDoListService.upsertToDoList(req.body, function(error, data) {
    if (error) {
      resGen.send500("Error saving list to database.", res);
    }    
    else {
      resGen.send200("Saved list", res);
    }
  });
}
/*
var server = http.createServer(function (req, res) {
  //a parsed url
  var _url;

  //in case the client uses lower case for http verbs
  req.method = req.method.toUpperCase();
  console.log(req.method + " " + req.url);
  if (req.method !== 'GET') {
    res.writeHead(501, {
      'Content-Type': 'text/plain'
    });
    return res.end(req.method + ' is not implemented by this server.');
  }
  
  //res.end("The current time is " + new Date(Date.now()).toISOString());
  var reAllLists = /^\/toDoLists\/?$/i;
  var reListSearch = /^\/toDoLists\/(\d+)\/?$/i;
  var reAddToDo = /^\/toDoLists\/add\/(.+)$/i;
  var reUpsertPerson = /^\/people\/add\/(.+)$/i;

  if(_url = reAllLists.exec(req.url)) {
    toDoListService.getToDoLists (function (error, data) {
      if (error) {
        resGen.send500("Error getting the lists", res);
      }
      else {
        resGen.sendJson(data, res);
      }
    });
    
  }
  else if (_url = reListSearch.exec(req.url)) {
    var listId = _url[1];
    res.writeHead(200);
    toDoListService.getToDoList(listId, function(error, data) {
      if (error) {
        resGen.send500("Error getting list " + listId, res);
      }
      else if (!data) {
        resGen.send404("List " + listId, res);
      }
      else {
        resGen.sendJson(data, res);
      }      
    });    
  }
  else if (_url = reUpsertPerson.exec(req.url)) {
    var name = _url[1];
    var person = {};
    person.name = name;
    person.age = Math.floor((Math.random() * 100) + 1);
    toDoListService.upsertPerson(person, function(error) {
      if(error) {
        resGen.send500(error.toString(), res);
      }
      else {
        resGen.send200("added summat", res);
      }      
    });
    //toDoListService.insertSomething(person);
    
  }
  else {
    //try to send static file
    resGen.staticFile("/public")(req.url, res);    
  }

}).listen(3000, "127.0.0.1");

console.log("Server running on http://127.0.0.1:3000"); //+ server.address().address);
*/