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

    var lang = ((navigator.language || navigator.userLanguage) == 'ja') ? 'ja' : 'en';
    var locale = {
        ja: {
            turn_right: '右に %n 度回す',
            turn_left: '左に %n 度回す',
            move_forward: '%n 歩前進させる',
            move_backward: '%n 歩後退させる'
        },
        en: {
            turn_right: 'turn right %n degrees',
            turn_left: 'turn left %n degrees',
            move_forward: 'move forward %n steps',
            move_backward: 'move backward %n steps'
        },
    }

    var descriptor = {
        blocks: [
            [' ', 'MiP: ' + locale[lang].turn_right, 'right', 90],
            [' ', 'MiP: ' + locale[lang].turn_left, 'left', 90],
            [' ', 'MiP: ' + locale[lang].move_forward, 'forward'],
            [' ', 'MiP: ' + locale[lang].move_backward, 'backward']
        ]
    };

    ScratchExtensions.register('Scratch2MiP', descriptor, ext);
})({});
