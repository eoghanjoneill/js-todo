var express = require('express');
var router = express.Router();
var toDoListService = require("../lib/dbAccess.js");
var listRepo = require('../lib/toDoListRepository');
var resGen = require('../lib/responseGenerator.js');

router.get(/^\/?$/i, getToDoListHandler);
router.get(/^\/(\w+)\/?$/i, getToDoListByNameHandler);
router.post(/^\/?$/i, postUpsertToDoListHandler);
module.exports = router;

//Route handlers
function getToDoListHandler(req, res, next) {
  listRepo.getToDoLists().then(data => {
    resGen.sendJson(data, res);
  })
  .catch(error => {
    resGen.send500("Error getting the lists", res);
  });  
}

function getToDoListByNameHandler(req, res, next) {
  var listId = req.params[0];
  listRepo.getToDoList(listId)
    .then(data => {
      if (!data) {
        resGen.send404("List " + listId, res);
      }
      else {
        resGen.sendJson(data, res);
      }      
    })
    .catch(error => {
      resGen.send500("Error getting list " + listId, res);
    });
}

function postUpsertToDoListHandler(req, res, next) {
  console.log("Tried to add one!");
  listRepo.upsertToDoList(req.body, function(error, data) {
    if (error) {
      resGen.send500("Error saving list to database.", res);
    }    
    else {
      resGen.sendJson({status: true, error: null, message: "Saved list"}, res);
    }
  });
}
