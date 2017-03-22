var http = require('http');
var url = require('url');
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();

var queryString = require( 'querystring' );
const PORT = 8080;

var mip = require('./index');
var mipFinder = new mip.Finder();
var MiPRobot = mip.Robot;
var selectedRobot;

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

function handleRequest(request, response) {
  try {
    //log the request on console
    console.log(request.url);
    //Disptach
    dispatcher.dispatch(request, response);
  } catch(err) {
    console.log(err);
  }
}

function getQueryObj(req) {
  // gets the query part of the URL and parses it creating an object
  var queryObj = queryString.parse(url.parse(req.url).query);
  return queryObj;

  // queryObj will contain the data of the query as an object
  // and jsonData will be a property of it
  // so, using JSON.parse will parse the jsonData to create an object
  // var obj = JSON.parse( queryObj.jsonData );
}

mipFinder.scan(function(err, robots) {
  if (err != null) {
    console.log(err);
    return;
  }

  for (var i in robots) {
    console.log(i+': '+robots[i].name);
  }

  rl.question('which one: ', function(which) {
    selectedRobot = robots[which];
    if (selectedRobot != null) {
      mipFinder.connect(selectedRobot, function(err) {
        if (err != null) {
          console.log(err);
          return;
        }

        //Create a server
        var server = http.createServer(handleRequest);

        //Lets start our server
        server.listen(PORT, function() {
          //Callback triggered when server is successfully listening. Hurray!
          console.log("Server listening on: http://localhost:%s", PORT);
        });
      });
    }
  });
});

dispatcher.onGet('/forward', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('forward');
  var steps = parseInt(getQueryObj(req).steps, 10);

  selectedRobot.driveDistanceByCm(steps, 0, function(err) {
    console.log('Drive to Forward ' + steps + ' steps');
  });
});

dispatcher.onGet('/backward', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('backward');
  var steps = parseInt(getQueryObj(req).steps, 10);

  selectedRobot.driveDistanceByCm(steps * -1, 0, function(err) {
    console.log('Drive to Backward ' + steps + ' steps');
  });
});

dispatcher.onGet('/right', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('right');
  var degrees = parseInt(getQueryObj(req).degrees, 10);

  selectedRobot.driveDistanceByCm(0, degrees, function(err) {
    console.log('Drive to Right ' + degrees + ' degrees');
  });
});

dispatcher.onGet('/left', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('left');
  var degrees = parseInt(getQueryObj(req).degrees, 10);

  selectedRobot.driveDistanceByCm(0, degrees * -1, function(err) {
    console.log('Drive to Left ' + degrees + ' degrees');
  });
});
