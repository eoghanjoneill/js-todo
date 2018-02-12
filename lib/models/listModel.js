const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: { type: String, required: true, trim : true },
  category: { type: String, required: true, trim : true },
  dueDate: { type: Date },
  done: { type: Boolean },
  dateCreated: { type: Date, required: true }
});

const ToDoListSchema = new Schema({
  _allTasks : [ TaskSchema ],
  _userName: { type: String, required: true },
  _lastSaved: { type: Date },
  _apiUrl: { type: String }
});

module.exports = mongoose.model('ToDoList', ToDoListSchema, 'todolists');