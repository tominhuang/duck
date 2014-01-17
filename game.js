var CMenu = cc.Sprite.extend({
    defaultScale: 0.8,
    hovered: false,
    boundingBox: null,
    onClickCallback: null,
    ctor: function (tex) {
        this._super();
        this.initWithTexture(tex);
        this.setScale(this.defaultScale);
    },
    onClick: function (callback) {
        this.onClickCallback = callback;
    },
    handleTouches: function (touch, evt) {
        (this.hovered && this.onClickCallback) && this.onClickCallback();
    },
    handleTouchesMoved: function (touch, evt) {
        var point = touch[0].getLocation();

        this.boundingBox || (this.boundingBox = this.getBoundingBox());

        if (cc.Rect.CCRectContainsPoint(this.boundingBox, point)) {
            if (!this.hovered) {
                this.hovered = true;
                this.runAction(cc.ScaleTo.create(0.01, 1));
            }
        } else if (this.hovered) {
            this.hovered = false;
            this.runAction(cc.ScaleTo.create(0.01, this.defaultScale));
        }
    },
    handleTouchesEnded: function (touch, evt) {}
});
var id = function(str) {
	return document.getElementById(str);
};
var GameLayer = cc.Layer.extend({
    birdSprite: null,
    isDraggingSling: false,
    birdStartPos: cc.p(260, 345.5),
    slingRadius: {
        min: 20,
        max: 80
    },
    slingAngle: {
        min: cc.DEGREES_TO_RADIANS(250),
        max: cc.DEGREES_TO_RADIANS(295)
    },
    smokeDistance: 16,
    menus: [],
	url: 'http://tomin.github.com/duck/',
    lastSmoke: null,
    slingRubber1: null,
    slingRubber2: null,
    slingRubber3: null,	
    getTexture: function (name, imgtype) {
		var file_ext = (typeof imgtype !== "undefined") ? imgtype : "png";
        return cc.TextureCache.getInstance()
            .addImage('sprites/' + name + '.' + file_ext);
    },
    addObject: function (desc) {		
		var imgtype = (typeof desc.imgtype === "undefined")? "png": desc.imgtype,
			sprite = cc.Sprite.createWithTexture(this.getTexture(desc.name, imgtype));

        sprite.setAnchorPoint(desc.anchor || cc.p(0.5, 0.5));
        sprite.setScaleX(desc.scaleX || desc.scale || 1);
        sprite.setScaleY(desc.scaleY || desc.scale || 1);
        sprite.setRotation(desc.rotation || 0);
        sprite.setPosition(cc.p(desc.x || 0, desc.y || 0));

        desc.shape && b2.enablePhysicsFor({
            type: desc.type,
            shape: desc.shape,
            sprite: sprite,
            radius: desc.radius,
            density: desc.density,
            userData: desc.userData
        });

        this.addChild(sprite, desc.z || 0);
        return sprite;
    },
    init: function () {
        this._super();
        this.removeAllChildrenWithCleanup(true);
        this.setTouchEnabled(true);

        var director = cc.Director.getInstance(),
            self = this,
            winSize = director.getWinSize();

        b2.initWorld();

        var bgSprite = this.addObject({
            name: "bg",
			imgtype: "jpg",
            anchor: cc.p(0, 0),
            z: -1
        });

        var groundSprite = this.addObject({
            name: "ground",
            scaleX: 2.5,
            anchor: cc.p(0, 0),
            type: "static",
            shape: "box",
            density: 0
        });
        var platformSprite = this.addObject({
            name: "platform",
            y: 30,

            scaleY: 1,
            anchor: cc.p(0, 0),
            type: "static",
            shape: "box",
            density: 0
        });

        var sling1Sprite = this.addObject({
            name: "sling1",
            x: 284.5,
            y: 224.5,
            scale: 0.7,
            anchor: cc.p(1, 0)
        });
        var sling2Sprite = this.addObject({
            name: "sling2",
            x: 268.5,
            y: 281.5, 
            scale: 0.7,
            anchor: cc.p(1, 0),
            z: 3
        });
		
        var cube1Sprite = this.addObject({
            name: "wood1",
            x: 840.5,
            y: 71,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000)
        });
        var cube2Sprite = this.addObject({
            name: "wood1",
            x: 1017.5,
            y: 71,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000)
        });
        var hWood1Sprite = this.addObject({
            name: "wood2",
            x: 931.5,
            y: 131.5,
            scaleX: 1.3,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000)
        });
        var hWood2Sprite = this.addObject({
            name: "wood2",
            x: 931.5,
            y: 251.5,
            scaleX: 1.3,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000)
        });
        var hWood3Sprite = this.addObject({
            name: "wood2",
            x: 880,
            y: 330,
            rotation: -40,
            scaleX: 0.8,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000)
        });
        var hWood4Sprite = this.addObject({
            name: "wood2",
            x: 980,
            y: 330,
            rotation: 40,
            scaleX: 0.8,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000)
        });
        var cube3Sprite = this.addObject({
            name: "wood1",
            x: 840.5,
            y: 200.5,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000)
        });
        var cube4Sprite = this.addObject({
            name: "wood1",
            x: 1017.5,
            y: 200.5,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000)
        });
        var cube5Sprite = this.addObject({
            name: "wood1",
            x: 930,
            y: 300,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000)
        });

        var enemySprite = this.addObject({
            name: "enemy",
            x: 931.5,
            y: 71,
            type: "dynamic",
            shape: "circle",
            density: 2,
            userData: new BodyUserData(GameObjectRoll.Enemy, 200)
        });
        var enemy2Sprite = this.addObject({
            name: "enemy",
            x: 931.5,
            y: 180,
            type: "dynamic",
            shape: "circle",
            density: 2,
            userData: new BodyUserData(GameObjectRoll.Enemy, 200)
        });
        var enemy3Sprite = this.addObject({
            name: "enemy",
            x: 863,
            y: 280,
            type: "dynamic",
            shape: "circle",
			scale: 0.5,
            density: 3,
            userData: new BodyUserData(GameObjectRoll.Enemy, 50)
        });				
        var enemy4Sprite = this.addObject({
            name: "enemy",
            x: 986,
            y: 280,
			scale: 0.5,
            type: "dynamic",
            shape: "circle",
            density: 2,
            userData: new BodyUserData(GameObjectRoll.Enemy, 50)
        });
		var pandaRight1 = this.getTexture("panda_right1"),
			pandaRight2 = this.getTexture("panda_right2"),
			pandaLeft1 = this.getTexture("panda_left1"),
			pandaLeft2 = this.getTexture("panda_left2");
			
		var pandaSprite = this.addObject({
			name: "panda_right1",
            x: 40,
            y: 80,
			z: 3
        });		
		var pandaWalk = function() {
			var time = 42, 
				splitTime = time/2,
				period = splitTime * 2,
				periodTime = time/period,
				path = 1080,
				halfPath = path/2,
				actionRight = cc.MoveBy.create(splitTime, cc.p(path, 0)),
				actionLeft = cc.MoveBy.create(splitTime, cc.p(-path, 0)),
				walkArr = [actionRight, actionLeft];
			
			//pandaSprite.runAction(actionBy);			
			pandaSprite.runAction(cc.Sequence.create(walkArr));			
			setTimeout(pandaWalk, time * 1000);

			
			//change skins		
			for(var i=0; i<= time * 2; i++) {
				var x = pandaRight1;
				if (i < time) {
					x = (i%2 ==0) ? pandaRight1: pandaRight2;
				} else {
					x = (i%2 ==0) ? pandaLeft1: pandaLeft2;
				}
				
				setTimeout(function(y) {
					return function() {						
						pandaSprite.setTexture(y);
					}
				}(x), i * 500);
			}
		}
		pandaWalk();			

        var adboardSprite = this.addObject({
            name: "adboard",
            x: 704.5,
            y: 71,
			scale: 0.8,
			type: "dynamic",
			shape: "box",
            userData: new BodyUserData(GameObjectRoll.Enemy, 115)
        });	
        var diamondSprite = this.addObject({
            name: "diamond",
            x: 1084.5,
            y: 480.5,			
        });
		this.fireScreenSprite = this.addObject({
			name: "fire2",
			x: 0,
			y: -275,
			z: 99,
			scaleX: 1.5,
			scaleY: 1						
		});		

        this.birdSprite = this.addObject({
            name: "bird",
            x: 200,
            y: 345,
            z: 1
        });

        this.slingRubber1 = this.addObject({
            name: "sling3",
            x: 278,
            y: 341,
            scaleY: 0.7,
            scaleX: 0,
            anchor: cc.p(1, 0.5),
            z: 0
        });
        this.slingRubber2 = this.addObject({
            name: "sling3",
            x: 250,
            y: 345,
            scaleY: 0.7,
            scaleX: 0,
            anchor: cc.p(1, 0.5),
            z: 2
        });
        this.slingRubber3 = null;

        // --------- Top Menu ! ---------

        var margin = 25,
            backMenu = new CMenu(this.getTexture("menu_back"));
			backMenu.setPosition(cc.p(margin, winSize.height - margin));
			backMenu.onClick(function () {
            window.location.href = this.url;
        });
        this.addChild(backMenu);
        this.menus.push(backMenu);

        var refreshMenu = new CMenu(this.getTexture("menu_refresh"));
        refreshMenu.setPosition(cc.p(70, winSize.height - margin));
        refreshMenu.onClick(function () {
            self.init();
			id("bill").style.display = "none";
        });
        this.addChild(refreshMenu);
        this.menus.push(refreshMenu);

        // --------- My Score ! ---------
		
        var scoreLabel = cc.LabelTTF.create("0", "fantasy", 20, cc.size(20, 20), cc.TEXT_ALIGNMENT_LEFT);
        scoreLabel.setPosition(cc.p(winSize.width - 80, winSize.height - 20));
        scoreLabel.schedule(function () {
            var showingScore = parseInt(scoreLabel.getString());
            if (showingScore < b2.getUserScore()) {
                scoreLabel.setString((showingScore + 1)
                    .toString());
            }
        });		
        this.addChild(scoreLabel);
		

        // --------- Setup Sling's Bomb ! ---------

        var action = cc.Spawn.create(cc.RotateBy.create(1.5, 360), cc.JumpTo.create(1.5, this.birdStartPos, 100, 1));
        this.birdSprite.runAction(action);
        this.scheduleUpdate();
    },
    update: function (dt) {
        b2.simulate();
        var director = cc.Director.getInstance(),
            self = this,
            winSize = director.getWinSize();		

        if (this.birdSprite.body) {
            var bData = this.birdSprite.body.GetUserData();
            if (!bData || bData.isContacted) return;

            var birdPos = this.birdSprite.getPosition(),
                vector = cc.pSub(birdPos, (this.lastSmoke && this.lastSmoke.getPosition()) || cc.p(0, 0)),
                length = cc.pLength(vector);

            if (length >= this.smokeDistance) {
                this.lastSmoke = this.addObject({
                    name: "smoke",
                    x: birdPos.x,
                    y: birdPos.y,
                    scale: Math.random() >= 0.5 ? 0.8 : 0.6
                });
            }

			// --------- onFire ---------
			if (birdPos.x > 400 && birdPos.x < 420 ) {
				var fireSprite = this.addObject({
					name: "fire",
					x: 580,
					y: 196,
					z: 3
				});
				
				var fire2Sprite = this.addObject({
					name: "fire",
					x: 415,
					y: 196,
					z: 3
				});
			}
			
			if (typeof this.fireflag === "undefined") {
				this.fireflag = true;
				setTimeout(function() {			
					self.onFBShow();				
				}, 8000);
			}
        }
    },
	onFBShow: function() {		
		var datetime = new Date(),
			date = new Date().toDateString(),
			time = new Date().toTimeString().substr(0, 7),
			score = b2.getUserScore(),
			price = Math.floor(Math.random()*3+3),
			roads = Math.floor(Math.random()*4),
			roadArr = ["北上25.6", "北上23.3", "南下15.5", "南下18.2"],
			road = roadArr[roads],
			self = this;
						
		id("bill").style.display = "block";
		id("date").innerHTML = date;
		id("time").innerHTML = time;
		id("time2").innerHTML = time;
		id("price").innerHTML = price;
		id("price2").innerHTML = price;
		id("road").innerHTML = road;
		id("road2").innerHTML = road;		
		id("score").innerHTML = score;
		id("fb_share").onclick = this.onFBClick;
		id("fire").onclick = function() {
			self.onFire.call(self);
			return false;
		};
		id("close").onclick = function() {
			id("bill").style.display = "none";
			return false;
		};		
		
	},	
	onFire: function() {		
		var	firetime = 10,
			actionRMiddle = cc.MoveBy.create(firetime, cc.p(0, 800)),				
			walkArr = [actionRMiddle];
			
		this.fireScreenSprite.runAction(cc.Sequence.create(walkArr));
		id("bill").style.display = "none";
			
		setTimeout(function() {
			id("container").style.display = "none";
			id("retry").style.display = "block";
		}, firetime * 1000);		
	},		
	onFBClick: function() {	
		var score = b2.getUserScore(),
			duckurl = 'http://tomin.github.io/duck/',
			title = encodeURIComponent("神送我" + score + "顆鑽石！"),
			link = encodeURIComponent(duckurl),
			summary = encodeURIComponent('「燒毀！斷開魂結！斷開鎖鍊！」盡在可爆鴨！'),
			img = encodeURIComponent(duckurl + "images/diamond" + score + ".jpg"),
			url = 'http://www.facebook.com/sharer.php?s=100&p[title]='+ title + '&p[summary]=' + summary + '&p[url]=' + link + '&p[images][0]=' + img;
	
		window.open(url,'sharer','toolbar=0,status=0,width=626,height=436');
		return false;
	},
    onTouchesBegan: function (touch, evt) {
        this.menus.forEach(function (menu) {
            menu.handleTouches(touch, evt);
        });

        var currPoint = touch[0].getLocation(),
            vector = cc.pSub(this.birdStartPos, currPoint);

        if ((this.isDraggingSling = (cc.pLength(vector) < this.slingRadius.max)) && !this.birdSprite.body && !this.slingRubber3) {
            this.slingRubber3 = this.addObject({
                name: "sling3",
                x: currPoint.x,
                y: currPoint.y,
                scaleY: 1.5,
                scaleX: 2,
                anchor: cc.p(0, 0.5),
                z: 1
            });
        }
    },
    onTouchesMoved: function (touch, evt) {
        this.menus.forEach(function (menu) {
            menu.handleTouchesMoved(touch, evt);
        });

        if (!this.isDraggingSling || this.birdSprite.body) return;

        var currPoint = touch[0].getLocation(),
            vector = cc.pSub(currPoint, this.birdStartPos),
            radius = cc.pLength(vector),
            angle = cc.pToAngle(vector);

        angle = angle < 0 ? (Math.PI * 2) + angle : angle;
        radius = MathH.clamp(radius, this.slingRadius.min, this.slingRadius.max);
        if (angle <= this.slingAngle.max && angle >= this.slingAngle.min) {
            radius = this.slingRadius.min;
        }

        this.birdSprite.setPosition(cc.pAdd(this.birdStartPos, cc.p(radius * Math.cos(angle), radius * Math.sin(angle))));

        var updateRubber = function (rubber, to, lengthAddon, topRubber) {
            var from = rubber.getPosition(),
                rubberVec = cc.pSub(to, from),
                rubberAng = cc.pToAngle(rubberVec),
                rubberDeg = cc.RADIANS_TO_DEGREES(rubberAng),
                length = cc.pLength(rubberVec) + (lengthAddon || 8);

            rubber.setRotation(-rubberDeg);
            rubber.setScaleX(-(length / rubber.getContentSize()
                .width));

            if (topRubber) {
                rubber.setScaleY(1.1 - ((0.7 / this.slingRadius.max) * length));
                this.slingRubber3.setRotation(-rubberDeg);
                this.slingRubber3.setPosition(cc.pAdd(from, cc.p((length) * Math.cos(rubberAng), (length) * Math.sin(rubberAng))));
            }
        }.bind(this);

        var rubberToPos = this.birdSprite.getPosition();
        updateRubber(this.slingRubber2, rubberToPos, 13, true);
        updateRubber(this.slingRubber1, rubberToPos, 0);
        this.slingRubber1.setScaleY(this.slingRubber2.getScaleY());
    },
    onTouchesEnded: function (touch, evt) {
        this.menus.forEach(function (menu) {
            menu.handleTouchesEnded(touch, evt);
        });

        if (!this.birdSprite.body && this.isDraggingSling) {
            this.slingRubber1.setVisible(false);
            this.slingRubber2.setVisible(false);
            this.slingRubber3.setVisible(false);

            b2.enablePhysicsFor({
                type: "dynamic",
                shape: "circle",
                sprite: this.birdSprite,
                density: 15,
                restitution: 0.4,
                userData: new BodyUserData(GameObjectRoll.Bird, 250)
            });

            var vector = cc.pSub(this.birdStartPos, this.birdSprite.getPosition()),
                impulse = cc.pMult(vector, 12),
                bPos = this.birdSprite.body.GetWorldCenter();

            this.birdSprite.body.ApplyImpulse(impulse, bPos);

            this.isDraggingSling = false;
        }
    },
    onKeyUp: function (e) {},
    onKeyDown: function (e) {}
});


//--------------------- Scene ---------------------

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var layer = new GameLayer();
        layer.init();

        this.addChild(layer);
    }
});