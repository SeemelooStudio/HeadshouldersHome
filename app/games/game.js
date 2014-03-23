define(["jquery", "crafty"],
function ($, Crafty ) {

    var Game = {
        width: $(window).width(),
        height: $(window).height(),

        start: function() {
			Game.reset();
            Crafty.init(Game.width, Game.height);
			Crafty.settings.autoPause = true; //pauses the game when the page is not visible to the user.
            //Crafty.background('rgb(87, 109, 20)');
            Crafty.scene('Loading');
        },

		pause: function() {
		    Crafty.pause(true);
		},

		unpause: function() {
		    Crafty.pause(false);
		},

		stop: function() {
		    Crafty.stop();
		},

		restart: function() {
		},

	    reset: function() {
			Game.data.num_of_passed_obstacle = 0;
			Game.data.num_of_collected_coins = 0;
			Game.data.num_of_passed_amateurs = 0;
			Game.data.num_of_passed_worldclass = 0;
		},

		data : {
			num_of_passed_obstacle : 0,
			num_of_collected_coins : 0,
			num_of_passed_amateurs : 0,
			num_of_passed_worldclass : 0,
		},
        
        depth: {
            field : 0,
			controller : 10,
            obstacle : 20,
			coin : 30,
			npc : 40,

            body : 1,
            head : 2,
            ball : 3
        },
        
        configs: {
            player_horizontal_speed_per_second : 3,
            player_vertical_speed_per_frame : 100,
			amateur_horizontal_speed_per_frame : 100,
		    worldclass_horizontal_speed_per_frame : 100,
            component_generate_interval : 2500
        },

		events: {
			onPassObstacle : function(totalCount) {
				console.log('pass obstacle: ' + totalCount);
			},
			onPassAmateur : function(totalCount) {
				console.log('pass amateur: ' + totalCount);
			},
			onPassWorldClass : function(totalCount) {
				console.log('pass worldclass: ' + totalCount);
			},
			onCollectCoin : function(totalCount) {
				console.log('collect coin: ' + totalCount)
			},
			onGameOver : function() {
			    console.log('game over');
			}
		},

		registerEvents: function(events) {
			if (events.onPassObstacle) {
				Game.events.onPassObstacle = events.onPassObstacle;
			}

			if (events.onPassAmateur) {
				Game.events.onPassAmateur = events.onPassAmateur;
			}

			if (events.onPassWorldClass) {
				Game.events.onPassWorldClass = events.onPassWorldClass;
			}

			if (events.onCollectCoin) {
				Game.events.onCollectCoin = events.onCollectCoin;
			}

			if (events.onGameOver) {
				Game.events.onGameOver = events.onGameOver;
			}
		},
    };
    
    return Game;
    }
);



