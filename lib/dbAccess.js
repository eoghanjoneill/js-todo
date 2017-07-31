var listsDB = require("../database/toDoLists.json");

exports.getToDoLists = getToDoLists;
exports.getToDoList = getToDoList;
exports.insertSomething = insertSomething;

var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var musiciansUrl = "mongodb://localhost:27017/musicians";

(function init() {
  console.log("I was here");
  getDB();  
  console.log("now I'm here");
})();

function insertSomething(json) {
  MongoClient.connect(musiciansUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected to mongodb server");

    //insert a doc
    var collection = db.collection("people");
    collection.insertOne(json, function(err, r) {
      assert.equal(null, err);
      assert.equal(1, r.insertedCount);
      db.close();
    });
  });
}

function getDB() {
  
  MongoClient.connect(musiciansUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to the server".green);
    db.close();
  });
}

function getToDoLists (callback) {
  setTimeout(function () {
    callback(null, listsDB);
  }, 500);
}

function getToDoList (listId, callback) {
  getToDoLists(function (error, data) {
    if (error) {
      return callback(error);
    }

    var result = Array.prototype.find.call(data, x => x.listId == listId);

    callback(null, result);
  });
}