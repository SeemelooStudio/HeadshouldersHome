define(["crafty", "games/game", "games/player-config"],
function (Crafty, Game, PlayerConfig) {
// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
	var self = this;

	self.components = [];
	self.toBeRemoved = [];

	self.generateHazard = function() {
		var component;
		var seed = Math.floor(Crafty.math.randomNumber(0, 100));
		if (seed % 3 !== 0)
		{
			//component = Crafty.e('Obstacle');
			component = Crafty.e('Coin');
		}
		else
		{
			component = Crafty.e('Amateur').Amateur(PlayerConfig.head_configs.sushi, PlayerConfig.body_configs.amateur);
		}
		seed = Math.floor(Crafty.math.randomNumber(0, PlayerConfig.worldclass_players.length));
		var head = PlayerConfig.worldclass_players[seed];
		component = Crafty.e('WorldClass').WorldClass(head, PlayerConfig.body_configs.pro);
		component.attr({x : Crafty.math.randomNumber(0, Game.width - component.width()), y : -50});
		self.components.push(component);
	};

	self.destroyHazardsOffScreen = function() {
		for (var i = 0; i < self.components.length; i++)
		{
			var component = self.components[i];	
			if (component._y > Game.height)
			{
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

	self.destroyAllHazards = function() {
		for (var i = 0; i < self.components.lenght; i++)
		{
			self.components[i].destroy();
		}
		self.components = [];
	};

	self.onEnterFrame = function(data) {
		self.destroyHazardsOffScreen();

		for( var i = 0; i < self.components.length; i++)
		{
			self.components[i].update(self.player, data.dt / 1000, data.frame);
		}
	};

	self.player = Crafty.e('PlayerController');
	self.player.attr({ x : Game.width / 2 - self.player.avatar.width() / 2, 
					   y : Game.height - self.player.avatar.height() * 1.5 });

	self.field = Crafty.e('Field');
	self.generateHazardRoutine = setInterval(self.generateHazard, Game.configs.component_generate_interval);
	self.bind('EnterFrame', self.onEnterFrame);
}, 
function() { 
	var self = this;

	clearInterval(self.generateHazardRoutine);
	self.destroyAllHazards();
	self.unbind('EnterFrame', self.onEnterFrame);
});

});
