define(["crafty", "games/game", "games/player-config"], function (Crafty, Game, PlayerConfig) {

    Crafty.scene('ShootGame', function() {
        var self = this;

        self.kickConfigs = [];
        self.currentNumOfLife = 5;
        self.currentDefenders = [];
        self.currentDefenderHeads = [];

        self.creatDefenderConfig = function(x, y, wanderDistance) {
            return {
                x : x,
                y : y,
                wanderDistance : wanderDistance,
            };
        };

        self.addKickConfig = function(x, y, hasGoalKeeper, defenders){
            var config = {
                x : x,
                y : y,
                hasGoalKeeper : hasGoalKeeper,
                defenders : defenders
            };
            self.kickConfigs.push(config);
        };

        self.initKickConfigs = function() {
            var baseX = (Game.player_bound_left() + Game.player_bound_right() - self.player.width()) / 2;
            var baseY = Game.height - self.player.height();
            self.addKickConfig(baseX - 100, baseY, false);
            self.addKickConfig(baseX + 100, baseY - 100, true, [ [baseX - 100, baseY - 300] ]);
            self.addKickConfig(baseX, baseY, true, [ [baseX, baseY - 200, 50] ]);
        };

        self.getRandomKickConfig = function() {
            var seed = Math.floor(Crafty.math.randomNumber(0, self.kickConfigs.length));
            return self.kickConfigs[seed];
        };

        self.ballCreator = function() {
            var ball = Crafty.e('Ball');
            ball.requires('Collision, DebugCollision')
                .collision([5, ball._h - 5], [ball._w - 5, ball._h - 5], [ball._w - 5, 5], [5, 5])
                .onHit('Goal', self.onGoal)
                .onHit('Post', self.onHitPost)
                .onHit('Defender', self.onHitDefender)
                .onHit('Keeper', self.onHitKeeper)
                .attr({z : Game.depth.controller})
            ball.friction = Game.configs.ball_friction;
            return ball;
        };

        self.onEnterFrame = function(data) {
            self.keeper.update(data.dt / 1000, data.frame);

            // detect if ball is out of field
            if ( self.ball._x < Game.player_bound_left() - 10 ||
                 self.ball._x > Game.player_bound_right() + 10 ||
                 self.ball._y < -10 ||
                 self.ball._y > Game.height + 10)
            {
                self.onBallStop();
            }
        };

        self.clearCurrentDefenders = function() {
            for(var i = 0; i < self.currentDefenders.length; i++)
            {
                self.currentDefenders[i].destroy();
            }
            self.currentDefenders = [];
            self.currentDefenderHeads = [];
        };

        self.isHeadAreadyUsed = function(head) {
            var index = self.currentDefenderHeads.indexOf(head);
            return index != -1;
        };

        self.createDefender = function(defenderConfig) {
            var seed = Math.floor(Crafty.math.randomNumber(0, PlayerConfig.allHeads.length));
            while( PlayerConfig.allHeads[seed] === PlayerConfig.head_configs.messi ||
                   self.isHeadAreadyUsed(PlayerConfig.allHeads[seed]) )
            {
                seed = Math.floor(Crafty.math.randomNumber(0, PlayerConfig.allHeads.length));
            }
            var head = PlayerConfig.allHeads[seed];
            self.currentDefenderHeads.push(head);
            var body = head == PlayerConfig.head_configs.rabbit ? PlayerConfig.body_configs.rabbit : PlayerConfig.body_configs.worldclass;
            var wanderDistance = defenderConfig.length >= 3 ? defenderConfig[2] : 0;
            return Crafty.e('Defender').Defender(head, body, wanderDistance)
                                 .attr({x: defenderConfig[0], y: defenderConfig[1]});
        };

        self.resetKick = function(kickConfig, ifResetDefender) {
            self.player.attachBall(self.ball);
            self.ball.trap();
            self.player.attr({x: kickConfig.x, y: kickConfig.y});
            if ( kickConfig.x + self.player.width() / 2 < Game.width / 2 )
            {
                self.player.faceRight();
            }
            else
            {
                self.player.faceLeft();
            }

            if (ifResetDefender)
            {
                self.clearCurrentDefenders();

                self.keeper.attr({y : self.goal.getGoalLineY() - self.keeper.getHeight()});
                if (!kickConfig.hasGoalKeeper)
                {
                    self.keeper.y -= 200;
                }

                if (kickConfig.defenders)
                {
                    for( var i = 0; i < kickConfig.defenders.length; i++)
                    {
                        var defenderConfig = kickConfig.defenders[i];
                        var defender = self.createDefender(defenderConfig);
                        if (defender._x >= self.player._x)
                        {
                            defender.faceLeft();
                        }
                        else
                        {
                            defender.faceRight();
                        }

                        self.currentDefenders.push(defender);
                    }
                }
            }

            self.shootController.enableDrag();
        };

        self.onShoot = function(dir, speed) {
            //console.log('shoot: dir = ' + dir + ', speed = ' + speed);
            var kickForce = Math.max(50 * speed, 15);
            var kickForce = Math.min(kickForce, 40);
            if (self.player.ball)
            {
                self.player.kickBall(kickForce, dir);
            }
            self.shootController.disableDrag();
        };

        self.onGoal = function() {
            Crafty.e('PopupDecal').popup('goal', self.ball._x + self.ball._w / 2, self.ball._y);
            self.resetKick(self.getRandomKickConfig(), true);
        };

        self.onHitKeeper = function() {
            Crafty.e('PopupDecal').popup('pong', self.keeper._x + self.keeper._w / 2, self.keeper._y + self.keeper._h / 2);
            self.onBallStop();
        };

        self.onHitDefender = function(hitInfo) {
            var defender = hitInfo[0].obj;
            Crafty.e('PopupDecal').popup('pong', defender._x + defender._w / 2, defender._y + defender._h / 2);
            self.onBallStop();
        };

        self.onHitPost = function(hitInfo) {
            var post = hitInfo[0].obj;
            Crafty.e('PopupDecal').popup('pong', post._x, post._y);
            self.onBallStop();
        };

        self.onBallStop = function(){
            if (self.currentNumOfLife > 0)
            {
                --self.currentNumOfLife;
                self.lifeHud.setLife(self.currentNumOfLife);
                self.resetKick(self.getRandomKickConfig(), false);
            }
            else
            {
                Game.pause();
                Game.events.onGameOver();
            }
        };

        self.field = Crafty.e('Field');
        self.goal = Crafty.e('Goal');
        self.goal.attr({x: Game.width / 2 - self.goal._w / 2, y: 0});

        self.keeper = Crafty.e('Keeper');
        self.keeper.attr({x : Game.width / 2 - self.keeper.getWidth() / 2, 
                          y : self.goal.getGoalLineY() - self.keeper.getHeight()});

        self.lifeHud = Crafty.e('LifeHud');
        self.lifeHud.attr({x: Game.width - self.lifeHud.getWidth() - 10,
                           y: Game.height - self.lifeHud.getHeight() - 10})
        self.lifeHud.setLife(self.currentNumOfLife);

        self.ball = self.ballCreator();
        self.ball.isRolling = false;
        self.ball.onBecomeStillWithoutTrap = self.onBallStop;

        self.shootController = Crafty.e('ShootController');
        self.shootController.onShoot = self.onShoot;

        self.player = Crafty.e('Shooter').Shooter(PlayerConfig.head_configs.messi, PlayerConfig.body_configs.messi, self.ball);

        self.initKickConfigs();
        self.resetKick(self.getRandomKickConfig(), true);

        self.bind('EnterFrame', self.onEnterFrame);
    }, 
    function() { 
        var self = this;
        self.unbind('EnterFrame', self.onEnterFrame);
        Crafty.removeEvent(self, Crafty.stage.elem, self.touchEvent, self.onMouseDown);
    });

});
