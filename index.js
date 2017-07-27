var http = require("http");
var toDoListService = require("./lib/toDoLists.js");
var resGen = require("./lib/responseGenerator.js");

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
  else {
    //try to send static file
    resGen.staticFile("/public")(req.url, res);    
  }

}).listen(3000, "127.0.0.1");

console.log("Server running on http://127.0.0.1:3000"); //+ server.address().address);