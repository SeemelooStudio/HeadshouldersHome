define(["crafty", "games/game", "games/player-config", "img/heads", "img/bodies"],
function (Crafty, Game, PlayerConfig, headsAtlas, bodiesAtlas) {

var loadAtlas = function(imageFileName, atlas) {
	var sprites = {};
	for (var spriteName in atlas.frames) 
	{
		frame = atlas.frames[spriteName].frame;
		sprites[spriteName] = [frame.x, frame.y, frame.w, frame.h];
	}

	Crafty.sprite(imageFileName, sprites);
 };

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
	//  takes a noticeable amount of time to load
	Crafty.load([
		'app/img/obstacle.png',
		'app/img/heads.png',
		'app/img/bodies.png',
		'app/img/ball.png',
		'app/img/grass.png',
		'app/img/hs.png'
		], function(){
		// Once the images are loaded...

		Crafty.sprite(150, 155, 'app/img/obstacle.png', {
			SpriteObstacle:    [0, 0],
		});

		Crafty.sprite(150, 150, 'app/img/heads.png', {
			HeadDefault: [0, 0],
		});

		Crafty.sprite(140, 110, 'app/img/bodies.png', {
			BodyMessi:     [1, 1],
			BodyAmateur:   [1, 2],
			BodyPro:       [1, 0],
			BodyRabbit:    [0, 1]
		});

		Crafty.sprite(320, 145, 'app/img/grassx4.png', {
			SpriteGrass:    [0, 0],
		});

		Crafty.sprite(35, 'app/img/ball.png', {
			SpriteBall:     [0, 0],
		});

		Crafty.sprite(110, 200, 'app/img/hs.png', {
			SpriteHS:     [0, 0],
		});

		//loadAtlas('app/img/heads.png', headsAtlas);
        
        Game.events.onLoadComplete();
		// Now that our sprites are ready to draw, start the game
		Crafty.scene('Game');
	});
});

});
