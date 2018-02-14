'use strict';
const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      ToDoList = require('./models/listModel');

class ToDoListRepository {
  
  getToDoLists() {
    console.log('*** ToDoListRepository.getToDoLists');
    return new Promise((resolve, reject) => {
      ToDoList.find({}, (err, lists) => {
        if (err) { 
          console.log(`*** ToDoListRepository.getToDoLists error: ${err}`);
          reject(err);
        } else {
          resolve(lists);
        }
      });
    });
    
  }

  getToDoList(name) {
    console.log('*** ToDoListRepository.getToDoList');
    return new Promise((resolve, reject) => {
      ToDoList.findOne({ '_userName': name }, (err, list) => {
        if (err) {
          console.log(`*** ToDoListRepository.getToDoList error: ${err}`); 
          reject(err);
        } else {
          resolve(list);
        }
      });
    });
  }

  upsertToDoList(listBody, callback) {
    console.log('*** ToDoListRepository.upsertToDoList');
    //does the list already exist in the database?
    this.getToDoList(listBody._userName)
      .then(data => {
        if(!data) {
          //not found in database
          let list = new ToDoList(listBody);
          
          list.save((err, returnedList) => {
            if (err) {
              console.log(`*** ToDoListRepository.upsertToDoList; error on insert: ${err}`);
              return callback(err);
            } else {
              console.log(`*** ToDoListRepository.upsertToDoList; list inserted: ${list._userName}` );
              callback(null, returnedList);
            }
          });
        } else {
          //do an update
          data._userName = listBody._userName || data._userName;
          data._lastSaved = listBody._lastSaved || data._lastSaved;
          data._apiUrl = listBody._apiUrl || data._apiUrl;
          data._allTasks = [];
          try {
            data._allTasks.push(listBody._allTasks);
          } catch(innerErr) {
            console.log(`*** ToDoListRepository.upsertToDoList; error on setting the task subdocuments : ${innerErr}`);
            return callback(innerErr);
          }

          data.save((err, returnedList) => {
            if (err) {
              console.log(`*** ToDoListRepository.upsertToDoList; error on update: ${err}`);
              return callback(err);
            } else {
              console.log(`*** ToDoListRepository.upsertToDoList; list updated: ${list._userName}` );
              callback(null, returnedList);
            }
          });
        }        
      })
      .catch(err => {
        console.log(`*** ToDoListRepository.upsertToDoList; error thrown during check exist of list: ${err}`);
        return callback(err);
      });
/*
    var docQry = ToDoList.findOneAndUpdate({ 'name': name }, listBody, {upsert: true} (err, list) => {
      if (err) {
        //not found
        console.log(`*** ToDoListRepository.upsertToDoList error on checking for existing list: ${err}`); 
        list = new ToDoList();
        list._userName = listBody._userName;
        list._lastSaved = listBody._lastSaved;

      } else {
        console.log(`list name ${list._userName}`);

      }
    });
    console.log(docQry.toString());*/
  }
}

module.exports = new ToDoListRepository();