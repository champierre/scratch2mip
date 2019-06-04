var WebSocketServer = require('ws').Server;
const PORT = 8888;
var wss = new WebSocketServer({port: PORT});
var connections = [];

var mip = require('./index');
var mipFinder = new mip.Finder();
var MiPRobot = mip.Robot;
var selectedRobot;

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

var SOUND_FILES = [
  "ONEKHZ_500MS_8K16BIT",
  "ACTION_BURPING",
  "ACTION_DRINKING",
  "ACTION_EATING",
  "ACTION_FARTING_SHORT",
  "ACTION_OUT_OF_BREATH",
  "BOXING_PUNCHCONNECT_1",
  "BOXING_PUNCHCONNECT_2",
  "BOXING_PUNCHCONNECT_3",
  "FREESTYLE_TRACKING_1",
  "MIP_1",
  "MIP_2",
  "MIP_3",
  "MIP_APP",
  "MIP_AWWW",
  "MIP_BIG_SHOT",
  "MIP_BLEH",
  "MIP_BOOM",
  "MIP_BYE",
  "MIP_CONVERSE_1",
  "MIP_CONVERSE_2",
  "MIP_DROP",
  "MIP_DUNNO",
  "MIP_FALL_OVER_1",
  "MIP_FALL_OVER_2",
  "MIP_FIGHT",
  "MIP_GAME",
  "MIP_GLOAT",
  "MIP_GO",
  "MIP_GOGOGO",
  "MIP_GRUNT_1",
  "MIP_GRUNT_2",
  "MIP_GRUNT_3",
  "MIP_HAHA_GOT_IT",
  "MIP_HI_CONFIDENT",
  "MIP_HI_NOT_SURE",
  "MIP_HI_SCARED",
  "MIP_HUH",
  "MIP_HUMMING_1",
  "MIP_HUMMING_2",
  "MIP_HURT",
  "MIP_HUUURGH",
  "MIP_IN_LOVE",
  "MIP_IT",
  "MIP_JOKE",
  "MIP_K",
  "MIP_LOOP_1",
  "MIP_LOOP_2",
  "MIP_LOW_BATTERY",
  "MIP_MIPPEE",
  "MIP_MORE",
  "MIP_MUAH_HA",
  "MIP_MUSIC",
  "MIP_OBSTACLE",
  "MIP_OHOH",
  "MIP_OH_YEAH",
  "MIP_OOPSIE",
  "MIP_OUCH_1",
  "MIP_OUCH_2",
  "MIP_PLAY",
  "MIP_PUSH",
  "MIP_RUN",
  "MIP_SHAKE",
  "MIP_SIGH",
  "MIP_SINGING",
  "MIP_SNEEZE",
  "MIP_SNORE",
  "MIP_STACK",
  "MIP_SWIPE_1",
  "MIP_SWIPE_2",
  "MIP_TRICKS",
  "MIP_TRIIICK",
  "MIP_TRUMPET",
  "MIP_WAAAAA",
  "MIP_WAKEY",
  "MIP_WHEEE",
  "MIP_WHISTLING",
  "MIP_WHOAH",
  "MIP_WOO",
  "MIP_YEAH",
  "MIP_YEEESSS",
  "MIP_YO",
  "MIP_YUMMY",
  "MOOD_ACTIVATED",
  "MOOD_ANGRY",
  "MOOD_ANXIOUS",
  "MOOD_BORING",
  "MOOD_CRANKY",
  "MOOD_ENERGETIC",
  "MOOD_EXCITED",
  "MOOD_GIDDY",
  "MOOD_GRUMPY",
  "MOOD_HAPPY",
  "MOOD_IDEA",
  "MOOD_IMPATIENT",
  "MOOD_NICE",
  "MOOD_SAD",
  "MOOD_SHORT",
  "MOOD_SLEEPY",
  "MOOD_TIRED",
  "SOUND_BOOST",
  "SOUND_CAGE",
  "SOUND_GUNS",
  "SOUND_ZINGS",
  "SHORT_MUTE_FOR_STOP",
  "FREESTYLE_TRACKING_2"
]

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

console.log("Starting scratch2mip 1.1.0");
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
  console.log("Connected");
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
      console.log('Received "Drive forward ' + data.steps + ' steps"');
      if (selectedRobot) {
        selectedRobot.driveDistanceByCm(data.steps, 0, function(err) {
          console.log('Drive forward ' + data.steps + ' steps');
        });
      }
    } else if (data.command == 'backward') {
      console.log('Received "Drive backward ' + data.steps + ' steps"');
      if (selectedRobot) {
        selectedRobot.driveDistanceByCm(data.steps * -1, 0, function(err) {
          console.log('Drive backward ' + data.steps + ' steps');
        });
      }
    } else if (data.command == 'right') {
      console.log('Received "Drive right ' + data.degrees + ' degrees"');
      if (selectedRobot) {
        selectedRobot.driveDistanceByCm(0, data.degrees, function(err) {
          console.log('Drive right ' + data.degrees + ' degrees');
        });
      }
    } else if (data.command == 'left') {
      console.log('Received "Drive left ' + data.degrees + ' degrees"');
      if (selectedRobot) {
        selectedRobot.driveDistanceByCm(0, data.degrees * -1, function(err) {
          console.log('Drive left ' + data.degrees + ' degrees');
        });
      }
    } else if (data.command == 'set_radar_on') {
      selectedRobot.sendMiPCommand("SET_RADAR_MODE", 4, function(err) {
        console.log('Set radar on');
      });
    } else if (data.command == 'set_gesture_on') {
      selectedRobot.sendMiPCommand("SET_RADAR_MODE", 2, function(err) {
        console.log('Set gesture on');
      });
    } else if (data.command == 'play_sound') {
      selectedRobot.playMipSound(SOUND_FILES[data.sound_id - 1], 0, 64, function(err) {
        console.log('Play sound: ' + SOUND_FILES[data.sound_id - 1]);
      });
    } else if (data.command == "set_chest_led") {
      selectedRobot.setMipChestLedWithColor(data.r, data.g, data.b, 0x00, function(err) {
        console.log('Set Chest LED with R:' + data.r + ' G:' + data.g + ' B:' + data.b);
      });
    }
  });
});
