define(["jquery", "backbone","mustache", "text!templates/Game.html", "animationscheduler", "crafty", "models/Game", "views/GameOverView", "Utils"],
    function ($, Backbone, Mustache, template, AnimationScheduler, Crafty, Game,GameOverView, Utils) {
        var GameView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#main",
            // View constructor
            initialize: function (options) {
                this.user = options.user;
                this.gameTypeId = options.gameTypeId;
                this.listenTo(this, "render", this.postRender);
                if ( this.user.checkLogin() ) {
                    this.ready();
                } else {
                    this.listenToOnce(this.user,"onFetchSuccess", this.ready);
                }
                
            },
            // View Event Handlers
            events: {
                "tap #gameStart": "onClickStartGame",
                "tap #gameBackHome": "onClickBackHome",
                "tap #gameOver-lotto": "onClickLotto",
                "tap #gameOver-replay,#game-replay" : "onClickReplay",
                "tap #gameOver-leaderboard,#game-leaderboard": "onClickLeaderboard"
            },
            render: function(){
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));
                this.trigger("render");
                return this;                
            },
            postRender: function() {
                var self = this;
                $("#share").hide();
                this.mainAnimationScheduler = new AnimationScheduler(this.$el.find("#game"));
                this.gameAnimationScheduler = new AnimationScheduler(this.$el.find("#gameStage"));
                this.gameOverAnimationScheduler = new AnimationScheduler(this.$el.find("#gameOver"));
                this.helpAnimationScheduler = new AnimationScheduler(this.$el.find("#gameHelp,#gameBackHome"),{
                    "hideAtFirst":false
                });
                this.$score = this.$el.find("#game-topBar-score");
                this.$highestScore = this.$el.find("#game-topBar-high");
                this.$coupon = this.$el.find("#game-topBar-coupon");
                
                this.mainAnimationScheduler.animateIn();
                
                if ( this.Game ) {
                    self.$el.find("#gameStart").fadeIn();
                } else {
                require(["games/game","games/components","games/scene-game","games/scene-loading","games/scene-over"],function(Game){
                    self.$el.find("#gameStart").fadeIn();
                    self.Game = Game;
                    Game.registerEvents({
                        onGameOver: function() {
                            self.gameOver();
                        },
                        onCollectCoin: function() {
                            self.addCoupon();
                        },
                        onPassAmateur: function() {
                            self.addScore(2);
                        },
                        onPassObstacle: function() {
                            self.addScore(1);
                        },
                        onPassWorldClass: function() {
                            self.addScore(5);
                        },
                        onLoadComplete: function() {
                            $("#loading").hide();
                        }
                    });
                    
                });
                }
                
            },
            ready: function(){
                this.onExit();
                this.model = new Game({ gameId:this.gameId, user:this.user });
                this.render();
            },
            onClickStartGame: function(e) {
                var self = this;
                this.helpAnimationScheduler.animateOut(function(){
                    self.startGame();

                });
                
            },
            onClickBackHome: function(e) {
                var self = this;
                this.mainAnimationScheduler.animateOut(function(){
                    $('body').scrollTop(0);
                    Backbone.history.navigate("", { trigger: true, replace: true });
                });
                
            },
            onShowHelp: function() {
                this.helpAnimationScheduler.animateIn();
            },
            startGame: function() {
                var self = this;
                $("#loading").show();
                this.model.startGame({
                   success: function(){
                       self.Game.start();
                   },
                   error: function(msg) {
                       Utils.showError(msg);
                   }
               });
                this.gameAnimationScheduler.animateIn();

            },
            gameOver: function() {
                var self = this;
                $("#loading").show();
                this.Game.stop();
               this.model.submitResult({
                   success: function(){
                       var gameOverView = new GameOverView({ model: self.model});
                       $("#loading").hide();
                   },
                   error: function(msg) {
                       Utils.showError(msg);
                   }
               });
               this.gameAnimationScheduler.animateOut();
               this.gameOverAnimationScheduler.animateIn();
            },
            onClickLotto: function() {
                var self = this;
                this.mainAnimationScheduler.animateOut(function(){
                    $('body').scrollTop(0);
                    Backbone.history.navigate("lottery", { trigger: true, replace: true });
                });
            },
            onClickReplay: function(e) {
                  this.ready();
            },
            onClickLeaderboard: function(){
                var self = this;
                this.mainAnimationScheduler.animateOut(function(){
                    $('body').scrollTop(0);
                    Backbone.history.navigate("", { trigger: true, replace: true });
                });
            },
            addScore: function( score ) {
                this.model.addScore(score);
                var newScore = this.model.get("score");
                if ( newScore > this.model.get("highestScore") ) {
                    this.model.set("highestScore", newScore);
                    this.$highestScore.text(newScore);
                    Utils.highlight( this.$highestScore, "yellow");
                }
                this.$score.text( newScore );
                Utils.highlight( this.$score, "yellow");
            },
            addCoupon: function() {
                this.model.addCoupon();
                this.$coupon.text(this.model.get("coupon"));
                Utils.highlight( this.$coupon, "blue");
            },
            onExit: function() {
                if ( this.Game ) {
                    this.Game.stop();
                }
            }
            
        });
        // Returns the View class
        return GameView;
    }
);
