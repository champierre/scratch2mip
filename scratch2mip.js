(function(ext) {
    var ws;
    var when_near = false;
    var when_far = false;
    var when_clear = false;
    var radar = '';

    ext._shutdown = function() {};

    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.connect = function() {
      ws = new WebSocket('ws://localhost:8888');
      ws.onmessage = function(evt) {
        data = JSON.parse(evt.data);
        if (data.command == 'radar') {
          if (data.status == 'clear') {
            when_clear = true;
            radar = 'clear';
          } else if (data.status == 'far') {
            when_far = true;
            radar = 'far';
          } else if (data.status == 'near') {
            when_near = true;
            radar = 'near';
          }
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

    ext.set_radar_on = function() {
      if (ws) {
        ws.send(JSON.stringify({command: 'set_radar_on'}));
      }
    }

    ext.play_sound = function(sound_id) {
      if (ws) {
        ws.send(JSON.stringify({command: 'play_sound', sound_id: sound_id}));
      }
    }

    ext.set_chest_led = function(r, g, b) {
      if (ws) {
        ws.send(JSON.stringify({command: 'set_chest_led', r: r, g: g, b: b}));
      }    
    }

    ext.when_clear = function() {
      if (when_clear) {
        when_clear = false;
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

    ext.when_near = function() {
      if (when_near) {
        when_near = false;
        return true;
      }
      return false;
    }

    ext.get_radar = function() {
      return radar;
    }

    var lang = ((navigator.language || navigator.userLanguage) == 'ja') ? 'ja' : 'en';
    var locale = {
        ja: {
            connect: '接続する',
            turn_right: '右に %n 度回す',
            turn_left: '左に %n 度回す',
            move_forward: '%n 歩前進させる',
            move_backward: '%n 歩後退させる',
            set_radar_on: 'レーダーをオンにする',
            play_sound: '音を鳴らす id: %n (1~106)',
            set_chest_led: '胸のLEDを点ける R: %n G: %n B: %n',
            when_clear: '障害物がないとき',
            when_far: '障害物が遠いとき',
            when_near: '障害物が近いとき',
            get_radar: '障害物との距離(1:なし 2:遠い 3:近い)'
        },
        en: {
            connect: 'connect',
            turn_right: 'turn right %n degrees',
            turn_left: 'turn left %n degrees',
            move_forward: 'move forward %n steps',
            move_backward: 'move backward %n steps',
            set_radar_on: 'set radar on',
            play_sound: 'play sound id: %n (1~106)',
            set_chest_led: 'set chest led with R: %n G: %n B: %n',
            when_clear: 'when clear',
            when_far: 'when far',
            when_near: 'when near',
            get_radar: 'get radar(1:clear 2:far 3:near)'
        },
    }

    var descriptor = {
        blocks: [
            [' ', 'MiP: ' + locale[lang].connect, 'connect'],
            [' ', 'MiP: ' + locale[lang].turn_right, 'right', 90],
            [' ', 'MiP: ' + locale[lang].turn_left, 'left', 90],
            [' ', 'MiP: ' + locale[lang].move_forward, 'forward'],
            [' ', 'MiP: ' + locale[lang].move_backward, 'backward'],
            [' ', 'MiP: ' + locale[lang].set_radar_on, 'set_radar_on'],
            [' ', 'MiP: ' + locale[lang].play_sound, 'play_sound', 1],
            [' ', 'MiP: ' + locale[lang].set_chest_led, 'set_chest_led', 255, 0, 0],
            ['h', 'MiP: ' + locale[lang].when_clear, 'when_clear'],
            ['h', 'MiP: ' + locale[lang].when_far, 'when_far'],
            ['h', 'MiP: ' + locale[lang].when_near, 'when_near'],
            ['r', 'MiP: ' + locale[lang].get_radar, 'get_radar'],
        ],
        menus: {
            // radar_mode: ['radar', 'gesture']
            radar_mode: ['radar']
        }
    };

    ScratchExtensions.register('Scratch2MiP', descriptor, ext);
})({});
