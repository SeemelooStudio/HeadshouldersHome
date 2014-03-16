define(["crafty"],
function (Crafty) {
    var PlayerConfig = {};

    PlayerConfig.head_configs = {
        messi : {
            sprite : 'SpriteMessi'
        },
        neymar : {
            sprite : 'SpriteNeymar'
        }
    };
    
    PlayerConfig.body_configs = {
        yellow : {
            sprite : 'SpriteYellow',
            frames : [[3,0], [4,0], [5,0], [4,0]]
        },
        blue : {
            sprite : 'SpriteBlue',
            frames : [[0,0], [1,0], [2,0], [1,0]]
        }
    };
    
    return PlayerConfig;
    }
);



