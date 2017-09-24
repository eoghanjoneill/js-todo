var request = require("request");

var HEROES = {
    _userName: "HeroArrayTest",
    heroes: [
    { id: 11, name: 'Hercules' },
    { id: 12, name: 'Aeneas' },
    { id: 13, name: 'Romulus' },
    { id: 14, name: 'Remus' },
    { id: 15, name: 'Publius Scipio Africanus the Elder' },
    { id: 16, name: 'Nero' },
    { id: 17, name: 'Venus' },
    { id: 18, name: 'Mars' },
    { id: 19, name: 'Julius Caesar' },
    { id: 20, name: 'Fionn MacChumhaill' }
]};

request.post(
  "http://localhost:3999/toDoLists/",
  { json: HEROES },
  function(err, res, body) {
    if (!err && res.statusCode == 200) {
      console.log(body);      
    }
    else {
      console.log (err.toString());
    }
  }
)
