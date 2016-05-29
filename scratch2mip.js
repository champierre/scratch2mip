(function(ext) {
    ext._shutdown = function() {};

    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.right = function(str) {
        $.get('http://localhost:8080/right', null, function() {
            console.log('turn right');
        });
    };
    
    ext.left = function(str) {
        $.get('http://localhost:8080/left', null, function() {
            console.log('turn left');
        });
    }
    
    ext.forward = function(str) {
        $.get('http://localhost:8080/forward', null, function() {
            console.log('forward');
        });
    };
    
    ext.backward = function(str) {
        $.get('http://localhost:8080/backward', null, function() {
            console.log('backward');
        });
    }

    var lang = ((navigator.language || navigator.userLanguage) == 'ja') ? 'ja' : 'en';
    var locale = {
        ja: {
            turn_right: '右に回す',
            turn_left: '左に回す',
            move_forward: '前進させる',
            move_backward: '後退させる'
        },
        en: {
            turn_right: 'Turn Right',
            turn_left: 'Turn Left',
            move_forward: 'Move Forward',
            move_backward: 'Move Backward'
        },
    }

    var descriptor = {
        blocks: [
            [' ', 'MiP: ' + locale[lang].turn_right, 'right', 'sample text'],
            [' ', 'MiP: ' + locale[lang].turn_left, 'left', 'sample text'],
            [' ', 'MiP: ' + locale[lang].move_forward, 'forward', 'sample text'],
            [' ', 'MiP: ' + locale[lang].move_backward, 'backward', 'sample text']
        ]
    };

    ScratchExtensions.register('Simple extension', descriptor, ext);
})({});
