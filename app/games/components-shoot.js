define(["crafty", "games/game", "games/player-config"], function (Crafty, Game, PlayerConfig) {

Crafty.c('Goal', {
	init: function() {
		var self = this;

        var hitAreaStartY = 40;
        var goalHalfWidth = 100;

		self.requires('Actor, SpriteGate, Collision, DebugCollision')
            .attr({z: Game.depth.goal})
            .collision([self._w / 2 - goalHalfWidth, hitAreaStartY], 
                       [self._w / 2 + goalHalfWidth, hitAreaStartY], 
                       [self._w / 2 + goalHalfWidth, hitAreaStartY + 20], 
                       [self._w / 2 - goalHalfWidth, hitAreaStartY + 20]);

        self.backgrounds = [];
		var numOfTiles = Math.ceil(Game.width / 120);
        var startX = self._w / 2 - numOfTiles / 2 * 120;
        var startY = -28;

        for (var i = 0; i < numOfTiles; i ++)
        {
            var background = Crafty.e('Actor, SpriteSky').attr(
            {
                w : 120,
                h : 140,
                x : startX + i * 120,
                y : startY,
                z : Game.depth.goal - 1,
            });
            self.backgrounds.push(background);
            self.attach(background);
        }

        var postWidth = 10;
        var postHeight = 50;
        var postOffsetX = 25;
        var postOffsetY = 20;
        self.leftPost = Crafty.e('Actor, Post, Collision, DebugCollision, DebugArea')
                              .attr({w: postWidth, h: postHeight, z: Game.depth.goal + 1})
                              .collision([0, 0], [postWidth, 0], [postWidth, postHeight], [0, postHeight]);
        self.attach(self.leftPost);
        self.leftPost.attr({x: self.getCenterX() - goalHalfWidth - postOffsetX - postWidth / 2, 
                            y: self.getGoalLineY() - postHeight - postOffsetY});
        self.rightPost = Crafty.e('Actor, Post, Collision, DebugCollision, DebugArea')
                              .attr({w: postWidth, h: postHeight, z: Game.depth.goal + 1})
                              .collision([0, 0], [postWidth, 0], [postWidth, postHeight], [0, postHeight]);
        self.attach(self.rightPost);
        self.rightPost.attr({x: self.getCenterX() + goalHalfWidth + postOffsetX - postWidth / 2, 
                            y: self.getGoalLineY() - postHeight - postOffsetY});
	},

    getCenterX: function() {
        return this._x + this._w / 2;
    },

    getGoalLineY: function() {
        return this._y + this._h - 30;
    },
});

Crafty.c('Keeper', {
	bodyPosition : {
				x : (PlayerConfig.joints.head.x - PlayerConfig.joints.body_keeper.x) / 2 - 2,
				y : (PlayerConfig.joints.head.y - PlayerConfig.joints.body_keeper.y) / 2
				},

    horizontalSpeed : Game.configs.goalkeeper_horizontal_speed_per_frame,
    wanderDistance : 130,

	getWidth : function() {
		return this.head._w;
	},
	
	getHeight : function() {
		return this.body._h + this.bodyPosition.y;
	},

    init: function() {
        var self = this;

        var basicDepth = Game.depth.npc;
		self.requires('Actor, Collision, DebugCollision, DebugArea')
				.attr({w: 80, h: 120, z : basicDepth});
		self.head = Crafty.e('Head').Head(PlayerConfig.head_configs.keeper);
		self.head.attr({
                    w : self.head._w / 2, 
					h : self.head._h / 2, 
					z : basicDepth + Game.depth.head});
		self.body = Crafty.e('Actor, SpriteAnimation, SpriteKeeper')
                          .reel('Idle', 550, [[0,0], [0,1]]);
        self.body.animate('Idle', -1);
		self.body.attr({
					w : self.body._w / 2, 
					h : self.body._h / 2, 
					z : basicDepth + Game.depth.body});
		self.attach(self.head);
		self.attach(self.body);

		self.body.attr({
					x : self._x + self.bodyPosition.x,
					y : self._y + self.bodyPosition.y,
		});

        self.halfBoundBox = new Crafty.polygon(
                [20,20], 
				[self.getWidth() - 20, 20], 
				[self.getWidth() - 20, self.getHeight() - 10], 
				[20, self.getHeight() - 10]);
        self.collision(self.halfBoundBox);
    },

	update: function(deltaTime, frame) {
		this.wander(this.horizontalSpeed, deltaTime);
	},

	wander : function(wanderSpeed, deltaTime) {
        if (!this.centerX ) 
		{
			this.centerX = this._x;
            this.isMovingLeft = true;
		}
		else
		{
			if (this.isMovingLeft)
			{
				if ( this._x < this.centerX - this.wanderDistance  )
				{
					this.x = this.centerX - this.wanderDistance;
                    this.isMovingLeft = false;
				}
				else
				{
					this.x -= wanderSpeed * deltaTime;
				}
			}
			else
			{
				if ( this._x > this.centerX + this.wanderDistance && this._x > 0 )
				{
					this.x = this.centerX + this.wanderDistance;
                    this.isMovingLeft = true;
				}
				else
				{
					this.x += wanderSpeed * deltaTime;
				}
			}
		}
	},

});

Crafty.c('Defender', {
    wanderDistance : 0,
    horizontalSpeed: Game.configs.amateur_horizontal_speed_per_frame,

    isWandering : false,

    init: function() {
        this.requires('Avatar, Collision, DebugCollision, DebugArea')
                .attr({w: 80, h: 120});
    },

    Defender : function(headConfig, bodyConfig, wanderDistance) {
        this.Avatar(Game.depth.npc, headConfig, bodyConfig, false);
        this.collision([20,20],[this.width() - 20, 20],
                       [this.width() - 20, this.height() - 20],[20, this.height() - 20]);
        
        $text_css = { 'size': '12px'};
        this.nameHud = Crafty.e('2D, DOM, Text')
                             .attr({ x: 0, y: -10, w: 80 })
                             .text(headConfig.id)
                             .textColor('#FFFFFF')
                             .textFont($text_css);
        this.attach(this.nameHud);
        
        this.typeId = bodyConfig.typeId;

        this.wanderDistance = wanderDistance || 0;
        if (this.wanderDistance > 0)
        {
            this.startWandering();
        }
        else
        {
            this.idle();
        }

        return this;
    },

    startWandering: function() {
        if (!this.isWandering)
        {
            this.isWandering = true;
            this.run();
            this.bind('EnterFrame', this.update);
        }
    },

    stopWandering: function() {
        if (!this.isWandering)
        {
            this.isWandering = false;
            this.standby();
            this.unbind('EnterFrame', this.update);
        }
    },

    update: function(data) {
        if (this.isWandering)
        {
            this.wander(this.horizontalSpeed, data.dt / 1000);
        }
    },
});

Crafty.c('Shooter', {
    init: function() {
        this.requires('Avatar, Collision, DebugCollision, DebugArea')
                .attr({w: 80, h: 120});
    },

    Shooter : function(headConfig, bodyConfig, ball) {
        this.Avatar(Game.depth.npc, headConfig, bodyConfig, ball);
        this.collision([0,0],[this.width(), 0],[this.width(), this.height()],[0, this.height()]);
        
        $text_css = { 'size': '12px'};
        this.nameHud = Crafty.e('2D, DOM, Text')
                             .attr({ x: 0, y: -10, w: 80 })
                             .text(headConfig.id)
                             .textColor('#FFFFFF')
                             .textFont($text_css);
        this.attach(this.nameHud);
        this.idle();

        return this;
    },
});

Crafty.c('ShootController', {
    dragStartPosition: new Crafty.math.Vector2D(),

    currentDragPosition: new Crafty.math.Vector2D(),

	init: function() {
		this.requires('Actor, Draggable')
				.attr({w: Game.width, h: Game.height, z: Game.depth.controller});

		this.bind('StartDrag', function(data) {
            this.dragStartPosition.setValues(this._x, this._y);
            this.dragStartTime = data.timeStamp;
            this.dragUsed = false;
		});

		this.bind('Dragging', function(data) {
            if (!this.dragUsed)
            {
                this.currentDragPosition.setValues(this._x, this._y);
                if (this.currentDragPosition.distanceSq(this.dragStartPosition) >= 50 * 50)
                {
                    var dir = this.currentDragPosition.subtract(this.dragStartPosition).normalize();
                    var elapsedTime = data.timeStamp - this.dragStartTime;
                    var speed = 50 / elapsedTime;
                    this.dragUsed = true;
                    if (this.onShoot)
                    {
                        this.onShoot(dir, speed);
                    }
                }
            }
		});

        this.bind('StopDrag', function(data) {
            this.attr({x: 0, y: 0});
        });
	},
});

Crafty.c('LifeHud', {
    iconSize : 30,
    iconGap : 10,
    maxNumOfLife : 5,

    init: function() {
        var self = this;

        self.requires('Actor');
        self.icons = [];

        for (var i = 0; i < self.maxNumOfLife; i++)
        {
            var icon = Crafty.e('Actor, SpriteBall');
            icon.attr(
            {
                w : self.iconSize,
                h : self.iconSize,
                x : 0,
                y : (self.iconSize + self.iconGap) * i,
                z : Game.depth.hud
            });
            self.icons.push(icon);
            self.attach(icon);
        }

/*
        var headSize = self.iconSize * 2;
        self.messiHead = Crafty.e('Head').Head(PlayerConfig.head_configs.messi)
                               .attr({w: headSize, 
                                      h: headSize,
                                      x: self.iconSize / 2 - headSize / 2,
                                      y: -self.iconGap - headSize,
                                      z: Game.depth.hud})
        self.attach(self.messiHead);
*/

        self.height =  self.iconSize * self.maxNumOfLife + self.iconGap * (self.maxNumOfLife - 1);
    },

    setLife: function(life) {
        var self = this;
        var life = Math.min(self.maxNumOfLife, life);
        var life = Math.max(0, life);
        for(var i = 0; i < life; i++)
        {
            self.icons[i].visible = true;
        }
        for(var i = life; i < self.maxNumOfLife; i++)
        {
            self.icons[i].visible = false;
        }
    },
    
    getWidth: function() {
        return this.iconSize; 
    },

    getHeight: function() {
        return this.height;
    }
});

Crafty.c('PopupDecal', {
    init: function() {
        var self = this;
        self.requires('Actor, Sprite, SpritePongDecal');
    },

    popup: function(type, x, y) {
        var self = this;

        if (type === "goal")
        {
            self.sprite(0, 0);
            self.z = Game.depth.goal + 1;
        }
        else
        {
            self.sprite(0, 1);
            self.z = Game.depth.hud;
        }
        this.attr({x:x - this._w / 2, y:y});

        Crafty.e("Delay").delay(function(){
            self.destroy();
        }, 500, 0);
    },
});

});
