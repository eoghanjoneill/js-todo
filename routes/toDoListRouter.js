var express = require('express');
var router = express.Router();
var toDoListService = require("../lib/dbAccess.js");
var resGen = require("../lib/responseGenerator.js");

router.get(/^\/?$/i, getToDoListHandler);
router.get(/^\/(\w+)\/?$/i, getToDoListByNameHandler);
router.post(/^\/?$/i, postUpsertToDoListHandler);
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
