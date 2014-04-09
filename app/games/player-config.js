define(["crafty"],
function (Crafty) {
    var PlayerConfig = {};

    PlayerConfig.head_configs = {
        messi : {
            id: '梅西',
            sprite : [0, 3],
			cry : [2, 2],
        },
        neymar : {
            id: '外马尔',
            sprite : [1, 2]
        },
        ozil : {
            id: '二齐尔',
            sprite : [0, 2] 
        },
        ribery : {
            id: '外贝里',
            sprite : [1, 1] 
        },
        robben : {
            id: '裸奔',
            sprite : [0, 1] 
        },
        rooney : {
            id: '撸尼',
            sprite : [2, 0] 
        },
        suarez : {
            id: '龅牙蕾丝',
            sprite : [1, 0] 
        },
        sushi : {
            id: '香川寿司',
            sprite : [0, 0] 
        },
		rabbit : {
            id: '兔兔爱西西',
			sprite : [2, 1],
			kiss: [1, 3]
		}
    };

    PlayerConfig.allHeads = [
        PlayerConfig.head_configs.messi,
        PlayerConfig.head_configs.neymar,
        PlayerConfig.head_configs.ozil,
        PlayerConfig.head_configs.ribery,
        PlayerConfig.head_configs.robben,
        PlayerConfig.head_configs.rooney,
        PlayerConfig.head_configs.sushi,
        PlayerConfig.head_configs.suarez,
        PlayerConfig.head_configs.rabbit
    ];

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
			tackleFrames : [[2, 3]],
			idleFrames:[[1,5], [0,5]]
        },
        worldclass : {
            sprite : 'BodyPro',
            runFrames : [[2,1], [0,2], [1,2], [0,2]],
			tackleFrames : [[1, 1]]
		},
		rabbit : {
            sprite : 'BodyRabbit',
            runFrames : [[1,0], [2,0], [0,1], [2,0]],
			tackleFrames : [[0, 0]]
		},
    };

	PlayerConfig.joints = {
		head: { x : 80, y : 140 },
		body_run: { x : 70, y : 10 },
		body_tackle: { x : 85, y : 50 },
		body_jump:{ x:70, y:15}
	};
    
    return PlayerConfig;
    }
);



