define(["crafty", "games/game", "games/player-config"],
function (Crafty, Game, PlayerConfig) {

// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
	//console.log("enter scene game");
	var self = this;

	self.components = [];
	self.toBeRemoved = [];
	self.numOfComponentsGenerated = 0;

	self.resetGame = function() {
		self.numOfComponentsGenerated = 0;
		self.elapsedTimeSinceLastGeneration = 0;
		self.destroyAllComponents();
	};

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
	self.rabbitCreator = function() {
		return Crafty.e('WorldClass').WorldClass(PlayerConfig.head_configs.rabbit, PlayerConfig.body_configs.rabbit);
	};

	//self.randomizerEven = Crafty.e('ObjectRandomizer').ObjectRandomizer(
			//[self.obstacleCreator, self.amateurCreator, self.worldclassCreator, self.coinCreator],
			//[0.32, 0.32, 0.32]);
	self.randomizerEven = Crafty.e('ObjectRandomizer').ObjectRandomizer(
			[self.obstacleCreator, self.amateurCreator, self.worldclassCreator]);
	self.randomizerStep1 = Crafty.e('ObjectRandomizer').ObjectRandomizer(
			[self.obstacleCreator, self.amateurCreator, self.coinCreator],
			[0.2, 0.78]);
	self.randomizerStep2 = Crafty.e('ObjectRandomizer').ObjectRandomizer(
			[self.obstacleCreator, self.amateurCreator, self.worldclassCreator, self.coinCreator],
			[0.2, 0.35, 0.4]);

	var generateSingleComponent = function() {
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
		component.attr({x : Crafty.math.randomNumber(Game.player_bound_left(), Game.player_bound_right() - component.width()), y : -50});
		self.components.push(component);
		++self.numOfComponentsGenerated;
	};

	var generateDoubleComponents = function() {
		var component1;
		var component2;
		var seed = self.numOfComponentsGenerated % 50;
		if (seed < 10)
		{
			if (seed < 2)
			{
				component1 = self.rabbitCreator();
				component2 = self.rabbitCreator();
			}
			else
			{
				component1 = self.coinCreator();
				component2 = self.coinCreator();
			}
		}
		else if( seed == 25 ){
            component1 = self.rabbitCreator();
			component2 = self.coinCreator();
		}
		else
		{
			component1 = self.randomizerEven.get()();
			component2 = self.randomizerEven.get()();
		}
		component1.attr({x : Crafty.math.randomNumber(Game.player_bound_left(), Game.width / 2 - component1.width()), 
                y : -50 + Crafty.math.randomNumber(-20, 20)});
		component2.attr({x : Crafty.math.randomNumber(Game.width / 2, Game.player_bound_right() - component2.width()), 
                y : -50 + Crafty.math.randomNumber(-20, 20)});
		self.components.push(component1);
		self.components.push(component2);
		self.numOfComponentsGenerated += 2;
	};

	self.generateComponent = function() {
		if (self.numOfComponentsGenerated < 15)
		{
            generateSingleComponent();
		}
		else
		{
			generateDoubleComponents();
		}
	};

	self.destroyComponentsOffScreen = function() {
		for (var i = 0; i < self.components.length; i++)
		{
			var component = self.components[i];	
			if (component._y > Game.height)
			{
				if (component.onDisappear)
				{
					component.onDisappear(self.player);
				}
				self.toBeRemoved.push(component);
			}
		}
		for ( i = 0; i < self.toBeRemoved.length; i++)
		{
			var index = self.components.indexOf(self.toBeRemoved[i]);
			if (index != -1)
			{
				self.components.splice(index, 1);
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
		self.elapsedTimeSinceLastGeneration += data.dt;
        if (self.elapsedTimeSinceLastGeneration >= Game.configs.component_generate_interval)
        {
			self.generateComponent();
			self.elapsedTimeSinceLastGeneration = 0;
		}

		for( var i = 0; i < self.components.length; i++)
		{
			if (self.components[i].update)
			{
				self.components[i].update(self.player, data.dt / 1000, data.frame);
			}
		}
		
		self.destroyComponentsOffScreen();
	};

	self.resetGame();
	self.player = Crafty.e('DribbleController');
	self.player.attr({ x : Game.width / 2 - self.player.avatar.width() / 2, 
        y : Game.height - self.player.avatar.height() * 1.5 });

	self.field = Crafty.e('Field');
	self.bind('EnterFrame', self.onEnterFrame);
}, 
function() { 
	var self = this;
	self.resetGame();
	self.unbind('EnterFrame', self.onEnterFrame);
});

});
