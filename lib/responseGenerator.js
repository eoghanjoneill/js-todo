var fs = require("fs");

exports.send200 = function (message, res) {  
  /*response.writeHead(200, {
    "Content-Type": "text/plain"
  });
  
  response.end(message);*/
  res.status(200).send(message);
}

exports.send404 = function (soughtResource, response) {
  soughtResource = soughtResource || "";
  console.error("Resource not found: " + soughtResource.toString());
  response.status(404).send("Not found: " + soughtResource.toString());  
}

exports.send500 = function(errorMessage, res) {
  console.error(errorMessage.red);
  res.status(500).send(errorMessage);  
}

exports.sendJson = function (data, res) {
  res.status(200).json(data);
}

/*
exports.staticFile = function(staticPath) {
  return function(path, response) {
    var readStream;
    var localPath = path.replace(/^(\/home)(.html?)?$/i, "$1.html");    
    localPath = "." + staticPath + localPath;

    fs.stat(localPath, function(error, stats) {
      if (error || stats.isDirectory()) {
        return exports.send404(path, response);
      }

      readStream = fs.createReadStream(localPath);
      return readStream.pipe(response);
    });
  }
}
*/