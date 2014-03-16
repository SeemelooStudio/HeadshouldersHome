define(["crafty", "games/game", "games/player-config"],
function (Crafty, Game, PlayerConfig) {
Crafty.scene('Over', function() {
	// Display some text in game-over screen 
	Crafty.e('2D, DOM, Text')
		.attr({ x: 0, y: Game.height/2 - 24, w: Game.width });

	// restart the game when a key is pressed
	this.restart_game = function() {
		Crafty.scene('Game');
	};

	Crafty.bind('KeyDown', this.restart_game);
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('KeyDown', this.restart_game);
});

});