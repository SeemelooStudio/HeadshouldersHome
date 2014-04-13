define(["crafty", "games/game", "games/player-config"], function (Crafty, Game, PlayerConfig) {

    Crafty.scene('PassGame', function() {
        var self = this;

        self.configs = {
            player_distance_step_1 : 110,
            player_distance_step_2 : 160,
            player_distance_step_3 : 210,
            num_of_players_to_enter_step_2 : 5,
            num_of_players_to_enter_step_3 : 15,
            player_distance_noise : 10,
            ball_kick_force : 15,
            ball_friction : -0.2,
            running_speed_in_step_1:10,
            running_speed_in_step_2:50,
            running_speed_in_step_3:100,
            rolling_speed_step_1:0.2,
            rolling_speed_step_2:0.22,
            rolling_speed_step_3:0.24
        };

        self.players = [];
        self.coins = [];
        self.toBeRemoved = [];
        self.numOfPlayersGenerated = 0;
        self.nextGenerateY = 0;
        self.lastPlayerHead = null;
        
        self.randomizerStep1 = Crafty.e('ObjectRandomizer').ObjectRandomizer(
			[self.configs.player_distance_step_1, self.configs.player_distance_step_2, self.configs.player_distance_step_3],[0.5,0.4]);
			
        self.randomizerStep2 = Crafty.e('ObjectRandomizer').ObjectRandomizer(
			[self.configs.player_distance_step_1, self.configs.player_distance_step_2, self.configs.player_distance_step_3]);
			
        self.randomizerStep3 = Crafty.e('ObjectRandomizer').ObjectRandomizer(
			[self.configs.player_distance_step_1, self.configs.player_distance_step_2, self.configs.player_distance_step_3],[0.1,0.4]);
        
        self.touchEvent = Game.getTouchEvent();

        self.ifNotEnterLoadBuffer = function(element) {
            return element._y + Crafty.viewport._y < -Game.height / 2 -element.height();
        };

        self.ifPassedLoadBuffer = function(element) {
            return element._y + Crafty.viewport._y > Game.height;
        };

        self.generateMorePlayers = function() {
            while(true)
            {
                self.generatePlayer();
                var lastPlayer = self.players[self.players.length - 1];
                if (self.ifNotEnterLoadBuffer(lastPlayer))
                {
                    break;
                }
            }
        };

        self.generatePlayer = function() {
            var player;
            var seed;
            var horizontalSpeed;
            if (self.numOfPlayersGenerated === 0)
            {
                // first player must be Leo Messi!!!
                player = Crafty.e('Passer').Passer(PlayerConfig.head_configs.messi, PlayerConfig.body_configs.messi);
                player.attr({x : (Game.player_bound_left() + Game.player_bound_right() - player.width()) / 2, y : self.nextGenerateY});
                self.lastPlayerHead = PlayerConfig.head_configs.messi;
            }
            else
            {
                // make should two concecutive players are different
                seed = Math.floor(Crafty.math.randomNumber(0, PlayerConfig.allHeads.length));

                while( PlayerConfig.allHeads[seed] === self.lastPlayerHead)
                {
                    seed = Math.floor(Crafty.math.randomNumber(0, PlayerConfig.allHeads.length));
                }
                self.lastPlayerHead = PlayerConfig.allHeads[seed];

                // set player's body based on player type
                var body = PlayerConfig.body_configs.amateur;
                var wanderDistance = 0;
                if (self.lastPlayerHead == PlayerConfig.head_configs.messi)
                {
                    body = PlayerConfig.body_configs.messi;
                    wanderDistance = 100;
                }
                else if (self.lastPlayerHead == PlayerConfig.head_configs.rabbit)
                {
                    body = PlayerConfig.body_configs.rabbit;
                    wanderDistance = 80;
                }
                else
                {
                    if (seed % 2 === 0 &&
                        self.numOfPlayersGenerated > self.configs.num_of_players_to_enter_step_2)
                    {
                        body = PlayerConfig.body_configs.worldclass;
                        wanderDistance = 60;
                    }
                }
                player = Crafty.e('Passer').Passer(self.lastPlayerHead, body, wanderDistance);
                player.attr({x : Crafty.math.randomNumber(Game.player_bound_left(), Game.player_bound_right() - player.width()), 
                             y : self.nextGenerateY});
                player.horizontalSpeed = self.getPlayerSpeed();
            }


            // try generate coins between players
            seed = Math.floor(Crafty.math.randomNumber(0, 100));
            if (seed % 2 === 0 &&
                self.numOfPlayersGenerated > self.configs.num_of_players_to_enter_step_2)
            {
                var lastPlayer = self.players[self.players.length - 1];
                var lastButOnePlayer = self.players[self.players.length - 2];
                if (lastPlayer._y - player._y > 160)
                {
                    var coin = Crafty.e('CoinPack');
                    coin.attr({x: (player._x + lastButOnePlayer._x) / 2,
                               y: (player._y + lastPlayer._y) / 2 + 20});
                    self.coins.push(coin);
                }
            }

            self.nextGenerateY -= self.getPlayerDistance();
            self.players.push(player);
            ++self.numOfPlayersGenerated;
        };
        self.getPlayerSpeed = function() {
            if (self.numOfPlayersGenerated < self.configs.num_of_players_to_enter_step_2)
            {
                return self.configs.running_speed_in_step_1;
            }
            else if (self.numOfPlayersGenerated < self.configs.num_of_players_to_enter_step_3)
            {
                return self.configs.running_speed_in_step_2;
            }
            else
            {
                return self.configs.running_speed_in_step_3;
            }
        };
        self.getPlayerDistance = function() {

            if (self.numOfPlayersGenerated < self.configs.num_of_players_to_enter_step_2)
            {
                return self.randomizerStep1.get();
            }
            else if (self.numOfPlayersGenerated < self.configs.num_of_players_to_enter_step_3)
            {
                return self.randomizerStep2.get();
            }
            else
            {
                return self.randomizerStep3.get();
            }
        };
        self.getRollingSpeed = function() {
            var base = self.numOfPlayersGenerated - 5;
            if (base < self.configs.num_of_players_to_enter_step_2)
            {
                return self.configs.rolling_speed_step_1;
            }
            else if (base < self.configs.num_of_players_to_enter_step_3)
            {
                return self.configs.rolling_speed_step_2;
            }
            else
            {
                return self.configs.rolling_speed_step_3;
            }
        };
        self.destroyElementsOffScreen = function() {
            self.toBeRemoved = [];
            var index = 0;
            for (var i = 0; i < self.players.length; i++)
            {
                var player = self.players[i];	
                if (self.ifPassedLoadBuffer(player))
                {
                    self.toBeRemoved.push(player);
                }
            }
            for ( i = 0; i < self.toBeRemoved.length; i++)
            {
                index = self.players.indexOf(self.toBeRemoved[i]);
                if (index != -1)
                {
                    self.players.splice(index, 1);
                }
                self.toBeRemoved[i].destroy();
            }
            self.toBeRemoved = [];
            for (i = 0; i < self.coins.length; i++)
            {
                var coin = self.coins[i];	
                if (self.ifPassedLoadBuffer(coin))
                {
                    self.toBeRemoved.push(coin);
                }
            }
            for ( i = 0; i < self.toBeRemoved.length; i++)
            {
                index = self.coins.indexOf(self.toBeRemoved[i]);
                if (index != -1)
                {
                    self.coins.splice(index, 1);
                }
                self.toBeRemoved[i].destroy();
            }
        };

        self.setCurrentController = function(player) {
            self.currentController = player;
            self.currentController.collision([0,0], [0,0]); // disable collision of controller
            self.currentController.attachBall(self.ball);
            self.currentController.standby();
            self.currentController.isWandering = false;
            self.highlightRing.ring.changeRollingDirection();
            self.highlightRing.ring.spinSpeed = self.getRollingSpeed();
            self.highlightRing.startRolling();
            self.highlightRing.setPlayer(self.currentController);

            self.destroyElementsOffScreen();
            self.generateMorePlayers();
        };

        self.onMouseDown = function(e) {

            self.highlightRing.stopRolling();
            if (self.currentController !== null)
            {
                self.currentController.kickBall(self.configs.ball_kick_force, self.highlightRing.getDirection());
            }

            
        };

        self.onHitPasser = function(data) {
            var player = data[0].obj;
            if (player._y < self.currentController._y)
            {
                self.ball.trap();
                self.setCurrentController(player);
                Game.events.onPlayerTrapBall(player.typeId);
            }
        };

        self.onHitCoin = function(data) {
            Game.data.num_of_collected_coins += 5 ;
            Game.events.onCollectCoinPack(Game.data.num_of_collected_coins);
            var coin = data[0].obj;
            var index = self.coins.indexOf(coin);
            if (index != -1)
            {
                self.coins.splice(index, 1);
            }
            coin.destroy();
        };

        self.gameover = function() {
            Crafty.removeEvent(self, Crafty.stage.elem, self.touchEvent, self.onMouseDown);
            Game.pause();
            Game.events.onGameOver();
        };

        self.clamp = function( value, min, max ) {
            if ( value < min ) { value = min; }
            if ( value > max ) { value = max; }
            return value;
        };

        self.lerp = function( a, b, t ) {
            t = self.clamp( t, 0, 1 );
            return ( a + t * ( b - a ) );
        };

        self.onEnterFrame = function(data) {
			if (self.ball._x < Game.player_bound_left() - 50 ||
                self.ball._x > Game.player_bound_right() + 50 ||
                self.ifPassedLoadBuffer(self.ball) ) 
			{
                self.gameover();
			}
            self.field.keepInViewport();

            var targetY = Game.height - 80 - self.ball._y;
            if (targetY > Crafty.viewport._y) // only allow camera to move upward
            {
                Crafty.viewport.y = Math.floor(self.lerp(Crafty.viewport._y, targetY, data.dt / 100));
            }
        };

        self.ball = Crafty.e('Ball');
        self.ball.requires('Collision, DebugCollision')
            .collision([5, self.ball._h - 5], [self.ball._w - 5, self.ball._h - 5], [self.ball._w - 5, 5], [5, 5])
            .attr({z : Game.depth.controller})
            .onHit('Passer', self.onHitPasser)
            .onHit('CoinPack', self.onHitCoin);
        self.ball.friction = self.configs.ball_friction;
        self.ball.onBecomeStillWithoutTrap = function() {
            self.gameover();
        };

        self.highlightRing = Crafty.e('HighlightRing');
        self.highlightRing.attr({ x : Game.width / 2, y : Game.height / 2});

        self.field = Crafty.e('Field');

        Crafty.viewport.y = Game.height / 2;
        self.generateMorePlayers();
        self.setCurrentController(self.players[0]);

        self.bind('EnterFrame', self.onEnterFrame);
        Crafty.addEvent(self, Crafty.stage.elem, self.touchEvent, self.onMouseDown);
    }, 
    function() { 
        var self = this;
        self.unbind('EnterFrame', self.onEnterFrame);
        Crafty.removeEvent(self, Crafty.stage.elem, self.touchEvent, self.onMouseDown);
    });

});
