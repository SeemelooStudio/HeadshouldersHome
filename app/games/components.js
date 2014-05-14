define(["crafty", "games/game", "games/player-config"], function (Crafty, Game, PlayerConfig) {
Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas');
	},
});

Crafty.c('DebugCollision', {
	init: function() {
		// turn below line off in production
		//this.requires('DebugCanvas, WiredHitBox');
	},
});

Crafty.c('DebugArea', {
	init: function() {
		// turn below line off in production
		//this.requires('Color').color('rgb(125, 125, 125)');
	},
});

Crafty.c('Head', {
	init: function() {
	},

	Head: function(headConfig) {
		this.requires('Actor, Sprite, HeadDefault');
		this.normal_cell = headConfig.sprite;
		this.cry_cell = headConfig.cry;
		this.kiss_cell = headConfig.kiss;
		this.setNormal();
		return this;
	},

	setNormal: function() {
        if (this.normal_cell)
		{
            this.sprite(this.normal_cell[0], this.normal_cell[1]);
		}
	},

	setCry: function() {
        if (this.cry_cell)
		{
            this.sprite(this.cry_cell[0], this.cry_cell[1]);
		}
	},
	setKiss: function() {
        if (this.kiss_cell)
        {
            this.sprite(this.kiss_cell[0], this.kiss_cell[1]);
        }
	}
});

Crafty.c('Body', { 
	init: function() {
	},
	
	Body: function(bodyConfig) {
		this.requires('Actor, SpriteAnimation, ' + bodyConfig.sprite)
			.reel('Run', 550, bodyConfig.runFrames)
            .reel('Standby', 550, [bodyConfig.runFrames[1]])
            .reel('Kick', 100, [bodyConfig.runFrames[2]]);
		if (bodyConfig.tackleFrames )
		{
			this.reel('Tackle', 550, bodyConfig.tackleFrames);
		}
        if (bodyConfig.groundFrames)
        {
            this.reel('FallOnGround', 550, bodyConfig.groundFrames);
        }
		if (bodyConfig.idleFrames ) {
            this.reel('Idle', 550, bodyConfig.idleFrames);
		} else {
            this.reel('Idle', 550, [bodyConfig.runFrames[1]]);
		}
		this.animate('Run', -1);

        this.bind('AnimationEnd', this.onAnimationEnd);
		return this;
	},

    onAnimationEnd: function(data) {
        if (data.id === 'Kick')
        {
            if (this.onKickEnd)
            {
                this.onKickEnd();
            }
            this.standby();
        }
    },

    standby: function() {
        this.animate('Standby', -1);
    },

    kick: function(onKickEnd) {
        this.onKickEnd = onKickEnd;
        this.animate('Kick', 1);
    },

	run: function() {
        this.animate('Run', -1);
	},

	tackle: function() {
        this.animate('Tackle', -1);
	},

    fallOnGround : function() {
        this.animate('FallOnGround', -1);
    },
	
	idle: function() {
        this.animate('Idle', -1);
	}
});

Crafty.c('RollingActor', {
	spinSpeed : 0.3,

	init: function() {
		this.requires('Actor, Tween');
	},
	
	setRollingDirection: function(direction) {
        this.rollingDirection = direction;
	},

	startRolling: function(){
		if (!this.isRolling)
		{
			this.rollingDirection = this.rollingDirection || 1;
			this.isRolling = true;
		}
	},

	stopRolling: function() {
        if (this.isRolling)
        {
            this.isRolling = false;
        }
	},

	roll : function(data) {
		if (this.isRolling)
		{
			this.rotation += this.spinSpeed * data.dt * this.rollingDirection;
		}
	},
	changeRollingDirection: function(){
        this.rollingDirection = 0 - (this.rollingDirection||1);
	}
	
});

