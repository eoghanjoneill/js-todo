// ***DEPRECATED - this file was using MongoClient, not mongoose
var listsDB = require("../database/toDoLists.json");

exports.getToDoLists = getToDoLists;
exports.getToDoListByName = getToDoListByName;
exports.upsertToDoList = upsertToDoList;
//exports.upsertToDoList = upsertToDoList;
//exports.insertSomething = insertSomething;

var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var mlabsUrl = "mongodb://eoghanmongo:YldsAtQ01N7YxlgzUhzMuOYpog62AX0BiqaUM1ZE93a6T86X4kF20IsqvnLArzeDfJtvi4orKoIJRAxHg1IQ2A==@ds137464.mlab.com:37464/eoghanmongo";
var azureUrl = "mongodb://to-do-list:YldsAtQ01N7YxlgzUhzMuOYpog62AX0BiqaUM1ZE93a6T86X4kF20IsqvnLArzeDfJtvi4orKoIJRAxHg1IQ2A==@to-do-list.documents.azure.com:10255/todolistDB?ssl=true&replicaSet=globaldb";
var dbUrl = mlabsUrl;
//"mongodb://localhost:27017/musicians";
const _personCollection = "people";
const _sandwichCollection = "sandwiches";
const _toDoListCollection = "todolist";

(function init() {  
  getDB();  
  console.log("Initialized mongodb");
})();


function upsertToDoList(toDoList, successFunction) {
  MongoClient.connect(dbUrl, function(err, db) {
    if (err) {
      return successFunction(err);
    }

    console.log("Connected to mongodb server");

    //insert a doc
    var collection = db.collection(_toDoListCollection);
    delete toDoList._id;
    collection.updateOne({"_userName": toDoList._userName}, toDoList, {upsert: true}, function(err, r) {
      if (err) {
        return successFunction(err);
      }
      //assert.equal(1, r.insertedCount);
      db.close();
      successFunction(err, r);
    });
  });
}

function upsertSomething(json, collection, successFunction) {
  MongoClient.connect(dbUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected to mongodb server");

    //insert a doc
    var collection = db.collection(collection);
    collection.updateOne({"_userName": toDoList._userName}, toDoList, {upsert: true}, function(err, r) {
      assert.equal(null, err);
      //assert.equal(1, r.insertedCount);
      db.close();
      successFunction(err);
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
    console.log("Connected successfully to mogodb server");

    db.close();
  });
}

function getToDoLists (callback) {
  MongoClient.connect(dbUrl, function(err, db) {
    assert.equal(null, err);
    var collection = db.collection(_toDoListCollection);
    collection.find().toArray(function(err, docs) {
      callback(null, docs);
    });
  });  
}

function getToDoListByName (listName, callback) {
  getToDoLists(function (error, data) {
    if (error) {
      return callback(error);
    }

    var result = Array.prototype.find.call(data, x => x._userName == listName);

    callback(null, result);
  });
}