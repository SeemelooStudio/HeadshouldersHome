define(["crafty", "games/game", "games/player-config"], function (Crafty, Game, PlayerConfig) {

Crafty.c('Goal', {
	init: function() {
		var self = this;

		self.requires('Actor, SpriteGate').attr({z: Game.depth.goal});

        self.backgrounds = [];
		var numOfTiles = Math.ceil(Game.width / 120);
        var startX = self._w / 2 - numOfTiles / 2 * 120;
        var startY = -28;

        for (var i = 0; i < numOfTiles; i ++)
        {
            var background = Crafty.e('Actor, SpriteSky').attr(
            {
                w : 120,
                h : 140,
                x : startX + i * 120,
                y : startY,
                z : Game.depth.goal - 1,
            });
            self.backgrounds.push(background);
            self.attach(background);
        }
	},
});

Crafty.c('LifeHud', {
    iconSize : 30,
    iconGap : 10,
    maxNumOfLife : 5,

    init: function() {
        var self = this;

        self.requires('Actor');
        self.icons = [];

        for (var i = 0; i < self.maxNumOfLife; i++)
        {
            var icon = Crafty.e('Actor, SpriteBall');
            icon.attr(
            {
                w : self.iconSize,
                h : self.iconSize,
                x : 0,
                y : (self.iconSize + self.iconGap) * i,
                z : Game.depth.hud
            });
            self.icons.push(icon);
            self.attach(icon);
        }

        var headSize = self.iconSize * 2;
        self.messiHead = Crafty.e('Head').Head(PlayerConfig.head_configs.messi)
                               .attr({w: headSize, 
                                      h: headSize,
                                      x: self.iconSize / 2 - headSize / 2,
                                      y: -self.iconGap - headSize,
                                      z: Game.depth.hud})
        self.attach(self.messiHead);

        self.height =  self.iconSize * self.maxNumOfLife + self.iconGap * (self.maxNumOfLife - 1);
    },
    
    getWidth: function() {
        return this.iconSize; 
    },

    getHeight: function() {
        return this.height;
    }
});

});
