var listsDB = require("../database/toDoLists.json");

exports.getToDoLists = getToDoLists;
exports.getToDoList = getToDoList;
exports.upsertPerson = upsertPerson;
exports.upsertToDoList = upsertToDoList;
exports.insertSomething = insertSomething;

var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var dbUrl = "mongodb://to-do-list:YldsAtQ01N7YxlgzUhzMuOYpog62AX0BiqaUM1ZE93a6T86X4kF20IsqvnLArzeDfJtvi4orKoIJRAxHg1IQ2A==@to-do-list.documents.azure.com:10255/?ssl=true&replicaSet=globaldb";
//"mongodb://localhost:27017/musicians";
const _personCollection = "people";
const _toDoListCollection = "toDoList";

(function init() {
  console.log("I was here");
  getDB();  
  console.log("now I'm here");
})();

function upsertPerson(person, successFunction) {
  MongoClient.connect(dbUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected to mongodb server");

    //insert a doc
    var collection = db.collection(_personCollection);
    collection.updateOne({"name": person.name}, person, {upsert: true}, {}, function(err, r) {
      assert.equal(null, err);
      //assert.equal(1, r.insertedCount);
      db.close();
      callback(err);
    });
  });
}

function insertSomething(json, collection) {
  MongoClient.connect(dbUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected to mongodb server");

    //insert a doc
    var collection = db.collection(collection);
    collection.insertOne(json, function(err, r) {
      assert.equal(null, err);
      assert.equal(1, r.insertedCount);
      db.close();
    });
  });
}

function getDB() {
  
  MongoClient.connect(dbUrl, function(err, db) {
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