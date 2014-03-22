define(["crafty"],
function (Crafty) {
    var PlayerConfig = {};

    PlayerConfig.head_configs = {
        messi : {
            sprite : 'headMessi.png'
        },
        neymar : {
            sprite : 'headNeymar.png'
        },
        ozil : {
            sprite : 'headOzil.png'
        },
        ribery : {
            sprite : 'headRibery.png'
        },
        robben : {
            sprite : 'headRobben.png'
        },
        rooney : {
            sprite : 'headRooney.png'
        },
        suarez : {
            sprite : 'headSuarez.png'
        },
        sushi : {
            sprite : 'headSushi.png'
        },
    };

    PlayerConfig.body_configs = {
        messi : {
            sprite : 'BodyMessi',
            runFrames : [[0,2], [0,3], [1, 1], [0,3]]
        },
        amateur : {
            sprite : 'BodyAmateur',
            runFrames : [[1,2], [1,3], [2,2], [1,3]],
			tackleFrames : [[2, 1]]
        },
	 	pro : {
            sprite : 'BodyPro',
            runFrames : [[1,0], [2,0], [0,1], [2,0]],
			tackleFrames : [[0, 0]]
		},
    };

	PlayerConfig.joints = {
		head: { x : 80, y : 140 },
		body_run: { x : 70, y : 10 },
		body_tackle: { x : 85, y : 50 }
	};
    
    return PlayerConfig;
    }
);



