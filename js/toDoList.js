//https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS

(function(){
  "use strict";  
  
  //for the view we're using the Module pattern, rather than the Constructor pattern, for object creation
  var view = (function() {
    
    function addCatToCombo(cat) {
      var el, $catOptions, optionFound = false;
      $catOptions = document.getElementById(self.$catSelect.list.id);
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

    function refreshList(toDoList) {      
      view.$toDoList.innerHTML = "";
      toDoList.forEach(function(element) {
        addItemToList(element);
      }, this);    
    }
  
    function addItemToList(task) {
      var li = document.createElement("li");
      li.id = task.toString();
      li.textContent = `Category: ${task.category}, Task: ${task.name}`;
      setTaskDoneFlag(li, task.done);
      if (view.$toDoList.hasChildNodes()) {
        view.$toDoList.insertBefore(li, view.$toDoList.firstChild);
      } else {
        view.$toDoList.appendChild(li);
      }
    }

    function setTaskDoneFlag(listItem, isDone) {
      if (isDone) {
        listItem.classList.add("completed");
      }
      else {
        listItem.classList.remove("completed");
      }
    }

    var self = {
      addCatToCombo : addCatToCombo, refreshList : refreshList,
      addItemToList : addItemToList, toggleTaskDoneFlag : setTaskDoneFlag,
      $form : document.getElementById("newTaskForm"),
      $createDummyTasks : document.getElementById("createDummyTasks"),
      $clearTasks : document.getElementById("clearStorage"),
      $toDoList : document.getElementById("toDoList"),
      $newTask : document.getElementById("newTask"),
      $catSelect : document.getElementById("categoryChooser")
    };

    return self;
  }());
    

  //Model - using the Constructor pattern, adding functions to the prototype
  function ToDoList() {
    "use strict";    

    this._allTasks = []; //initialise task array
    
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
    if (allCats.filter(x => x.toLowerCase().trim() === "general") !== -1) {
      allCats.unshift("General");
    }
    allCats.sort((a, b) => a < b);
    return allCats;
  }   

  ToDoList.prototype.saveItem = function(task) {
    //use timestamp as key - update task if it already exists
    if (!this._allTasks.contains(task)) {
      this._allTasks.push(task);
    }
    
    localStorage.setItem(task.toString(), JSON.stringify(task));
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
  function Controller(model) {
  
    var self = this;
    self.model = model;
    self.view = view;
    //populate categories in the view
    self.updateCategoryCombo = function () {
      self.model.getCategories().forEach(function(cat) {
        self.view.addCatToCombo(cat);
      });
    }
    self.updateCategoryCombo();

    view.$form.addEventListener("submit", saveTaskHandler);
    view.$createDummyTasks.addEventListener("click", createDummyTasks);
    view.$clearTasks.addEventListener("click", clearTasksHandler);
    view.$toDoList.addEventListener("click", taskDoneHandler);
    window.addEventListener("storage", storageHandler);
    view.refreshList(model.getTaskList());

    //event handlers
    function saveTaskHandler(evt) {
      evt.preventDefault();    
    
      var newTask = new ToDoTask({name: self.view.$newTask.value, category: self.view.$catSelect.value});
      self.model.saveItem(newTask);
      self.view.addItemToList(newTask);      
      self.view.addCatToCombo(view.$catSelect.value);
      self.view.$newTask.value = "";
    }

    function taskDoneHandler(evt) {
      //find the li that was clicked
      let foundItOrList = false, li;
      li = evt.target;
      while (!foundItOrList) {
        
        if (li.nodeName.toLowerCase() === "li") {
          foundItOrList = true;
          //mark the task done
          let task = self.model.getTaskById(li.id);
          task.done = !task.done;
          model.saveItem(task);
          view.toggleTaskDoneFlag(li, task.done);
        }
        else if (li.id === "toDoList" || li.nodeName.toLowerCase() === "html")
          foundItOrList = true;
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
    var controller = new Controller(model);   
    
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

