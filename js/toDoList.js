//https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS

(function(){
  "use strict";  
  
  var $form, $toDoList, allTasks = [];

  //entry point
  (function initialise() {
    $form = document.getElementById("newTaskForm");
    $form.addEventListener("submit", saveTaskHandler);
    var $createDummyTasks = document.getElementById("createDummyTasks");
    $createDummyTasks.addEventListener("click", createDummyTasks);
    var $clearTasks = document.getElementById("clearStorage");
    $clearTasks.addEventListener("click", clearTasks);
    $toDoList = document.getElementById("toDoList");
    window.addEventListener("storage", storageHandler);
    populateCategoryCombo();
    refreshList();  
  })();


  //Constructors
  function ToDoTask(name, category, dueDate, done, dateCreated) {
    this.name = name;
    this.category = category === undefined ? "" : category;    
    this.dueDate = dueDate === undefined ? null : dueDate;
    this.done = done === undefined ? false : done;
    this.dateCreated = dateCreated === undefined ? Date.now() : dateCreated;    
  }
  
  //event handlers
  function saveTaskHandler(evt) {
    evt.preventDefault();
    var $newTask = document.getElementById("newTask");
    var $catSelect = document.getElementById("categoryChooser");
    var newTask = new ToDoTask($newTask.value, $catSelect.value);
    addItemToList(newTask);    
    saveItemToStorage(newTask);
    addCatToCombo($catSelect.value);
    $newTask.value = "";    
  }

  function storageHandler(evt) {
    location.reload();
  }

  function clearTasks(evt) {
      evt.preventDefault();
      localStorage.clear();
      refreshList();
  }

  //functions
  function populateCategoryCombo() {
    var categories = getCategories();
    categories.forEach(function(cat) {
      addCatToCombo(cat);
    });
  }

  function addCatToCombo(cat) {
    var el, $catOptions;
    $catOptions = document.getElementById("usedCategories");    
    el = document.createElement("option");
    el.textContent = cat;
    $catOptions.appendChild(el);
  }

  function getCategories() {
    //get the unique list of used categories, plus add a few
    var allCats = getSavedList().map(task => task.category);
    allCats.forEach(x=>console.log(x));
    allCats = allCats.filter((cat, i, arr) => arr.indexOf(cat) === i);//remove duplicates
    if (allCats.filter(x => x.toLowerCase().trim() === "general") !== -1) {
      allCats.unshift("General");
    }
    allCats.sort((a, b) => a < b);
    return allCats;
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

  function saveItemToStorage(task) {
    //use timestamp as key - update task if it already exists
    allTasks.push(task);   
    localStorage.setItem(task.name + "_" + task.dateCreated, JSON.stringify(task));
  }

  function getSavedList(refreshFromStorage) {
    if (!allTasks.length || refreshFromStorage) {
      var i = localStorage.length;
      while (i--) {
        allTasks.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
      }
      allTasks.sort((x,y) => x.dateCreated >= y.dateCreated);
    }
    
    return allTasks;
  }

  function createDummyTasks(evt) {
    evt.preventDefault();

    var task1 = new ToDoTask("Learn JavaScript", "Dev");
    var task2 = new ToDoTask("Learn Node.js", "Dev");
    var task3 = new ToDoTask("Plant out sunflower seeds", "Garden");
    saveItemToStorage(task1);
    saveItemToStorage(task2);
    saveItemToStorage(task3);
    
    refreshList();
  }
  
})();

