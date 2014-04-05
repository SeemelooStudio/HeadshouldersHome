define(["crafty", "games/game", "games/player-config"],
function (Crafty, Game, PlayerConfig) {
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
			.reel('Run', 550, bodyConfig.runFrames);
		if (bodyConfig.tackleFrames )
		{
			this.reel('Tackle', 550, bodyConfig.tackleFrames);
		}
		this.animate('Run', -1);
		return this;
	},

	run: function() {
        this.animate('Run', -1);
	},

	tackle: function() {
        this.animate('Tackle', -1);
	}
});

Crafty.c('Ball', {
	ballSpinSpeed : 0.3,

	init: function() {
		this.requires('Actor, Tween, SpriteBall').origin('center');
	},
	
	setOwner: function(owner) {
        this.owner = owner;
		this.owner.attach(this);
	},

	kick: function(kickForce) {
        if (this.owner)
		{
            this.owner.detach(this);
		}
	},

	setRollingDirection: function(direction) {
        this.rollingDirection = direction;
	},

	startRolling: function(){
		if (!this.isRolling)
		{
			this.bind('EnterFrame', this.onEnterFrame);
			this.rollingDirection = this.rollingDirection || 1;
			this.isRolling = true;
		}
	},

	stopRolling: function() {
		this.unbind('EnterFrame', this.onEnterFrame);
		this.isRolling = false;
	},

	onEnterFrame : function(data) {
		if (this.isRolling)
		{
			this.rotation += this.ballSpinSpeed * data.dt * this.rollingDirection;
		}
	},
	
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

	width : function() {
		return this.head._w;
	},
	
	height : function() {
		return this.body._h + this.bodyRunPos.y;
	},

	Avatar: function(basicDepth, headConfig, bodyConfig, ball) {
		var self = this;

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
			self.ball = ball;
			self.ball.attr(
				{ x : self.ballOffsetXLeft,
                  y : self.ballOffsetY,
                  z : basicDepth + Game.depth.ball
				});
			self.ball.setOwner(self);
			self.ball.startRolling();
		}

		self.body.bind('FrameChange', function(data) {
			if (self.isRunning)
			{
				if (data.currentFrame == 1 || data.currentFrame == 3)
				{
					self.head.attr({x : self._x, y: self._y - self.headJitter});
				}
				else
				{
					self.head.attr({x : self._x, y: self._y});
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

	wander : function(wanderSpeed, deltaTime) {
        if (!this.centerX ) 
		{
			this.centerX = this._x;
		}
		else
		{
			if (this.facingLeft)
			{
				if ( this._x < this.centerX - this.wanderDistance)
				{
					this.x = this.centerX - this.wanderDistance;
					this.faceRight();
				}
				else
				{
					this.x -= wanderSpeed * deltaTime;
				}
			}
			else
			{
				if ( this._x > this.centerX + this.wanderDistance)
				{
					this.x = this.centerX + this.wanderDistance;
					this.faceLeft();
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

// This is the player-controlled character
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
			this.owner.ball.visible = false;
			this.owner.head.setCry();
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
		Game.events.onPassObstacle(Game.data.num_of_passed_obstacle);
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
	traceSpeed: Game.configs.rabbit_trace_speed_per_frame ,

	wanderDistance : 30,
	distanceToTrace : 200,
    distanceToTackle : 100,

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
            this.y += (Game.configs.player_vertical_speed_per_frame) * deltaTime;
            this.x += this.traceSpeed * deltaTime * (this.facingLeft ? -1 : 1);

            if (!this.isPassed)
            {
                this.trace(player, deltaTime);

                if (this.isRunning && player._y - this._y < this.distanceToTackle)
                {
                    this.tackle();
                }
            }
            else
            {
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

	init: function() {
		var self = this;

		self.requires('Actor');

		self.group1 = Crafty.e('Actor');
		self.group2 = Crafty.e('Actor');

		var numOfTilesPerRow = Math.ceil(Game.width / self.tileWidth);
		var numOfTilesPerColumn = Math.ceil(Game.height / self.tileHeight) * 2;
		var numOfTilesHalfColumn = numOfTilesPerColumn / 2;
		console.log('football field [' + numOfTilesPerRow + 'x' + numOfTilesPerColumn + ']');

		for (var i = 0; i < numOfTilesPerColumn; i++)
		{
			var group = i < numOfTilesHalfColumn ? self.group1 : self.group2;

			for (var j = 0; j < numOfTilesPerRow; j++)
			{
				var tile = Crafty.e('Actor, SpriteGrass').attr(
				{
                    w : self.tileWidth,
                    h : self.tileHeight,
                    x : j * self.tileWidth,
                    y : (i % numOfTilesHalfColumn) * self.tileHeight,
                    z : Game.depth.field });
                    group.attach(tile);
                }
		}

		self.group2.y = this.group1.y - self.tileHeight * numOfTilesHalfColumn;

		self.bind('EnterFrame', function(data) {
			var delta = Game.configs.player_vertical_speed_per_frame * data.dt / 1000;
			this.group1.y += delta;
			this.group2.y += delta;
			if (this.group1.y > Game.height)
			{
				self.group1.y = this.group2.y - self.tileHeight * numOfTilesHalfColumn;
			}
			else if (this.group2.y > Game.height)
			{
				self.group2.y = this.group1.y - self.tileHeight * numOfTilesHalfColumn;
			}
		});
	},
});
});
