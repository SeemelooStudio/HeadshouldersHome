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
	},

    getGoalLineY: function() {
        return this._y + this._h - 30;
    },

    getLeftPostX: function() {
        
    },

    getRightPostX: function() {
    }
});

Crafty.c('Keeper', {
	bodyPosition : {
				x : (PlayerConfig.joints.head.x - PlayerConfig.joints.body_keeper.x) / 2 - 2,
				y : (PlayerConfig.joints.head.y - PlayerConfig.joints.body_keeper.y) / 2
				},

    horizontalSpeed : Game.configs.goalkeeper_horizontal_speed_per_frame,
    wanderDistance : 150,

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
		this.requires('Actor, Draggable, DebugArea')
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

        var headSize = self.iconSize * 2;
        self.messiHead = Crafty.e('Head').Head(PlayerConfig.head_configs.messi)
                               .attr({w: headSize, 
                                      h: headSize,
                                      x: self.iconSize / 2 - headSize / 2,
                                      y: -self.iconGap - headSize,
                                      z: Game.depth.hud})
        self.attach(self.messiHead);

        self.height =  self.iconSize * self.maxNumOfLife + self.iconGap * (self.maxNumOfLife - 1);
    },
    
    getWidth: function() {
        return this.iconSize; 
    },

    getHeight: function() {
        return this.height;
    }
});

});
