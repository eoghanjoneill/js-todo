//https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS

(function(){
  "use strict";  
  
  //View using constructor pattern
  function View() {
    
    this.$form = document.getElementById("newTaskForm");
    this.$createDummyTasks = document.getElementById("createDummyTasks");
    this.$clearTasks = document.getElementById("clearStorage");
    this.$toDoList = document.getElementById("toDoList");
    this.$newTask = document.getElementById("newTask");
    this.$catSelect = document.getElementById("categoryChooser");
    this.$infobar = document.getElementById("infobar");  
  }

  View.prototype.addCatToCombo = function (cat) {
    var el, $catOptions, optionFound = false;
    $catOptions = document.getElementById(this.$catSelect.list.id);
    for (var j = 0; j < $catOptions.options.length; j++) {
      if (cat == $catOptions.options[j].innerHTML) {
        optionFound = true;
        break;
      }
    }
    if (!optionFound) {
      el = document.createElement("option");
      el.textContent = cat;
      $catOptions.appendChild(el);
    }      
  }

  View.prototype.refreshList = function (toDoList) { 
    this.$toDoList.tBodies[0].innerHTML = "";
    toDoList.forEach(function(element) {
      this.addItemToList(element);
    }, this);    
  }

  View.prototype.addItemToList = function (task) {
    var tr = document.createElement("tr");
    tr.id = task.toString();
    let d = new Date(task.dateCreated);
    let shortDate = d.getFullYear() + "-" + (d.getMonth() < 10 ? "0" : "") + d.getMonth() + "-" + d.getDate();
    tr.innerHTML = `<td>${task.category}</td><td>${task.name}</td><td>${shortDate}</td>`;
    this.setTaskDoneFlag(tr, task.done);
    if (this.$toDoList.tBodies[0].hasChildNodes()) {
      this.$toDoList.tBodies[0].insertBefore(tr, this.$toDoList.tBodies[0].firstChild);
    } else {
      this.$toDoList.tBodies[0].appendChild(tr);
    }
  }

  View.prototype.setTaskDoneFlag = function (el, isDone) {
    if (isDone) {
      el.classList.add("completed");
    }
    else {
      el.classList.remove("completed");
    }
  }

  View.prototype.setInfoMessage = function (message) {
    if (message) {
      this.$infobar.innerText = message;
      this.$infobar.classList.remove(".hidden");
    }
    else {
      this.$infobar.classList.add(".hidden");
    }
  }


  //Model - using the Constructor pattern, adding functions to the prototype
  function ToDoList() {
    "use strict";    

    this._allTasks = []; //initialise task array
    this._userName = "Eoghan";
  }

  ToDoList.prototype.getTaskList = function (forceRefresh) {
    if (forceRefresh) {
      this._allTasks.length = 0
    }

    if (!this._allTasks.length) {      
      var i = localStorage.length;
      while (i--) {
        this._allTasks.push(ToDoTask.prototype.fromJSON(localStorage.getItem(localStorage.key(i))));
      }
      this._allTasks.sort((x,y) => x.dateCreated >= y.dateCreated);
    }
    
    return this._allTasks;
  }

  ToDoList.prototype.getCategories = function () {
    //get the unique list of used categories, plus add a few
    let allCats = this._allTasks.map(task => task.category);
    allCats.forEach(x=>console.log(x));
    allCats = allCats.filter((cat, i, arr) => arr.indexOf(cat) === i);//remove duplicates
    if (allCats.filter(x => x.toLowerCase().trim() === "general").length == 0) {
      allCats.unshift("General");
    }
    allCats.sort((a, b) => a < b);
    return allCats;
  }   

  ToDoList.prototype.saveItem = function(task, callback) {
    //use timestamp as key - update task if it already exists
    if (!this._allTasks.contains(task)) {
      this._allTasks.push(task);
    }
    
    //save to local storage
    localStorage.setItem(task.toString(), JSON.stringify(task));

    //save to db
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/toDoLists/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200) {
        //request finished - do something?
        if (typeof callback == "function") {
          callback("To-do list saved to database.")
        }
      }
    }
    xhttp.send(JSON.stringify(this));
  }
  
  ToDoList.prototype.deleteAllTasks = function() {
    this._allTasks.length = 0;
    localStorage.clear();
  }

  ToDoList.prototype.getTaskById = function(taskId) {
    let i = this._allTasks.length;
    while (i--) {
      if(this._allTasks[i].toString() === taskId) {
        return this._allTasks[i];
      }
    }
    return false;
  }
  
  //Constructors
  function ToDoTask({name, category, dueDate, done, dateCreated}) {
    this.name = name;
    this.category = category === undefined ? "" : category;    
    this.dueDate = dueDate === undefined ? null : dueDate;
    this.done = done === undefined ? false : done;
    this.dateCreated = dateCreated === undefined ? Date.now() : dateCreated;    
  }

  ToDoTask.prototype.toString = function() {
    return this.name + "_" + this.dateCreated;
  }
  
  ToDoTask.prototype.fromJSON = function (json) {
    let obj = JSON.parse(json);
    let task = new ToDoTask({});
    for(let key in obj) {
      if (obj.hasOwnProperty(key)) {        
        task[key] = obj[key];
      }
    }
    return task;
  }

  //Controller Constructor function
  function Controller(model, view) {
  
    var self = this;
    self.model = model;
    self.view = view;
    
    view.$form.addEventListener("submit", saveTaskHandler);
    view.$createDummyTasks.addEventListener("click", createDummyTasks);
    view.$clearTasks.addEventListener("click", clearTasksHandler);
    view.$toDoList.addEventListener("click", taskDoneHandler);
    window.addEventListener("storage", storageHandler);
    view.refreshList(model.getTaskList());
    //populate categories in the view
    self.updateCategoryCombo = function () {
      self.model.getCategories().forEach(function(cat) {
        self.view.addCatToCombo(cat);
      });
    }
    self.updateCategoryCombo();

    //event handlers
    function saveTaskHandler(evt) {
      evt.preventDefault();    
    
      var newTask = new ToDoTask({name: self.view.$newTask.value, category: self.view.$catSelect.value});
      self.model.saveItem(newTask, self.view.setInfoMessage);
      self.view.addItemToList(newTask);      
      self.view.addCatToCombo(view.$catSelect.value);
      self.view.$newTask.value = "";
    }

    function taskDoneHandler(evt) {
      //find the li that was clicked
      let foundItOrList = false, tgt;
      tgt = evt.target;
      while (!foundItOrList) {
        
        if (tgt.nodeName.toLowerCase() === "tr") {
          foundItOrList = true;
          //mark the task done
          let task = self.model.getTaskById(tgt.id);
          task.done = !task.done;
          model.saveItem(task, self.view.setInfoMessage);
          view.setTaskDoneFlag(tgt, task.done);
        }
        else if (tgt.id === "toDoList" || tgt.nodeName.toLowerCase() === "html") {
          foundItOrList = true;
        }          
        else {
          tgt = tgt.parentNode;
        }
      }
      
    }

    function storageHandler(evt) {
      location.reload();
    }

    function clearTasksHandler(evt) {
        evt.preventDefault();
        self.model.deleteAllTasks();
        self.view.refreshList(model.getTaskList(true));
    }

    function createDummyTasks(evt) {
      evt.preventDefault();

      var task1 = new ToDoTask({name: "Learn JavaScript",
        category: "Dev"});
      var task2 = new ToDoTask({name: "Learn Node.js",
        category: "Dev"});
      var task3 = new ToDoTask({name: "Plant out sunflower seeds",
        category: "Garden"});
      model.saveItem(task1);
      model.saveItem(task2);
      model.saveItem(task3);
      self.updateCategoryCombo();

      view.refreshList(model.getTaskList());
    }   
  } 

  //entry point
  (function initialise() {    
    var model = new ToDoList();
    var view = new View();
    var controller = new Controller(model, view);
    
  })();
  
  //helper methods
  Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
      if (this[i] === obj) {
        return true;
      }
    }
    return false;
  }  
})();

