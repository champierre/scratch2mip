var WebSocketServer = require('ws').Server;
const PORT = 8080;
var wss = new WebSocketServer({port: PORT});
var connections = [];

var mip = require('./index');
var mipFinder = new mip.Finder();
var MiPRobot = mip.Robot;
var selectedRobot;

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

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
              var radar = radarFromCode(arr[0]);
              console.log('Radar: %s', radar);
              if (connections) {
                connections.forEach(function (conn, i) {
                  conn.send(JSON.stringify({command: 'radar', status: radar}));
                });
              }
              return;
            } else if (command === 'SET_GESTURE_MODE') {
              var gesture = gestureFromCode(arr[0]);
              console.log('Gesture: %s', gesture);
              if (connections) {
                connections.forEach(function (conn, i) {
                  conn.send(JSON.stringify({command: 'gesture', status: gesture}));
                });
              }
              return;
            }
            if (!ignore || ignoreList[command] === undefined || !ignoreList[command]) {
              console.log("> "+command+": "+arr);
            }
          });
        });
      });
    }
  });
});

wss.on('connection', function(ws) {
  connections.push(ws);
  ws.on('close', function() {
    connections = connections.filter(function (conn, i) {
      return (conn === ws) ? false : true;
    });
  });
  ws.on('message', function(json) {
    console.log("received " + json);
    data = JSON.parse(json);
    if (data.command == 'forward') {
      selectedRobot.driveDistanceByCm(data.steps, 0, function(err) {
        console.log('Drive to forward ' + data.steps + ' steps');
      });
    } else if (data.command == 'backward') {
      selectedRobot.driveDistanceByCm(data.steps * -1, 0, function(err) {
        console.log('Drive to backward ' + data.steps + ' steps');
      });
    } else if (data.command == 'right') {
      selectedRobot.driveDistanceByCm(0, data.degrees, function(err) {
        console.log('Drive to Right ' + data.degrees + ' degrees');
      });
    } else if (data.command == 'left') {
      selectedRobot.driveDistanceByCm(0, data.degrees * -1, function(err) {
        console.log('Drive to Left ' + data.degrees + ' degrees');
      });
    } else if (data.command == 'set_radar_mode') {
      var mode_code;
      if (data.mode == 'radar') {
        mode_code = 4;
      } else {
        mode_code = 2;
      }
      selectedRobot.sendMiPCommand("SET_RADAR_MODE", mode_code, function(err) {
        console.log('Set radar mode to %s', data.mode);
      });
    }
  });
});
