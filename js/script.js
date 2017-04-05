//https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS

(function(){
  "use strict";  
  //entry point  
  printList();

  //Constructors
  function ToDoTask(name, category, dueDate) {
    this.name = name;    
    this.category = category === undefined ? "" : category;
    this.dueDate = dueDate;
  }
  
  //functions
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
      createDummyData();
    }
    return JSON.parse(localStorage.getItem("toDoList"));
  }
})();

