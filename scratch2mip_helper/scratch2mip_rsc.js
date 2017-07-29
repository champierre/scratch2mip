var net = require('net');
var STEPS = 10;
var DEGREES = 90;
var SCRATCH_PORT = 42001;

var mip = require('./index');
var mipFinder = new mip.Finder();
var MiPRobot = mip.Robot;
var selectedRobot;
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

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
            });
        }
    });
});

var client = new net.Socket();
var broadcast = function(subject, callback) {
    var message = 'broadcast "';
    message += subject.replace(/"/g, '""');
    message += '"';
    var buff = new Buffer(message.length + 4);
    buff.writeUInt32BE(message.length, 0);
    buff.write(message, 4, 'utf8');
    return client.write(buff, 'utf8', callback);
};

client.connect(SCRATCH_PORT, '127.0.0.1', function() {
    console.log('Connected to Scratch');
    broadcast('forward');
    broadcast('backward');
    broadcast('right');
    broadcast('left');
});

client.on('data', function(data) {
    console.log('Received: ' + data);
    if (String(data).match(/broadcast "(.*)"/) !== null) {
        var action = RegExp.$1;
        switch (action) {
            case 'forward':
                selectedRobot.driveDistanceByCm(STEPS, 0, function(err) {
                    console.log('Drive to Forward ' + STEPS + ' steps');
                });
                break;
            case 'backward':
                selectedRobot.driveDistanceByCm(STEPS * -1, 0, function(err) {
                    console.log('Drive to Backward ' + STEPS * -1 + ' steps');
                });
                break;
            case 'right':
                selectedRobot.driveDistanceByCm(0, DEGREES, function(err) {
                    console.log('Drive to Right ' + DEGREES + ' degrees');
                });
                break;
            case 'left':
                selectedRobot.driveDistanceByCm(0, DEGREES * -1, function(err) {
                    console.log('Drive to Left ' + DEGREES * -1 + ' degrees');
                });
                break;
            default: break;
        }
    }
});

client.on('close', function() {
    console.log('Disconnected from Scratch');
    process.exit();
});

client.on('error', function(err) {
    console.log('Error: ', err);
});
