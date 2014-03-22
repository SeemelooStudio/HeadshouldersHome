define(["crafty", "games/game", "games/player-config"],
function (Crafty, Game, PlayerConfig) {
// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
	var self = this;

	self.hazards = [];
	self.toBeRemoved = [];

	self.generateHazard = function() {
		if (Crafty.isPaused())
		{
			return;
		}
		var seed = Math.floor(Crafty.math.randomNumber(0, 100));
		var hazard;
		if (seed % 3 !== 0)
		{
			hazard = Crafty.e('Obstacle');
		}
		else
		{
			hazard = Crafty.e('Amateur').Amateur(PlayerConfig.head_configs.sushi, PlayerConfig.body_configs.amateur);
		}
		hazard.attr({x : Crafty.math.randomNumber(0, Game.width - hazard.width()), y : -50});
		self.hazards.push(hazard);
	};

	self.destroyHazardsOffScreen = function() {
		for (var i = 0; i < self.hazards.length; i++)
		{
			var hazard = self.hazards[i];	
			if (hazard._y > Game.height)
			{
				self.toBeRemoved.push(hazard);
			}
		}
		for ( i = 0; i < self.toBeRemoved.length; i++)
		{
			var index = self.hazards.indexOf(self.toBeRemoved[i]);
			if (i != -1)
			{
				self.hazards.splice(i, 1);
			}
			self.toBeRemoved[i].destroy();
		}
		self.toBeRemoved = [];
	};

	self.destroyAllHazards = function() {
		for (var i = 0; i < self.hazards.lenght; i++)
		{
			self.hazards[i].destroy();
		}
		self.hazards = [];
	};

	self.onEnterFrame = function(data) {
		self.destroyHazardsOffScreen();

		for( var i = 0; i < self.hazards.length; i++)
		{
			self.hazards[i].update(self.player, data.dt / 1000, data.frame);
		}
	};

	self.player = Crafty.e('PlayerController');
	self.player.attr({ x : Game.width / 2 - self.player.avatar.width() / 2, 
					   y : Game.height - self.player.avatar.height() });

	self.field = Crafty.e('Field');
	self.generateHazardRoutine = setInterval(self.generateHazard, Game.configs.hazard_generate_interval);
	self.bind('EnterFrame', self.onEnterFrame);
}, 
function() { 
	var self = this;

	clearInterval(self.generateHazardRoutine);
	self.destroyAllHazards();
	self.unbind('EnterFrame', self.onEnterFrame);
});

});