Crafty.c('Ball', {
    acceleration: new Crafty.math.Vector2D(),

    velocity: new Crafty.math.Vector2D(),

    friction : -1.5,

    isStill : true,

    onBecomeStillWithoutTrap : function() {},

	init: function() {
		this.requires('RollingActor, SpriteBall').origin('center').
             bind('EnterFrame', this.onEnterFrame);
	},
	
	setPlayer: function(player) {
        this.player = player;
	},

    trap: function() {
        this.isStill = true;
        this.velocity.setValues(0, 0);
        this.stopRolling();
    },

    placeAt: function(x, y) {
        this.velocity.setValues(0, 0);
        this.attr({x : x, y : y});
    },

	kick: function(kickForce, direction) {
        if (this.player)
		{
            this.player.ball = null;
            this.player.detach(this);
            this.player = null;
		}

        this.spinSpeed = 1;
        this.startRolling();

        this.acceleration.setValues(direction);
        this.acceleration.normalize();
        var mass = 1;
        this.velocity.setValues(this.acceleration);
        this.acceleration.scale(this.friction);
        this.velocity.scale(kickForce / mass);
        //console.log(this.acceleration);
        //console.log(this.velocity);

        this.isStill = false;
	},

    onEnterFrame: function(data)
    {
        this.roll(data);

        if (this.velocity.magnitudeSq() > this.friction * this.friction)
        {
            this.velocity.add(this.acceleration);
            this.attr({ x: this._x + this.velocity.x, y: this._y + this.velocity.y });
        }
        else
        {
            if (!this.isStill)
            {
                this.trap();
                this.onBecomeStillWithoutTrap();
            }
        }
    }
});

