define(["crafty", "games/game", "games/player-config"],
function (Crafty, Game, PlayerConfig) {

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

    var imgPath = 'app/img/';

    if (typeof g_imagePath !== 'undefined')
    {
        imgPath = g_imagePath;
    }

	//  takes a noticeable amount of time to load
	Crafty.load([
		imgPath + 'obstacle.png',
		imgPath + 'heads.png',
		imgPath + 'bodies.png',
		imgPath + 'ball.png',
		imgPath + 'grass.png',
		imgPath + 'hs.png',
        imgPath + 'ring.png',
        imgPath + 'pack.png',
        imgPath + 'gate.png',
        imgPath + 'sky.png'
		], function(){
		// Once the images are loaded...

		Crafty.sprite(150, 155, imgPath + 'obstacle.png', {
			SpriteObstacle:    [0, 0],
		});

		Crafty.sprite(150, 150, imgPath + 'heads.png', {
			HeadDefault: [0, 0],
		});

		Crafty.sprite(140, 110, imgPath + 'bodies.png', {
			BodyMessi:     [1, 1],
			BodyAmateur:   [1, 2],
			BodyPro:       [1, 0],
			BodyRabbit:    [0, 1]
		});

		Crafty.sprite(320, 145, imgPath + 'grassx4.png', {
			SpriteGrass:    [0, 0],
		});

		Crafty.sprite(35, imgPath + 'ball.png', {
			SpriteBall:     [0, 0],
		});

		Crafty.sprite(110, 200, imgPath + 'hs.png', {
			SpriteHS:     [0, 0],
		});

        Crafty.sprite(180, 180, imgPath + 'ring.png', {
            SpriteRing:   [0, 0]
        });
        
        Crafty.sprite(50, 80, imgPath + 'pack.png', {
            SpritePack:     [0, 0]
        });

        Crafty.sprite(316, 173, imgPath + 'gate.png', {
            SpriteGate:     [0, 0]
        });

        Crafty.sprite(120, 140, imgPath + 'sky.png', {
            SpriteSky:     [0, 0]
        });

		//loadAtlas('app/img/heads.png', headsAtlas);
        
        Game.events.onLoadComplete();
		// Now that our sprites are ready to draw, start the game
		Crafty.scene(Game.currentGameScene);
	});
});

});
