define(["jquery", "crafty"],
function ($, Crafty ) {

    var Game = {
        width: $(window).width(),
        height: $(window).height(),

		ingame_width: 320,
		player_bound_left: function() { return Game.width / 2 - Game.ingame_width / 2; },
		player_bound_right: function() { return Game.width / 2 + Game.ingame_width / 2; },

        start: function() {
			Game.reset();
			Crafty.init(Game.width, Game.height);
			Crafty.settings.autoPause = true; //pauses the game when the page is not visible to the user.
			Crafty.scene('Loading');
        },

		pause: function() {
            Crafty.pause(true);
		},

        unpause: function() {
            Crafty.pause(false);
		},

		stop: function() {
			//Crafty.scene('Over');
			//Crafty.stop();
			Crafty.stop();
		},

		restart: function() {
            this.reset();
            this.unpause();
            Crafty.scene('Game');
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
                console.log('collect coin: ' + totalCount);
			},
			onGameOver : function() {
                console.log('game over');
			},
			onLoadComplete : function() {
                console.log('load complete');
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
			
			if (events.onLoadComplete ) {
                Game.events.onLoadComplete = events.onLoadComplete;
			} 
		}
    };
    
    return Game;
    }
);



