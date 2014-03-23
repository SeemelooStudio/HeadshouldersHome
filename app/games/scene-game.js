define(["crafty", "games/game", "games/player-config", "games/object-randomizer"],
function (Crafty, Game, PlayerConfig, ObjectRandomizer) {

// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
	var self = this;

	self.components = [];
	self.toBeRemoved = [];
	self.numOfComponentsGenerated = 0;

	self.resetGame = function() {
		self.numOfComponentsGenerated = 0;
		self.destroyAllComponents();
	},

	self.obstacleCreator = function() {
		return Crafty.e('Obstacle');
	};
	self.coinCreator = function() {
		return Crafty.e('Coin');
	};
	self.amateurCreator = function() {
		return Crafty.e('Amateur').Amateur(PlayerConfig.head_configs.sushi, PlayerConfig.body_configs.amateur);
	};
	self.worldclassCreator = function() {
		var seed = Math.floor(Crafty.math.randomNumber(0, PlayerConfig.worldclass_players.length));
		var head = PlayerConfig.worldclass_players[seed];
		return Crafty.e('WorldClass').WorldClass(head, PlayerConfig.body_configs.worldclass);
	};

	self.randomizerStep1 = Crafty.e('ObjectRandomizer').ObjectRandomizer(
			[self.obstacleCreator, self.amateurCreator, self.coinCreator],
			[0.2, 0.78])
	self.randomizerStep2 = Crafty.e('ObjectRandomizer').ObjectRandomizer(
			[self.obstacleCreator, self.amateurCreator, self.worldclassCreator, self.coinCreator],
			[0.2, 0.35, 0.4])

	self.generateComponent = function() {
		var component;
		if (self.numOfComponentsGenerated < 3)
		{
			component = self.obstacleCreator();
		}
		else if (self.numOfComponentsGenerated < 10)
		{
			component = self.randomizerStep1.get()();
		}
		else
		{
			component = self.randomizerStep2.get()();
		}
		component.attr({x : Crafty.math.randomNumber(0, Game.width - component.width()), y : -50});
		self.components.push(component);
		++self.numOfComponentsGenerated;
	};

	self.destroyComponentsOffScreen = function() {
		for (var i = 0; i < self.components.length; i++)
		{
			var component = self.components[i];	
			if (component._y > Game.height)
			{
				if (component.onDisappear != null)
				{
					component.onDisappear(self.player);
				}
				self.toBeRemoved.push(component);
			}
		}
		for ( i = 0; i < self.toBeRemoved.length; i++)
		{
			var index = self.components.indexOf(self.toBeRemoved[i]);
			if (i != -1)
			{
				self.components.splice(i, 1);
			}
			self.toBeRemoved[i].destroy();
		}
		self.toBeRemoved = [];
	};

	self.destroyAllComponents= function() {
		for (var i = 0; i < self.components.lenght; i++)
		{
			self.components[i].destroy();
		}
		self.components = [];
	};

	self.onEnterFrame = function(data) {
		self.destroyComponentsOffScreen();

		for( var i = 0; i < self.components.length; i++)
		{
			if (self.components[i].update != null)
			{
				self.components[i].update(self.player, data.dt / 1000, data.frame);
			}
		}
	};

	self.player = Crafty.e('PlayerController');
	self.player.attr({ x : Game.width / 2 - self.player.avatar.width() / 2, 
					   y : Game.height - self.player.avatar.height() * 1.5 });

	self.field = Crafty.e('Field');
	self.generateComponentRoutine = setInterval(self.generateComponent, Game.configs.component_generate_interval);
	self.bind('EnterFrame', self.onEnterFrame);
}, 
function() { 
	var self = this;

	clearInterval(self.generateComponentRoutine);
	self.resetGame();
	self.unbind('EnterFrame', self.onEnterFrame);
});

});