Crafty.c('Avatar', {
	init: function() {
		this.requires('Actor');
	},

	headJitter : 3,

	ballOffsetXLeft : -5,
	ballOffsetXRight : 45,
	ballOffsetY : 80,
    isPassed: false,
	bodyRunPos : {
				x : (PlayerConfig.joints.head.x - PlayerConfig.joints.body_run.x) / 2,
				y : (PlayerConfig.joints.head.y - PlayerConfig.joints.body_run.y) / 2
				},

	bodyTacklePos : {
				x : (PlayerConfig.joints.head.x - PlayerConfig.joints.body_tackle.x) / 2,
				y : (PlayerConfig.joints.head.y - PlayerConfig.joints.body_tackle.y) / 2
				},

	bodyFallOnGroundPos : {
				x : (PlayerConfig.joints.head.x - PlayerConfig.joints.body_ground.x) / 2,
				y : (PlayerConfig.joints.head.y - PlayerConfig.joints.body_ground.y) / 2
				},

	width : function() {
		return this.head._w;
	},
	
	height : function() {
		return this.body._h + this.bodyRunPos.y;
	},

	Avatar: function(basicDepth, headConfig, bodyConfig, ball) {
		var self = this;

        self.basicDepth = basicDepth;
		self.head = Crafty.e('Head').Head(headConfig);
		self.head.attr({
                    w : self.head._w / 2, 
					h : self.head._h / 2, 
					z : basicDepth + Game.depth.head});
		self.body = Crafty.e('Body').Body(bodyConfig);
		self.body.attr({
					w : self.body._w / 2, 
					h : self.body._h / 2, 
					z : basicDepth + Game.depth.body});
		self.attach(self.head);
		self.attach(self.body);
		self.run();

		if (ball)
		{
            self.attachBall(ball);
		}

		self.body.bind('FrameChange', function(data) {
			if (data.id === 'Run' || data.id === 'Idle')
			{
				if (data.currentFrame == 1 || data.currentFrame == 3)
				{
					self.head.attr({x : self._x, y: self._y - self.headJitter});
				}
				else
				{
					self.head.attr({x : self._x, y: self._y});
				}
				
				if (data.id === 'Idle' && data.currentFrame == 1)
				{
                    self.changeDirection();
				}
			}
		});
		
		self.faceLeft();
	
        self.halfBoundBox = new Crafty.polygon(
                [20,80], 
				[self.width() - 20, 80], 
				[self.width() - 20, self.height() - 10], 
				[20, self.height() - 10]);

		return self;
	},

    attachBall : function(ball) {
		if (ball)
		{
            var self = this;
			self.ball = ball;
            self.attach(self.ball);

			self.ball.attr(
				{ x : self._x + (self.facingLeft ? self.ballOffsetXLeft : self.ballOffsetXRight),
                  y : self._y + self.ballOffsetY,
                  z : self.basicDepth + Game.depth.ball
				});
			self.ball.setPlayer(self);
			self.ball.startRolling();
		}
    },

    detachBall : function() {
        self.ball = null;
    },

    standby : function() {
        this.run();
        this.body.standby();
        if (this.ball)
        {
            this.ball.trap();
        }
    },
    
    idle: function() {
        this.body.idle();
    },

    kickBall: function(kickForce, direction) {
        var self = this;
        self.body.kick(function() {
            if (self.ball)
            {
                self.ball.kick(kickForce, direction);
            }
        });
    },

	run : function() {
		this.isRunning = true;
		this.body.run();
		this.body.attr({
					x : this._x + this.bodyRunPos.x,
					y : this._y + this.bodyRunPos.y,
		});
		this.head.setNormal();
	},

	tackle : function() {
		if (this.ball)
		{
			// not allow to tackle when player is dribbling
			return;
		}
		this.isRunning = false;
		this.body.tackle();
		this.body.attr({
					x : this._x + this.bodyTacklePos.x,
					y : this._y + this.bodyTacklePos.y,
		});
		this.head.setKiss();
	},

    fallOnGround : function() {
        if (this.ball)
        {
			// not allow to fall when player is dribbling
			return;
        }
        this.isRunning = false;
        this.isFellOnGround = true;
        this.body.fallOnGround();
        this.body.attr({
					x : this._x + this.bodyFallOnGroundPos.x,
					y : this._y + this.bodyFallOnGroundPos.y,
        });
        this.head.setKiss();
    },

	faceLeft: function() {
		this.body.unflip('X');
		this.head.unflip('X');
		if (this.isRunning)
		{
			this.body.x = this._x + this.bodyRunPos.x;
        }
		if (this.ball)
		{
			this.ball.x = this._x + this.ballOffsetXLeft;
			this.ball.setRollingDirection(-1);
		}
		this.facingLeft = true;
	},

	faceRight: function() {
		this.body.flip('X');
		this.head.flip('X');
		this.body.x = this._x;
		if (this.ball)
		{
			this.ball.x = this._x + this.ballOffsetXRight;
			this.ball.setRollingDirection(1);
		}
		this.facingLeft = false;
	},
	
	changeDirection : function() {
        if (this.facingLeft)
        {
            this.faceRight();
        }	
        else
        {
            this.faceLeft();
        }
        
	},
    standUpAndRun: function() {
        if ( this.isWandering && this.isFellOnGround) {
            this.run();
        }        
    },
	wander : function(wanderSpeed, deltaTime) {
        if (!this.centerX ) 
		{
			this.centerX = this._x;
		}
		else
		{
			if (this.facingLeft)
			{
				if ( this._x < this.centerX - this.wanderDistance  )
				{
					this.x = this.centerX - this.wanderDistance;
					this.faceRight();
					this.standUpAndRun();
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
					this.faceLeft();
					this.standUpAndRun();
				}
				else
				{
					this.x += wanderSpeed * deltaTime;
				}
			}
		}
	},


	pauseAnim: function() {
		this.body.pauseAnimation();
	}, 
	
	changeDepth: function(newDepth) {
        this.head.z = newDepth + Game.depth.head;
		this.body.z = newDepth + Game.depth.body;
	}
});

