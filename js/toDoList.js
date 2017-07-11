//https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS

(function(){
  "use strict";  
  
  var view = (function() {

    function addCatToCombo(cat) {
      var el, $catOptions;
      $catOptions = document.getElementById("usedCategories");
      el = document.createElement("option");
      el.textContent = cat;
      $catOptions.appendChild(el);
    }

    function refreshList() {
      var toDoList = getSavedList();
      $toDoList.innerHTML = "";
      toDoList.forEach(function(element) {
        addItemToList(element);
      }, this);    
    }
  
    function addItemToList(task) {
      var li = document.createElement("li");
      li.value = task.name + "_" + task.dateCreated;
      li.textContent = `Category: ${task.category}, Task: ${task.name}`;
      if ($toDoList.hasChildNodes()) {
        $toDoList.insertBefore(li, $toDoList.firstChild);
      } else {
        $toDoList.appendChild(li);
      }
    }

    return {
      addCatToCombo : addCatToCombo, refreshList : refreshList, addItemToList : addItemToList,
      form : document.getElementById("newTaskForm"),
      createDummyTasks : document.getElementById("createDummyTasks"),
      clearTasks : document.getElementById("clearStorage"),
      toDoList : document.getElementById("toDoList"),
      newTask : document.getElementById("newTask"),
      catSelect : document.getElementById("categoryChooser")
    };
  }());
    

  //Model
  function ToDoList() {
    "use strict";    

    this.allTasks = []; //initialise task array
    
  }

  ToDoList.prototype.getTaskList = function (forceRefresh) {
    if (!this.allTasks.length || refreshFromStorage) {
      var i = localStorage.length;
      while (i--) {
        this.allTasks.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
      }
      this.allTasks.sort((x,y) => x.dateCreated >= y.dateCreated);
    }
    
    return this.allTasks;
  }

  ToDoList.prototype.getCategories = function (taskList) {
    //get the unique list of used categories, plus add a few
    let allCats = taskList.map(task => task.category);
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
    allTasks.push(task);   
    localStorage.setItem(task.name + "_" + task.dateCreated, JSON.stringify(task));
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
  function Controller(model, view) {
  
    var self = this;
    self.model = model;
    self.view = view;
    //populate categories in the view
    self.model.getCategories(self.model.getTaskList()).forEach(function(cat) {
      self.view.addCatToCombo(cat);
    });

    view.form.addEventListener("submit", saveTaskHandler);
    view.createDummyTasks.addEventListener("click", createDummyTasks);
    view.clearTasks.addEventListener("click", clearTasksHandler);
    view.toDoList.addEventListener("click", taskDoneHandler);
    window.addEventListener("storage", storageHandler);
    view.refreshList();

    //event handlers
    function saveTaskHandler(evt) {
      evt.preventDefault();    
    
      var newTask = new ToDoTask({name: self.view.newTask.value, category: self.view.catSelect.value});
      self.view.addItemToList(newTask);    
      self.model.saveItemToStorage(newTask);
      self.view.addCatToCombo($catSelect.value);
      self.view.newTask.value = "";
    }

    function taskDoneHandler(evt) {
      
    }

    function storageHandler(evt) {
      location.reload();
    }

    function clearTasksHandler(evt) {
        evt.preventDefault();
        localStorage.clear();
        self.view.refreshList();
    }

    function createDummyTasks(evt) {
      evt.preventDefault();

      var task1 = new ToDoTask({name: "Learn JavaScript",
        category: "Dev"});
      var task2 = new ToDoTask({name: "Learn Node.js",
        category: "Dev"});
      var task3 = new ToDoTask({name: "Plant out sunflower seeds",
        category: "Garden"});
      model.saveItemToStorage(task1);
      model.saveItemToStorage(task2);
      model.saveItemToStorage(task3);
      
      self.view.refreshList();
    }   
  } 

  //entry point
  (function initialise() {
    var model = new ToDoList();
    var controller = new Controller(model, view);   
    
  })();
  
  
})();

