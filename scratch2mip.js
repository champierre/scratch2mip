(function(ext) {
    ext._shutdown = function() {};

    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.right = function(degrees) {
        $.get('http://localhost:8080/right?degrees=' + degrees, null, function() {
            console.log('turn right ' + degrees + ' degrees');
        });
    };

    ext.left = function(degrees) {
        $.get('http://localhost:8080/left?degrees=' + degrees, null, function() {
            console.log('turn left ' + degrees + ' degrees');
        });
    }

    ext.forward = function(steps) {
        $.get('http://localhost:8080/forward?steps=' + steps, null, function() {
            console.log('move forward ' + steps + ' steps');
        });
    };

    ext.backward = function(steps) {
        $.get('http://localhost:8080/backward?steps=' + steps, null, function() {
            console.log('move backward ' + steps + ' steps');
        });
    }

    ext.set_radar_mode = function(mode) {
        $.get('http://localhost:8080/set_radar_mode?mode=' + mode, null, function() {
            console.log('set radar mode to ' + mode);
        });
    }

    ext.get_radar = function(callback) {
        $.ajax({
            url: 'http://localhost:8080/get_radar',
            dataType: 'json',
            success: function(res) {
                console.log('get radar:' + res);
                radar = res['radar'];
                callback(radar);
            }
        });
    }

    ext.get_gesture = function(callback) {
        $.ajax({
            url: 'http://localhost:8080/get_gesture',
            dataType: 'json',
            success: function(res) {
                console.log('get gesture:' + res);
                gesture = res['gesture'];
                callback(gesture);
            }
        });
    }

    var lang = ((navigator.language || navigator.userLanguage) == 'ja') ? 'ja' : 'en';
    var locale = {
        ja: {
            turn_right: '右に %n 度回す',
            turn_left: '左に %n 度回す',
            move_forward: '%n 歩前進させる',
            move_backward: '%n 歩後退させる',
            set_radar_mode: 'set radar mode to %m.radar_mode',
            get_radar: 'get radar',
            get_gesture: 'get gesture',
        },
        en: {
            turn_right: 'turn right %n degrees',
            turn_left: 'turn left %n degrees',
            move_forward: 'move forward %n steps',
            move_backward: 'move backward %n steps',
            set_radar_mode: 'set radar mode to %m.radar_mode',
            get_radar: 'get radar',
            get_gesture: 'get gesture'
        },
    }

    var descriptor = {
        blocks: [
            [' ', 'MiP: ' + locale[lang].turn_right, 'right', 90],
            [' ', 'MiP: ' + locale[lang].turn_left, 'left', 90],
            [' ', 'MiP: ' + locale[lang].move_forward, 'forward'],
            [' ', 'MiP: ' + locale[lang].move_backward, 'backward'],
            [' ', 'MiP: ' + locale[lang].set_radar_mode, 'set_radar_mode', 'radar'],
            ['R', 'MiP: ' + locale[lang].get_radar, 'get_radar'],
            ['R', 'MiP: ' + locale[lang].get_gesture, 'get_gesture'],
        ],
        menus: {
            radar_mode: ['radar', 'gesture']
        }
    };

    ScratchExtensions.register('Scratch2MiP', descriptor, ext);
})({});
