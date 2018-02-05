(function(ext) {
    var ws;
    var when_near = false;
    var when_far = false;

    ext._shutdown = function() {};

    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.connect = function() {
      ws = new WebSocket('ws://localhost:8080');
      ws.onmessage = function(evt) {
        data = JSON.parse(evt.data);
        if (data.command == 'near') {
          when_near = true;
        } else if (data.command == 'far') {
          when_far = true;
        }
      }
    }

    ext.forward = function(steps) {
      if (ws) {
        ws.send(JSON.stringify({command: 'forward', steps: steps}));
      }
    };

    ext.backward = function(steps) {
      if (ws) {
        ws.send(JSON.stringify({command: 'backward', steps: steps}));
      }
    }

    ext.right = function(degrees) {
      if (ws) {
        ws.send(JSON.stringify({command: 'right', degrees: degrees}));
      }
    };

    ext.left = function(degrees) {
      if (ws) {
        ws.send(JSON.stringify({command: 'left', degrees: degrees}));
      }
    }

    ext.set_radar_mode = function(mode) {
      if (ws) {
        ws.send(JSON.stringify({command: 'set_radar_mode', mode: mode}));
      }
    }

    ext.when_near = function() {
      if (when_near) {
        when_near = false;
        return true;
      }
      return false;
    }

    ext.when_far = function() {
      if (when_far) {
        when_far = false;
        return true;
      }
      return false;
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
            connect: 'connect',
            turn_right: '右に %n 度回す',
            turn_left: '左に %n 度回す',
            move_forward: '%n 歩前進させる',
            move_backward: '%n 歩後退させる',
            set_radar_mode: 'レーダーモードを %m.radar_mode にする',
            when_near: '近いとき',
            when_far: '遠いとき',
            get_gesture: 'get gesture',
        },
        en: {
            connect: 'connect',
            turn_right: 'turn right %n degrees',
            turn_left: 'turn left %n degrees',
            move_forward: 'move forward %n steps',
            move_backward: 'move backward %n steps',
            set_radar_mode: 'set radar mode to %m.radar_mode',
            when_near: 'when near',
            when_far: 'when far',
            get_gesture: 'get gesture'
        },
    }

    var descriptor = {
        blocks: [
            [' ', 'MiP: ' + locale[lang].connect, 'connect'],
            [' ', 'MiP: ' + locale[lang].turn_right, 'right', 90],
            [' ', 'MiP: ' + locale[lang].turn_left, 'left', 90],
            [' ', 'MiP: ' + locale[lang].move_forward, 'forward'],
            [' ', 'MiP: ' + locale[lang].move_backward, 'backward'],
            [' ', 'MiP: ' + locale[lang].set_radar_mode, 'set_radar_mode', 'radar'],
            ['h', 'MiP: ' + locale[lang].when_near, 'when_near'],
            ['h', 'MiP: ' + locale[lang].when_far, 'when_far'],
            ['R', 'MiP: ' + locale[lang].get_gesture, 'get_gesture'],
        ],
        menus: {
            radar_mode: ['radar', 'gesture']
        }
    };

    ScratchExtensions.register('Scratch2MiP', descriptor, ext);
})({});
