var fs = require("fs");

exports.send200 = function (message, response) {  
  response.writeHead(200, {
    "Content-Type": "text/plain"
  });
  response.end(message);
}

exports.send404 = function (soughtResource, response) {
  soughtResource = soughtResource || "";
  console.error("Resource not found: " + soughtResource.toString());

  response.writeHead(404, {
    "Content-Type": "text/plain"
  });
  response.end("Not found: " + soughtResource.toString());
}

exports.send500 = function(errorMessage, response) {
  console.error(errorMessage.red);

  response.writeHead(500, {
    "Content-Type": "text/plain"
  });
  response.end(errorMessage);
}

exports.sendJson = function (data, response) {
  response.writeHead(200, {
    "Content-Type": "application/json"
  });

  response.end(JSON.stringify(data));
}

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