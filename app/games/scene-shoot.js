define(["crafty", "games/game", "games/player-config"], function (Crafty, Game, PlayerConfig) {

    Crafty.scene('ShootGame', function() {
        var self = this;

        self.kickConfigs = [];

        self.creatDefenderConfig = function(x, y, wanderDistance) {
            return {
                x : x,
                y : y,
                wanderDistance : wanderDistance,
            };
        };

        self.addKickConfig = function(x, y, defenders){
            var config = {
                x : x,
                y : y,
                defenders : defenders
            };
            self.kickConfigs.push(config);
        };

        self.getRandomKickConfig = function() {
            var seed = Math.floor(Crafty.math.randomNumber(0, self.kickConfigs.length));
            return self.kickConfigs[seed];
        };

        self.coinCreator = function() {
            return Crafty.e('CoinPack');
        };

        self.ballCreator = function() {
            var ball = Crafty.e('Ball');
            ball.requires('Collision, DebugCollision')
                .collision([5, ball._h - 5], [ball._w - 5, ball._h - 5], [ball._w - 5, 5], [5, 5])
                .onHit('Goal', self.onGoal)
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
                //todo: lose heath
                self.resetKick(self.getRandomKickConfig());
            }
        };

        self.resetKick = function(kickConfig) {
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

            self.shootController.enableDrag();
        };

        self.onShoot = function(dir, speed) {
            //console.log('shoot: dir = ' + dir + ', speed = ' + speed);
            var kickForce = Math.max(50 * speed, 15);
            var kickForce = Math.min(kickForce, 50);
            if (self.player.ball)
            {
                self.player.kickBall(kickForce, dir);
            }
            self.shootController.disableDrag();
        };

        self.onGoal = function() {
            //console.log("goal");
        };

        self.onHitKeeper = function() {
            //console.log("on hit keeper");
        };

        self.onBallStop = function(){
            self.resetKick(self.getRandomKickConfig());
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

        self.ball = self.ballCreator();
        self.ball.isRolling = false;
        self.ball.onBecomeStillWithoutTrap = self.onBallStop;

        self.shootController = Crafty.e('ShootController');
        self.shootController.onShoot = self.onShoot;

        self.player = Crafty.e('Shooter').Shooter(PlayerConfig.head_configs.messi, PlayerConfig.body_configs.messi, self.ball);

        self.addKickConfig((Game.player_bound_left() + Game.player_bound_right() - self.player.width()) / 2 + 100, Game.height - self.player.height() - 100);
        self.resetKick(self.getRandomKickConfig());

        self.bind('EnterFrame', self.onEnterFrame);
    }, 
    function() { 
        var self = this;
        self.unbind('EnterFrame', self.onEnterFrame);
        Crafty.removeEvent(self, Crafty.stage.elem, self.touchEvent, self.onMouseDown);
    });

});
