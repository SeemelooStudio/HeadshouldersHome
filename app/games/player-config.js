define(["crafty"],
function (Crafty) {
    var PlayerConfig = {};

    PlayerConfig.head_configs = {
        messi : {
            sprite : [0, 3],
			cry : [2, 2],
        },
        neymar : {
            sprite : [1, 2]
        },
        ozil : {
            sprite : [0, 2] 
        },
        ribery : {
            sprite : [1, 1] 
        },
        robben : {
            sprite : [0, 1] 
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
		rabbit : {
			sprite : [2, 1]
		}
    };

	PlayerConfig.worldclass_players = [
        PlayerConfig.head_configs.neymar,
        PlayerConfig.head_configs.ozil,
        PlayerConfig.head_configs.ribery,
        PlayerConfig.head_configs.robben,
        PlayerConfig.head_configs.rooney,
        PlayerConfig.head_configs.suarez
	];

    PlayerConfig.body_configs = {
        messi : {
            sprite : 'BodyMessi',
            runFrames : [[2,2], [0,3], [1, 3], [0,3]]
        },
        amateur : {
            sprite : 'BodyAmateur',
            runFrames : [[0,4], [1,4], [2,4], [1,4]],
			tackleFrames : [[2, 3]]
        },
        worldclass : {
            sprite : 'BodyPro',
            runFrames : [[2,1], [0,2], [1,2], [0,2]],
			tackleFrames : [[1, 1]]
		},
		rabbit : {
            sprite : 'BodyRabbit',
            runFrames : [[1,0], [2,0], [0,1], [2,0]],
			tackleFrames : [[2, 3]]
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



