define(["crafty", "games/game", "games/player-config"], function (Crafty, Game, PlayerConfig) {

    Crafty.scene('PassGame', function() {
        var self = this;

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
            if (self.numOfPlayersGenerated === 0)
            {
                player = Crafty.e('Passer').Passer(PlayerConfig.head_configs.messi, PlayerConfig.body_configs.messi);
                player.attr({x : (Game.player_bound_left() + Game.player_bound_right() - player.width()) / 2, y : self.nextGenerateY});
                self.lastPlayerHead = PlayerConfig.head_configs.messi;
            }
            else
            {
                var seed = Math.floor(Crafty.math.randomNumber(0, PlayerConfig.allHeads.length));
                while( PlayerConfig.allHeads[seed] == self.lastPlayerHead)
                {
                    seed = Math.floor(Crafty.math.randomNumber(0, PlayerConfig.allHeads.length));
                }
                self.lastPlayerHead = PlayerConfig.allHeads[seed];
                player = Crafty.e('Passer').Passer(self.lastPlayerHead, 
                        self.lastPlayerHead == PlayerConfig.head_configs.rabbit ? 
                            PlayerConfig.body_configs.rabbit : PlayerConfig.body_configs.messi);
                player.attr({x : Crafty.math.randomNumber(Game.player_bound_left(), Game.player_bound_right() - player.width()), y : self.nextGenerateY});
            }

            self.nextGenerateY -= 150;
            self.players.push(player);
            ++self.numOfPlayersGenerated;
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
            self.highlightRing.startRolling();
            self.highlightRing.setPlayer(self.currentController);

            self.destroyPlayersOffScreen();
            self.generateMorePlayers();
        };

        self.onMouseDown = function(e) {
            self.highlightRing.stopRolling();
            self.ball.kick(40, self.highlightRing.getDirection());
        };

        self.onHitPasser = function(data) {
            var player = data[0].obj;
            self.ball.trap();
            self.setCurrentController(player);
        };

        self.gameover = function() {
            console.log("game over");
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
            .onHit('Passer', self.onHitPasser);
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
