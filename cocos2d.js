(function () {
    var d = document;
    var c = {
        COCOS2D_DEBUG: 2,
        box2d: true,
        showFPS: false,
        frameRate: 60,
        tag: 'viewport',		
        SingleEnginFile: 'cocos2dx.lib.min.js',
        appFiles: ['resources.js', 'b2.js', 'game.min.js']
    };
    window.addEventListener('DOMContentLoaded', function () {
        var s = d.createElement('script');
        s.src = c.SingleEnginFile;
        d.body.appendChild(s);
        s.c = c;
        s.id = 'cocos2d-html5';
    });
})();