// This is the player-controlled character for dribble game
Crafty.c('DribbleController', {
	init: function() {
		this.requires('Actor, Draggable, DebugArea')
				.attr({w: 80, h: 180, z: Game.depth.controller});

        this.ball = Crafty.e('Ball');
		this.avatar = Crafty.e('Avatar')
				.Avatar(Game.depth.controller, PlayerConfig.head_configs.messi, PlayerConfig.body_configs.messi, this.ball);
		var ballWidth = this.avatar.ball._w;
		var ballHeight = this.avatar.ball._h;
		this.avatar.head.setNormal();
		this.avatar.ball.requires('Collision, DebugCollision')
            .collision([5, ballHeight - 5], [ballWidth - 5, ballHeight - 5], [ballWidth - 5, 5], [5, 5])
				.onHit('Obstacle', this.hitComponent)
				.onHit('Coin', this.hitComponent)
				.onHit('Amateur', this.hitComponent)
				.onHit('WorldClass', this.hitComponent)
				.onHit('Rabbit', this.hitComponent);

		this.attach(this.avatar);
		this.bottomLine = Game.height - 110;

		this.bind('StartDrag', function(data) {
			this.lastDragX = this._x;
			this.faceLeftFrame = 0;
			this.faceRightFrame = 0;
		});

		this.bind('Dragging', function(data) {
			// clamp player in the field
			if (this._x < Game.player_bound_left()) 
			{
				this.x = Game.player_bound_left();
			}
			else if (this._x > Game.player_bound_right() - this.avatar.width()) 
			{
				this.x = Game.player_bound_right() - this.avatar.width();
			}
			if ( this._y < 20 ) {
                this.y = 20;
			}
            if ( this._y > this.bottomLine ) {
                this.y = this.bottomLine;
            }
			// detect player direction based on dragging
			if (this._x > this.lastDragX)
			{
				this.faceLeftFrame = 0;
				++this.faceRightFrame;
				if (this.faceRightFrame > 3)
				{
					this.avatar.faceRight();
				}
			}
			else if (this._x < this.lastDragX)
			{
				this.faceRightFrame = 0;
				++this.faceLeftFrame;
				if (this.faceLeftFrame > 3)
				{
					this.avatar.faceLeft();
				}
			}

			this.lastDragX = this._x;
		});
	},

	hitComponent: function(data) {
		// 'this' would be the ball in this function
		var component = data[0].obj;
		if (component.onPlayerHit(this))
		{
			this.player.ball.visible = false;
			this.player.head.setCry();
			Game.pause();
			Game.events.onGameOver();
		}
	}
});

Crafty.c('Obstacle', {
	speed: Game.configs.player_vertical_speed_per_frame,

	width: function() {
		return this._w;
	},

	height: function() {
		return this._h;
	},

	init: function() {
		this.requires('Actor, SpriteObstacle, Collision, DebugCollision')
			.attr({ w: 75, h: 77.5 })
			.collision( new Crafty.polygon([37.5, 30], [60, 70], [15, 70]) );
	},

	update: function(player, deltaTime) {
		this.y += this.speed * deltaTime;
	},

	onDisappear : function(player) {
		++Game.data.num_of_passed_obstacle;
		Game.events.onPassObstacle(Game.data.num_of_passed_obs);
	},

	onPlayerHit: function(player) {
		return true;
	}
});

Crafty.c('Coin', {
	speed: Game.configs.player_vertical_speed_per_frame,

	width: function() {
    return this._w;
	},

	height : function() {
		return this._h;
	},

	init : function() {
        this.requires('Actor, SpriteHS, Collision, DebugCollision')
        .attr({ w: this._w / 2, h: this._h / 2});
	},

	update : function(player, deltaTime) {
        this.y += this.speed * deltaTime;
	},

	onPlayerHit : function(player) {
		++Game.data.num_of_collected_coins;
		Game.events.onCollectCoin(Game.data.num_of_collected_coins);
        this.destroy();
		return false;
	}
});
Crafty.c('CoinPack', {
	speed: Game.configs.player_vertical_speed_per_frame,

	width: function() {
    return this._w;
	},

	height : function() {
		return this._h;
	},

	init : function() {

        this.requires('Actor, SpritePack, Collision, DebugCollision, SpriteAnimation')
        .attr({ w: this._w , h: this._h})
        .reel('Floating', 800, [[0,0],[1,0],[2,0],[1,0]]);
        
        this.animate('Floating', -1);
	},
    floating: function() {
        this.animate('Floating', -1);
	},
	

	onPlayerHit : function(player) {
		++Game.data.num_of_collected_coins;
		Game.events.onCollectCoin(Game.data.num_of_collected_coins);
        this.destroy();
		return false;
	}
});
Crafty.c('Amateur', {
	verticalSpeed: Game.configs.player_vertical_speed_per_frame + Game.configs.amateur_vertical_speed_per_frame,
	horizontalSpeed: Game.configs.amateur_horizontal_speed_per_frame,

	wanderDistance : 80,

	init: function() {
		this.requires('Avatar, Collision, DebugCollision, DebugArea')
				.attr({w: 80, h: 120});
	},

	Amateur : function(headConfig, bodyConfig) {
		this.Avatar(Game.depth.npc, headConfig, bodyConfig, false);
		this.collision(this.halfBoundBox);

		var seed = Math.floor(Crafty.math.randomNumber(0, 100));
		if (seed % 2 === 0)
		{
			this.faceRight();
		}

		return this;
	},
	
	pingpong : function(t, length) {
		var length_x2 = 2 * length;	
		var n = t % length_x2;
		return n < length ? n : length_x2 - n;
	},

	update: function(player, deltaTime, frame) {
		this.y += this.verticalSpeed * deltaTime;
		this.wander(this.horizontalSpeed, deltaTime);
		
		if ( !this.isPassed && player._y < this._y ) {
            this.onPassed(player);
		}
	},

    onPassed: function(player) {
        this.isPassed = true;
        this.changeDepth( Game.depth.passed);
        ++Game.data.num_of_passed_amateurs;
        Game.events.onPassAmateur(Game.data.num_of_passed_amateurs);
    },
	onDisappear : function(player) {
		
	},

	onPlayerHit: function(player) {
		return true;
	}
});

