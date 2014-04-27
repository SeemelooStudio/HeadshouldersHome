define(["jquery", "crafty"],
function ($, Crafty ) {

    var Game = {
        width: $(window).width(),
        height: $(window).height(),

		ingame_width: 320,
		ingame_width_half:160,
		player_bound_left: function() { return Game.width / 2 - Game.ingame_width / 2; },
		player_bound_right: function() { return Game.width / 2 + Game.ingame_width / 2; },

        dribbleGameScene : "DribbleGame",
        passGameScene : "PassGame",
        shootGameScene : "ShootGame",

        currentGameScene : "DribbleGame",

        isValidGameScene: function(gameSceneName) {
            return gameSceneName === Game.dribbleGameScene ||
                   gameSceneName === Game.passGameScene ||
                   gameSceneName === Game.shootGameScene;
        },

        start: function(gameSceneName) {
			Game.reset();
			Crafty.init(Game.width, Game.height);
            Crafty.viewport.init(Game.width, Game.height);
            Crafty.viewport.clampToEntities = false;
			Crafty.settings.autoPause = true; //pauses the game when the page is not visible to the user.

            if (Game.isValidGameScene(gameSceneName))
            {
                Game.currentGameScene = gameSceneName;
            }
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

		restart: function(gameSceneName) {
            this.reset();
            this.unpause();
            if (Game.isValidGameScene(gameSceneName))
            {
                Game.currentGameScene = gameSceneName;
            }
            Crafty.scene(Game.currentGameScene);
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
			controller : 40,
            obstacle : 20,
			coin : 30,
			npc : 10,
			passed: 50,

            body : 1,
            head : 2,
            ball : 3
        },
        
        configs: {
            player_horizontal_speed_per_second : 2,
            player_vertical_speed_per_frame : 150,
			amateur_horizontal_speed_per_frame : 100,
			amateur_vertical_speed_per_frame: 50,
			worldclass_horizontal_speed_per_frame : 100,
			worldclass_vertical_speed_per_frame: 50,
			worldclass_tackle_horizontal_speed_per_frame: 200,
            rabbit_vertical_speed_per_frame : -20,
			rabbit_horizontal_speed_per_frame : 10,
			rabbit_trace_speed_per_frame: 100,
            component_generate_interval : 1000,
            component_generate_interval_hard: 600
        },

		events: {
			onPassObstacle : function(totalCount) {
				//console.log('pass obstacle: ' + totalCount);
			},
			onPassAmateur : function(totalCount) {
				//console.log('pass amateur: ' + totalCount);
			},
			onPassWorldClass : function(totalCount) {
				//console.log('pass worldclass: ' + totalCount);
			},
            onPlayerTrapBall: function(typeID) {
				//console.log('player trap ball: ' + playerTypeID);
            },
			onCollectCoin : function(totalCount) {
                //console.log('collect coin: ' + totalCount);
			},
			onGameOver : function() {
                //console.log('game over');
			},
			onLoadComplete : function() {
                //console.log('load complete');
			},
			onCollectCoinPack: function() {
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

            if (events.onPlayerTrapBall) {
                Game.events.onPlayerTrapBall = events.onPlayerTrapBall;
            }
            
            if ( events.onCollectCoinPack ) {
                Game.events.onCollectCoinPack = events.onCollectCoinPack;
            }
		},
		
		getTouchEvent: function(){
            var isTouchScreen = ('ontouchstart' in window) || ((window.DocumentTouch !== undefined) && document instanceof DocumentTouch);
            if (isTouchScreen ) {
                return "touchstart";
            } else {
                return "mousedown";
            }
		}
    };
    
    return Game;
    }
);



