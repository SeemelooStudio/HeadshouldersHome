define(["crafty", "games/game", "games/player-config"],
function (Crafty, Game, PlayerConfig) {

Crafty.scene('Over', function() {
	Game.events.onGameOver();

	this.restart_game = function() {
		Crafty.scene('Game');
	};

	Crafty.bind('KeyDown', this.restart_game);
}, 
function() {
	this.unbind('KeyDown', this.restart_game);
});

});
