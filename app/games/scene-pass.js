define(["crafty", "games/game", "games/player-config"], function (Crafty, Game, PlayerConfig) {

    Crafty.scene('PassGame', function() {
        var self = this;

        self.configs = {
            player_distance_step_1 : 150,
            player_distance_step_2 : 220,
            player_distance_step_3 : 350,
            num_of_players_to_enter_step_2 : 8,
            num_of_players_to_enter_step_3 : 15,
            player_distance_noise : 5,
            ball_kick_force : 20,
            ball_friction : -0.5
        };

        self.players = [];
        self.toBeRemoved = [];
        self.numOfPlayersGenerated = 0;
        self.nextGenerateY = 0;
        self.lastPlayerHead = null;

        self.ifNotEnterViewport = function(player) {
            return player._y + Crafty.viewport._y < -player.height();
        };

        self.ifPassedViewport = function(player) {
            return player._y + Crafty.viewport._y > Game.height;
        };

        self.generateMorePlayers = function() {
            while(true)
            {
                self.generatePlayer();
                var lastPlayer = self.players[self.players.length - 1];
                if (self.ifNotEnterViewport(lastPlayer))
                {
                    break;
                }
            }
        };

        self.generatePlayer = function() {
            var player;
            var seed;
            if (self.numOfPlayersGenerated === 0)
            {
                player = Crafty.e('Passer').Passer(PlayerConfig.head_configs.messi, PlayerConfig.body_configs.messi);
                player.attr({x : (Game.player_bound_left() + Game.player_bound_right() - player.width()) / 2, y : self.nextGenerateY});
                self.lastPlayerHead = PlayerConfig.head_configs.messi;
            }
            else
            {
                seed = Math.floor(Crafty.math.randomNumber(0, PlayerConfig.allHeads.length));
                while( PlayerConfig.allHeads[seed] === self.lastPlayerHead)
                {
                    seed = Math.floor(Crafty.math.randomNumber(0, PlayerConfig.allHeads.length));
                }
                self.lastPlayerHead = PlayerConfig.allHeads[seed];
                player = Crafty.e('Passer').Passer(self.lastPlayerHead, 
                        self.lastPlayerHead == PlayerConfig.head_configs.rabbit ? 
                            PlayerConfig.body_configs.rabbit : PlayerConfig.body_configs.messi);
                player.attr({x : Crafty.math.randomNumber(Game.player_bound_left(), Game.player_bound_right() - player.width()), y : self.nextGenerateY});
            }

            seed = Math.floor(Crafty.math.randomNumber(0, 100));
            if (seed % 2 === 0 &&
                self.numOfPlayersGenerated > self.configs.num_of_players_to_enter_step_2)
            {
                var lastPlayer = self.players[self.players.length - 1];
                if (lastPlayer._y - player._y > 160)
                {
                    Crafty.e('Coin').attr({x: (lastPlayer._x + player._x) / 2, y: (lastPlayer._y + player._y) / 2});
                }
            }

            self.nextGenerateY -= self.getPlayerDistance();
            self.players.push(player);
            ++self.numOfPlayersGenerated;
        };

        self.getPlayerDistance = function() {
            var noise = Math.floor(Crafty.math.randomNumber(-self.configs.player_distance_noise, self.configs.player_distance_noise));
            if (self.numOfPlayersGenerated < self.configs.num_of_players_to_enter_step_2)
            {
                return self.configs.player_distance_step_1 + noise;
            }
            else if (self.numOfPlayersGenerated < self.configs.num_of_players_to_enter_step_3)
            {
                return self.configs.player_distance_step_2 + noise * 2;
            }
            else
            {
                return self.configs.player_distance_step_3 + noise * 3;
            }
        };

        self.destroyPlayersOffScreen = function() {
            for (var i = 0; i < self.players.length; i++)
            {
                var player = self.players[i];	
                if (self.ifPassedViewport(player))
                {
                    self.toBeRemoved.push(player);
                }
            }
            for ( i = 0; i < self.toBeRemoved.length; i++)
            {
                var index = self.players.indexOf(self.toBeRemoved[i]);
                if (index != -1)
                {
                    self.players.splice(index, 1);
                }
                self.toBeRemoved[i].destroy();
            }
            self.toBeRemoved = [];
        };

        self.destroyAllPlayers = function() {
            for (var i = 0; i < self.players.lenght; i++)
            {
                self.players[i].destroy();
            }
            self.players = [];
        };

        self.setCurrentController = function(player) {
            self.currentController = player;
            self.currentController.collision([0,0], [0,0]); // disable collision of controller
            self.currentController.attachBall(self.ball);
            self.currentController.standby();
            self.currentController.isWandering = false;
            self.highlightRing.startRolling();
            self.highlightRing.setPlayer(self.currentController);

            self.destroyPlayersOffScreen();
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
            }
        };

        self.onHitCoin = function(data) {
            ++Game.data.num_of_collected_coins;
            Game.events.onCollectCoin(Game.data.num_of_collected_coins);
            var coin = data[0].obj;
            coin.destroy();
        };

        self.gameover = function() {
            Game.pause();
            Game.events.onGameOver();
        };

        self.onEnterFrame = function(data) {
			if (this.ball._x < Game.player_bound_left() - 20 ||
                this.ball._x > Game.player_bound_right() + 20) 
			{
                self.gameover();
			}
            self.field.keepInViewport();
        };

        self.ball = Crafty.e('Ball');
        self.ball.requires('Collision, DebugCollision')
            .collision([5, self.ball._h - 5], [self.ball._w - 5, self.ball._h - 5], [self.ball._w - 5, 5], [5, 5])
            .attr({z : Game.depth.controller})
            .onHit('Passer', self.onHitPasser)
            .onHit('Coin', self.onHitCoin);
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
        Crafty.addEvent(self, Crafty.stage.elem, "mousedown", self.onMouseDown);
    }, 
    function() { 
        var self = this;
        self.unbind('EnterFrame', self.onEnterFrame);
        Crafty.removeEvent(self, Crafty.stage.elem, "mousedown", self.onMouseDown);
    });

});
