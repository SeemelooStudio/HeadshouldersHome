define(["crafty", "games/game", "games/player-config"],
function (Crafty, Game, PlayerConfig) {
// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
		.text('Loading; please wait...')
		.attr({ x: 0, y: Game.height/2 - 24, w: Game.width });
	// Load our sprite map image
	Crafty.load([
		'app/img/obstacle.png',
		'app/img/head.png',
		'app/img/body.png',
		'app/img/ball.png',
		'app/img/grass.png',
		], function(){
		// Once the images are loaded...

		Crafty.sprite(150, 155, 'app/img/obstacle.png', {
			SpriteObstacle:    [0, 0],
		});

		Crafty.sprite(150, 'app/img/head.png', {
			SpriteMessi:	[1, 0],
			SpriteNeymar:   [0, 0],
		});

		Crafty.sprite(150, 256, 'app/img/body.png', {
			SpriteBlue:     [1, 0],
			SpriteYellow:   [4, 0],
		});

		Crafty.sprite(80, 145, 'app/img/grass.png', {
			SpriteGrass:    [0, 0],
		});

		Crafty.sprite(35, 'app/img/ball.png', {
			SpriteBall:     [0, 0],
		});

		// Now that our sprites are ready to draw, start the game
		Crafty.scene('Game');
	});
});

});
