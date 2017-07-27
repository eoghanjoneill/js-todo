var listsDB = require("../database/toDoLists.json");

exports.getToDoLists = getToDoLists;
exports.getToDoList = getToDoList;

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