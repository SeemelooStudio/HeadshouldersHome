define(["crafty"],
function (Crafty) {
    var PlayerConfig = {};

    PlayerConfig.head_configs = {
        messi : {
            sprite : [2, 2],
			cry : [2, 1],
        },
        neymar : {
		    sprite : [1, 2]
        },
        ozil : {
            sprite : [1, 1] 
        },
        ribery : {
            sprite : [2, 0] 
        },
        robben : {
            sprite : [1, 0] 
        },
        rooney : {
            sprite : [0, 2] 
        },
        suarez : {
            sprite : [0, 1] 
        },
        sushi : {
            sprite : [0, 0] 
        },
    };

	PlayerConfig.worldclass_players = [
        PlayerConfig.head_configs.neymar,
        PlayerConfig.head_configs.ozil,
        PlayerConfig.head_configs.ribery,
        PlayerConfig.head_configs.robben,
        PlayerConfig.head_configs.rooney,
        PlayerConfig.head_configs.suarez,
	];

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
        worldclass : {
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