Crafty.c('WorldClass', {
	verticalSpeed: Game.configs.player_vertical_speed_per_frame + Game.configs.worldclass_vertical_speed_per_frame,
	horizontalSpeed: Game.configs.worldclass_horizontal_speed_per_frame,
	tackleSpeed: Game.configs.worldclass_tackle_horizontal_speed_per_frame ,

	wanderDistance : 80,
	distanceToTackle : 50,

	init: function() {
		this.requires('Avatar, Collision, DebugCollision, DebugArea')
				.attr({w: 80, h: 120});
	},

	WorldClass : function(headConfig, bodyConfig) {
		this.Avatar(Game.depth.npc, headConfig, bodyConfig, false);
		this.collision(this.halfBoundBox);

		var seed = Math.floor(Crafty.math.randomNumber(0, 100));
		if (seed % 2 === 0)
		{
			this.faceRight();
		}

		return this;
	},

	update: function(player, deltaTime) {
		this.y += this.verticalSpeed * deltaTime;

		if (this.isRunning)
		{
			this.wander(this.horizontalSpeed, deltaTime);

			if (player._y - this._y < this.distanceToTackle)
			{
				this.tackle();
				if (player._x < this._x)
				{
					this.faceLeft();
				}
				else
				{
					this.faceRight();
				}
			}
		}
		else
		{
			this.x += this.tackleSpeed * deltaTime * (this.facingLeft ? -1 : 1);
		}
		if ( !this.isPassed && player._y < this._y ) {
            this.onPassed(player);
		}
	},
    onPassed: function(player) {
        this.isPassed = true;
        this.changeDepth( Game.depth.passed);
        ++Game.data.num_of_passed_amateurs;
        Game.events.onPassWorldClass(Game.data.num_of_passed_amateurs);
    },
	onDisappear : function(player) {

	},

	onPlayerHit: function(player) {
		return true;
	}
});

