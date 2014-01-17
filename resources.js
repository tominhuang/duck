var g_ressources = (function () {
    var retval = [],
        imgs = ["platform", "bird", "enemy", "sling1", "sling2", "sling3", "ground", "wood1", "wood2", "smoke", "menu_refresh", "menu_back", "adboard", "diamond", "fire", "fire2", "panda_right1", "panda_right2", "panda_left1", "panda_left2"],
		others = ["bg.jpg"];

    for (var i = 0; i < imgs.length; i++) {
        retval.push({
            type: "image",
            src: 'sprites/' + imgs[i] + '.png'
        });
    }

    for (var i = 0; i < others.length; i++) {
        retval.push({
            type: "image",
            src: 'sprites/' + others[i] 
        });
    }	

    return retval;
}());