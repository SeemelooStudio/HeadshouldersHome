define(["crafty", "games/game", "games/player-config"], function (Crafty, Game, PlayerConfig) {
    
    Crafty.c('HighlightRing', {
        direction: new Crafty.math.Vector2D(),

        init: function() {
            this.requires('Actor');

            this.ring = Crafty.e('RollingActor, SpriteRing').origin('center')
                              .attr({z: Game.depth.controller});
            this.ring.attr({x : -this.ring._w / 2, y : -this.ring._h / 2});
            this.ring.spinSpeed = 0.2;
            this.arrow = Crafty.e('2D');
            this.ring.attach(this.arrow);
            this.arrow.attr({x : this.ring._x + this.ring._w / 2, y : this.ring._y});
            this.attach(this.ring);

            this.cameraAnchor = Crafty.e('2D').attr({x : Game.width / 2});

            this.bind('EnterFrame', this.onEnterFrame);
        },

        startRolling: function() {
            this.ring.startRolling();
        },

        stopRolling: function() {
            this.ring.stopRolling();
        },

        setPlayer: function(player) {
            if (this.player)
            {
                this.player.detach(this);
            }
            this.player = player;
            if (this.player)
            {
                this.attr({x : this.player._x + this.player.width() / 2, 
                           y : this.player._y + this.player.height() / 2});
                this.player.attach(this);
            }
            this.cameraAnchor.y = this._y - 150; 
        },

        getDirection: function() {
            this.direction.setValues(this.arrow._x - this._x, 
                                     this.arrow._y - this._y);
            //console.log(this.direction.toString());
            return this.direction;
        },

        isPointingUpward: function() {
            var rot = this.ring._rotation % 360;
            return rot < 90 || rot > 270; 
        },

        onEnterFrame : function(data) {
            this.ring.roll(data);

            if (this.player)
            {
                if (this.ring._rotation % 360 > 180)
                {
                    if (!this.player.facingLeft)
                    {
                        this.player.faceLeft();
                    }
                }
                else
                {
                    if (this.player.facingLeft)
                    {
                        this.player.faceRight();
                    }
                }
            }
        }

    });

    Crafty.c('Passer', {
        wanderDistance : 0,
        horizontalSpeed: Game.configs.amateur_horizontal_speed_per_frame,

        isWandering : false,

        init: function() {
            this.requires('Avatar, Collision, DebugCollision, DebugArea')
                    .attr({w: 80, h: 120});
        },

        Passer : function(headConfig, bodyConfig, wanderDistance) {
            this.Avatar(Game.depth.npc, headConfig, bodyConfig, false);
            this.collision([0,0],[this.width(), 0],[this.width(), this.height()],[0, this.height()]);
            
            $text_css = { 'size': '12px', 'family': 'Arial', 'color': 'red', 'text-align': 'center' };
            this.nameHud = Crafty.e('2D, DOM, Text')
			                     .attr({ x: 0, y: -10, w: 80 })
                                 .text(headConfig.id)
                                 .textColor('#FFFFFF')
                                 .textFont($text_css);
            this.attach(this.nameHud);

            var seed = Math.floor(Crafty.math.randomNumber(0, 100));
            if (seed % 2 === 0)
            {
                this.faceRight();
            }

            this.wanderDistance = wanderDistance || 0;
            if (this.wanderDistance > 0)
            {
                this.startWandering();
            }
            else
            {
                this.standby();
            }

            return this;
        },

        startWandering: function() {
            if (!this.isWandering)
            {
                this.isWandering = true;
                this.run();
                this.bind('EnterFrame', this.update);
            }
        },

        stopWandering: function() {
            if (!this.isWandering)
            {
                this.isWandering = false;
                this.standby();
                this.unbind('EnterFrame', this.update);
            }
        },

        update: function(data) {
            if (this.isWandering)
            {
                this.wander(this.horizontalSpeed, data.dt / 1000);
            }
        },
	
    });

});
