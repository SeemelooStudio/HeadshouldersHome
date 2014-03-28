define(["crafty", "games/game", "games/player-config"],
function (Crafty, Game, PlayerConfig) {
var InitComponents = function() {
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

Crafty.c('Avatar', {
	init: function() {
		this.requires('Actor');
	},

	headJitter : 3,

	ballOffsetXLeft : -5,
	ballOffsetXRight : 45,
	ballOffsetY : 80,
	ballSpinSpeed : 0.3,
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

	Avatar: function(basicDepth, headConfig, bodyConfig, withBall) {
		var self = this;

		self.head = Crafty.e('Actor, ' + headConfig.sprite);
		self.head.attr({w : self.head._w / 2, h : self.head._h / 2, z : basicDepth + Game.depth.head});
		self.body = Crafty.e('Body').Body(bodyConfig);
		self.body.attr({
					w : self.body._w / 2, 
					h : self.body._h / 2, 
					z : basicDepth + Game.depth.body});
		self.attach(self.head);
		self.attach(self.body);
		self.run();

		if (withBall)
		{
			self.ball = Crafty.e('Actor, Tween, SpriteBall').attr(
				{ x : self.ballOffsetXLeft,
                  y : self.ballOffsetY,
                  z : basicDepth + Game.depth.ball
				});
			self.ball.origin('center');
			self.attach(self.ball);
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
		
		self.bind('EnterFrame', self.onEnterFrame);
		self.facingLeft = true;
	
		self.fullBoundBox = new Crafty.polygon(
				[20,10], 
				[self.width() - 20, 10], 
				[self.width() - 20, self.height() - 10], 
				[20, self.height() - 10]);
        self.halfBoundBox = new Crafty.polygon(
                [20,80], 
				[self.width() - 20, 80], 
				[self.width() - 20, self.height() - 10], 
				[20, self.height() - 10]);

		return self;
	},

	onEnterFrame : function(data) {
		if (this.ball)
		{
			this.ball.rotation += this.ballSpinSpeed * data.dt * (this.facingLeft ? -1 : 1);
		}
	},
	
	run : function() {
		this.isRunning = true;
		this.body.run();
		this.body.attr({
					x : this._x + this.bodyRunPos.x,
					y : this._y + this.bodyRunPos.y,
		});
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
Crafty.c('PlayerController', {
	init: function() {
		this.requires('Actor, Draggable, DebugArea')
				.attr({w: 80, h: 180, z: Game.depth.controller});

		this.avatar = Crafty.e('Avatar, Collision, DebugCollision')
				.Avatar(Game.depth.controller, PlayerConfig.head_configs.messi, PlayerConfig.body_configs.messi, true)
				.onHit('Obstacle', this.hitComponent)
				.onHit('Coin', this.hitComponent)
				.onHit('Amateur', this.hitComponent)
				.onHit('WorldClass', this.hitComponent);

		this.avatar.collision(this.avatar.halfBoundBox);

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
		var component = data[0].obj;
		component.onPlayerHit(this);
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
			.collision( new Crafty.polygon([10, 40], [65, 40], [65,77.5], [10,77.5]) )
			.attr({ w: 75, h: 77.5 });
	},

	update: function(player, deltaTime) {
		this.y += this.speed * deltaTime;
	},

	onDisappear : function(player) {
		++Game.data.num_of_passed_obstacle;
		Game.events.onPassObstacle(Game.data.num_of_passed_obstacle);
	},

	onPlayerHit: function(player) {
		//this.destroy();
		Game.events.onGameOver();
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
		//this.destroy();
		Game.events.onGameOver();
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

		if (player._y - this._y < this.distanceToTackle)
		{
			if (this.isRunning)
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
			this.x += this.tackleSpeed * deltaTime * this.facingLeft ? -1 : 1;
		}
		else
		{
			this.wander(this.horizontalSpeed, deltaTime);
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
		//this.destroy();
		Game.events.onGameOver();
	}
});

Crafty.c('Field', {
	tileWidth  : 80,

	tileHeight : 145,

	moveSpeed : 5,

	init: function() {
		var self = this;

		self.requires('Actor');

		self.group1 = Crafty.e('Actor');
		self.group2 = Crafty.e('Actor');

		var numOfTilesPerRow = Math.ceil(Game.width / self.tileWidth);
		var numOfTilesPerColumn = 10;
		var numOfTilesHalfColumn = numOfTilesPerColumn / 2;
		console.log(numOfTilesPerRow);

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
};
return InitComponents;
});
