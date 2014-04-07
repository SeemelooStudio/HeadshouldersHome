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
            //this.attach(this.cameraAnchor);

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
            this.cameraAnchor.y = this._y - 200; 

            Crafty.viewport.centerOn(this.cameraAnchor, 1000);
        },

        getDirection: function() {
            this.direction.setValues(this.arrow._x - this._x, 
                                     this.arrow._y - this._y);
            //console.log(this.direction.toString());
            return this.direction;
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
        init: function() {
            this.requires('Avatar, Collision, DebugCollision, DebugArea')
                    .attr({w: 80, h: 120});
        },

        Passer : function(headConfig, bodyConfig) {
            this.Avatar(Game.depth.npc, headConfig, bodyConfig, false);
            this.collision([0,0],[this.width(), 0],[this.width(), this.height()],[0, this.height()]);

            var seed = Math.floor(Crafty.math.randomNumber(0, 100));
            if (seed % 2 === 0)
            {
                this.faceRight();
            }

            return this;
        },

        onBallHit: function(player) {
            return true;
        }
	
    });

});
