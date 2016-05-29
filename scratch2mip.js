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

    var descriptor = {
        blocks: [
            [' ', 'MiP: Turn Right', 'right', 'sample text'],
            [' ', 'MiP: Turn Left', 'left', 'sample text'],
            [' ', 'MiP: Move Forward', 'forward', 'sample text'],
            [' ', 'MiP: Move Backward', 'backward', 'sample text']
        ]
    };

    ScratchExtensions.register('Simple extension', descriptor, ext);
})({});
