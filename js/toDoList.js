//https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS

(function(){
  "use strict";  
  
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
      li.value = task.name + "_" + task.dateCreated;
      li.textContent = `Category: ${task.category}, Task: ${task.name}`;
      if (view.$toDoList.hasChildNodes()) {
        view.$toDoList.insertBefore(li, view.$toDoList.firstChild);
      } else {
        view.$toDoList.appendChild(li);
      }
    }

    var self = {
      addCatToCombo : addCatToCombo, refreshList : refreshList, addItemToList : addItemToList,
      $form : document.getElementById("newTaskForm"),
      $createDummyTasks : document.getElementById("createDummyTasks"),
      $clearTasks : document.getElementById("clearStorage"),
      $toDoList : document.getElementById("toDoList"),
      $newTask : document.getElementById("newTask"),
      $catSelect : document.getElementById("categoryChooser")
    };

    return self;
  }());
    

  //Model
  function ToDoList() {
    "use strict";    

    this._allTasks = []; //initialise task array
    
  }

  ToDoList.prototype.getTaskList = function (forceRefresh) {
    if (!this._allTasks.length || forceRefresh) {
      var i = localStorage.length;
      while (i--) {
        this._allTasks.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
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
    this._allTasks.push(task);   
    localStorage.setItem(task.name + "_" + task.dateCreated, JSON.stringify(task));
  }

  ToDoList.prototype.deleteAllTasks = function() {
    this._allTasks.length = 0;
    localStorage.clear();
  }
  
  //Constructors
  function ToDoTask({name, category, dueDate, done, dateCreated}) {
    this.name = name;
    this.category = category === undefined ? "" : category;    
    this.dueDate = dueDate === undefined ? null : dueDate;
    this.done = done === undefined ? false : done;
    this.dateCreated = dateCreated === undefined ? Date.now() : dateCreated;    
  }
  
  //Controller
  function Controller(model) {
  
    var self = this;
    self.model = model;
    self.view = view;
    //populate categories in the view
    updateCategoryCombo();

    view.$form.addEventListener("submit", saveTaskHandler);
    view.$createDummyTasks.addEventListener("click", createDummyTasks);
    view.$clearTasks.addEventListener("click", clearTasksHandler);
    view.$toDoList.addEventListener("click", taskDoneHandler);
    window.addEventListener("storage", storageHandler);
    view.refreshList(model.getTaskList());

    function updateCategoryCombo() {
      self.model.getCategories().forEach(function(cat) {
        self.view.addCatToCombo(cat);
      });
    }

    //event handlers
    function saveTaskHandler(evt) {
      evt.preventDefault();    
    
      var newTask = new ToDoTask({name: self.view.$newTask.value, category: self.view.$catSelect.value});
      self.view.addItemToList(newTask);    
      self.model.saveItem(newTask);
      self.view.addCatToCombo(view.$catSelect.value);
      self.view.$newTask.value = "";
    }

    function taskDoneHandler(evt) {
      
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
  
  
})();

