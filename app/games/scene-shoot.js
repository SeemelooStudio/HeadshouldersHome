define(["crafty", "games/game", "games/player-config"], function (Crafty, Game, PlayerConfig) {

    Crafty.scene('ShootGame', function() {
        var self = this;

        self.onEnterFrame = function(data) {
        };

        self.field = Crafty.e('Field');
        self.goal = Crafty.e('Goal');
        self.goal.attr({x: Game.width / 2 - self.goal._w / 2, y: 0});

        self.lifeHud = Crafty.e('LifeHud');
        self.lifeHud.attr({x: Game.width - self.lifeHud.getWidth() - 10,
                           y: Game.height - self.lifeHud.getHeight() - 10})

        self.bind('EnterFrame', self.onEnterFrame);
    }, 
    function() { 
        var self = this;
        self.unbind('EnterFrame', self.onEnterFrame);
        Crafty.removeEvent(self, Crafty.stage.elem, self.touchEvent, self.onMouseDown);
    });

});