Crafty.c('Rabbit', {
	verticalSpeed: Game.configs.player_vertical_speed_per_frame + Game.configs.rabbit_vertical_speed_per_frame,
	horizontalSpeed: Game.configs.rabbit_horizontal_speed_per_frame,
	traceSpeed: Game.configs.rabbit_trace_speed_per_frame,

	wanderDistance : 30,
	distanceToTrace : 200,
    distanceToTackle : 50,

    isTracing : false,
    faceLeftFrame : 0,
    faceRightFrame : 0,

	init: function() {
		this.requires('Avatar, Collision, DebugCollision, DebugArea')
				.attr({w: 80, h: 120});
	},

	Rabbit : function(headConfig, bodyConfig) {
		this.Avatar(Game.depth.npc, headConfig, bodyConfig, false);
		this.collision(this.halfBoundBox);

		var seed = Math.floor(Crafty.math.randomNumber(0, 100));
		if (seed % 2 === 0)
		{
			this.faceRight();
		}

        this.isTracing = false;

		return this;
	},

	update: function(player, deltaTime) {
		if (!this.isTracing)
		{
            this.y += this.verticalSpeed * deltaTime;
			this.wander(this.horizontalSpeed, deltaTime);

			if (player._y - this._y < this.distanceToTrace)
			{
                this.isTracing = true;
				if (player._x < this._x)
				{
					this.faceLeft();
				}
				else
				{
					this.faceRight();
				}
			}
		}
		else
		{
            

            if (!this.isPassed)
            {
                this.y += (this.traceSpeed + this.verticalSpeed) * deltaTime;
                this.x += this.traceSpeed * deltaTime * (this.facingLeft ? -1 : 1);
                this.trace(player, deltaTime);

                if (this.isRunning && player._y - this._y < this.distanceToTackle)
                {
                    this.tackle();
                }
            }
            else
            {   
                this.y += this.verticalSpeed * deltaTime;
                this.x += this.traceSpeed * deltaTime * (this.facingLeft ? -1 : 1);
                 
                if (!this.isRunning)
                {
                    this.run();
                }
            }
		}

		if ( !this.isPassed && player._y - this._y < -this.distanceToTackle / 2 ) 
        {
            this.onPassed(player);
		}
	},

    trace: function(player, deltaTime) {
        if (player._x < this._x)
        {
            this.faceRightFrame = 0;
            ++this.faceLeftFrame;
            if (this.faceLeftFrame > 3)
            {
                this.faceLeft();
            }
        }
        else
        {
            this.faceLeftFrame = 0;
            ++this.faceRightFrame;
            if (this.faceRightFrame > 3)
            {
                this.faceRight();
            }
        }
    },

    onPassed: function(player) {
        this.isPassed = true;
        this.changeDepth( Game.depth.passed);
        ++Game.data.num_of_passed_amateurs;
        Game.events.onPassWorldClass(Game.data.num_of_passed_amateurs);
    },
              
	onDisappear : function(player) {

	},

	onPlayerHit: function(player) {
		return true;
	}
});

Crafty.c('Field', {
	tileWidth  : 320,

	tileHeight : 145,

    isAnimating : false,

    numOfTilesPerRow : 2,

    numOfTilesPerColumn : 10,

    numOfTilesHalfColumn : 5,

	init: function() {
		var self = this;

		self.requires('Actor');

		self.group1 = Crafty.e('Actor');
		self.group2 = Crafty.e('Actor');

		self.numOfTilesPerRow = Math.ceil(Game.width / self.tileWidth);
		self.numOfTilesPerColumn = Math.ceil(Game.height / self.tileHeight) * 2;
		self.numOfTilesHalfColumn = self.numOfTilesPerColumn / 2;

		for (var i = 0; i < self.numOfTilesPerColumn; i++)
		{
			var group = i < self.numOfTilesHalfColumn ? self.group1 : self.group2;

			for (var j = 0; j < self.numOfTilesPerRow; j++)
			{
				var tile = Crafty.e('Actor, SpriteGrass').attr(
				{
                    w : self.tileWidth,
                    h : self.tileHeight,
                    x : j * self.tileWidth,
                    y : (i % self.numOfTilesHalfColumn) * self.tileHeight,
                    z : Game.depth.field });
                    group.attach(tile);
                }
		}

		self.group2.y = this.group1.y - self.tileHeight * self.numOfTilesHalfColumn;
	},

    keepInViewport : function() {
        var self = this;
        if (self.group1._y + Crafty.viewport._y > Game.height)
        {
            self.group1.y = self.group2.y - self.tileHeight * self.numOfTilesHalfColumn;
        }
        else if (self.group2._y + Crafty.viewport._y > Game.height)
        {
            self.group2.y = self.group1.y - self.tileHeight * self.numOfTilesHalfColumn;
        }
    },

    startAnimating : function() {
        if (!this.isAnimating)
        {
            this.isAnimating = true;
            this.bind('EnterFrame', this.keepAnimating);
        }
    },

    stopAnimating: function() {
        if (this.isAnimating)
        {
            this.isAnimating = false;
            this.unbind('EnterFrame', this.keepAnimating);
        }
    },

    keepAnimating: function(data) {
        this.moveY(Game.configs.player_vertical_speed_per_frame * data.dt / 1000);
    },

    moveY : function(delta) {
        var self = this;
        self.group1.y += delta;
        self.group2.y += delta;
        if (self.group1.y > Game.height)
        {
            self.group1.y = self.group2.y - self.tileHeight * self.numOfTilesHalfColumn;
        }
        else if (self.group2.y > Game.height)
        {
            self.group2.y = self.group1.y - self.tileHeight * self.numOfTilesHalfColumn;
        }
    }
});

});
