define(["jquery", "crafty"],
function ($, Crafty) {

    var Game = {
        width: $(window).width(),
        height: $(window).height(),
        // Initialize and start our game
        start: function() {
            // Start crafty and set a background color so that we can see it's working
            Crafty.init(Game.width, Game.height);
            Crafty.background('rgb(87, 109, 20)');
            
            // Simply start the "Loading" scene to get things going
            Crafty.scene('Loading');
        },
        
        depth: {
            field : 0,
            body : 1,
            head : 2,
            ball : 3,
            obstacle : 1
        },
        
        configs: {
            player_horizontal_speed_per_second : 3,
            player_vertical_speed_per_frame : 100,
            hazard_generate_interval : 2500
        }
    };
    
    return Game;
    }
);



