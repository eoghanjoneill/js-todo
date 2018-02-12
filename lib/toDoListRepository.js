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
          //list._userName = listBody._userName;
          //list._lastSaved = listBody._lastSaved;
          //list._apiUrl = listBody._apiUrl;
          list.save((err, returnedList) => {
            if (err) {
              console.log(`*** ToDoListRepository.upsertToDoList; error on insert: ${err}`);
            } else {
              callback(null, returnedList);
            }
          })
        } else {
          //do an update
        }        
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