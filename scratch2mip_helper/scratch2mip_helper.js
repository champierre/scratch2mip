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

var lastRadar;
var lastGesture;

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

function radarFromCode(status) {
    switch (status) {
    case 0x01:
        return 'clear';
    case 0x02:
        return 'far';  // 10-30 cm
    case 0x03:
        return 'near';  // 0-10 cm
    default:
        return undefined;
    }
}

function gestureFromCode(status) {
    switch (status) {
    case 0x0a:
        return 'left';
    case 0x0b:
        return 'right';
    case 0x0c:
        return 'center sweep left';
    case 0x0d:
        return 'center sweep right';
    case 0x0e:
        return 'center hold';
    case 0x0f:
        return 'forward';
    case 0x10:
        return 'back';
    default:
        return undefined;
    }
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
        console.log("MiP is connected.");

		var ignoreList = {"GET_STATUS":true, "GET_WEIGHT_LEVEL":true};
		var ignore = true;

		//setup receive data notification
		selectedRobot.enableBTReceiveDataNotification(true, function(err, data) {
			if (err) {
				console.log(err);
				return;
			}

			//convert the response by MiPCommand
			selectedRobot.convertMiPResponse(data, function(command, arr) {
                if (command === 'SET_RADAR_MODE') {
                    lastRadar = radarFromCode(arr[0]);
                    console.info('Radar: %s', lastRadar);
                    return;
                } else if (command === 'SET_GESTURE_MODE') {
                    lastGesture = gestureFromCode(arr[0]);
                    console.info('Gesture: %s', lastGesture);
                    return;
                }
				if (!ignore || ignoreList[command] === undefined || !ignoreList[command]) {
					console.log("> "+command+": "+arr);
				}
			});
		});

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

dispatcher.onGet('/set-radar-mode', function(req, res) {
  var mode = getQueryObj(req).mode;
  var modeCode;
  if (mode === 'radar') {
      modeCode = 4;
  } else if (mode === 'gesture') {
      modeCode = 2;
  } else {
      console.error('Invalid radar mode "%s", must be one of {radar, gesture}', mode);
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('Invalid radar mode: ' + mode + '\r\nset-radar-mode');
      return;
  }
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('set-radar-mode');
  selectedRobot.sendMiPCommand("SET_RADAR_MODE", modeCode, function(err) {
      lastRadar = undefined;
      lastGesture = undefined;
      console.info('Set radar mode = %s', mode);
  });
});

dispatcher.onGet('/get-radar', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(lastRadar + '\r\nget-radar');
});

dispatcher.onGet('/get-gesture', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(lastGesture + '\r\nget-gesture');
  lastGesture = undefined;
});
