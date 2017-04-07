//https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS

(function(){
  "use strict";  
  
 


  //Constructors
  function ToDoTask(name, category, dueDate) {
    this.name = name;    
    this.category = category === undefined ? "" : category;
    this.dueDate = dueDate;
  }
  
  //functions

  //entry point
  (function initialise() {
    $form = 
    populateCategories();
    printList();  
  })();

  function populateCategories() {
    var el, categories, $catSelect;
    $catSelect = document.getElementById("categoryChooser");
    categories = getCategories();
    categories.forEach(function(cat) {
      el = document.createElement("option");
      el.setAttribute("value", cat);
      el.textContent = cat;
      $catSelect.appendChild(el);
    });
  }

  function createDummyData() {
    var localList = [];
    var task1 = new ToDoTask("Learn JavaScript", "Dev");
    var task2 = new ToDoTask("Learn Node.js", "Dev");
    var task3 = new ToDoTask("Plant out sunflower seeds", "Garden");
    localList.push(task1);
    localList.push(task2);
    localList.push(task3);
    
    localStorage.setItem("toDoList", JSON.stringify(localList));
  }

  function printList() {
    var toDoList = getSavedList();
    var $toDoList = document.getElementById("toDoList");
    toDoList.forEach(function(element) {
      var li = document.createElement("li");
      li.textContent = `Category: ${element.category}, Task: ${element.name}`;
      $toDoList.appendChild(li);
    }, this);    
  }
  
  function getSavedList() {
    if (localStorage.getItem("toDoList") === null) {
      createDummyTasks();
    }
    return JSON.parse(localStorage.getItem("toDoList"));
  }

  function getCategories() {
    if (localStorage.getItem("categories") === null) {
      createDummyCats();
    }
    return JSON.parse(localStorage.getItem("categories"));
  }

  function createDummyTasks() {
    var localList = [];
    var task1 = new ToDoTask("Learn JavaScript", "Dev");
    var task2 = new ToDoTask("Learn Node.js", "Dev");
    var task3 = new ToDoTask("Plant out sunflower seeds", "Garden");
    localList.push(task1);
    localList.push(task2);
    localList.push(task3);
    
    localStorage.setItem("toDoList", JSON.stringify(localList));
  }

  function createDummyCats() {
    //get the unique list of used categories, plus add a few
    var allCats = getSavedList().map(task => task.category);
    allCats.forEach(x=>console.log(x));
    allCats = allCats.filter((cat, i, arr) => arr.indexOf(cat) === i);//remove duplicates
    if (allCats.filter(x => x.toLowerCase().trim() === "general") !== -1) {
      allCats.unshift("General");
    }

    localStorage.setItem("categories", JSON.stringify(allCats));
  }
})();

