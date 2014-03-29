define(["crafty", "games/game", "games/player-config"],
function (Crafty, Game, PlayerConfig) {

Crafty.scene('Over', function() {
    Game.pause();
	Game.events.onGameOver();


});

});
