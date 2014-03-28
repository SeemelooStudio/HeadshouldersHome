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
                if ( this.user.get("hasData") ) {
                    this.ready();
                } else {
                    this.listenToOnce(this.user,"onFetchSuccess", this.ready);
                }
                
            },
            // View Event Handlers
            events: {
                "tap #gameStart": "onClickStartGame",
                "tap .backhome": "onClickBackHome",
                "tap #gameOver-lotto": "onClickLotto",
                "tap #gameOver-replay,#game-replay" : "onClickReplay",
                "tap #game-share":"onClickShare"
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
                this.gameOverAnimationScheduler = new AnimationScheduler(this.$el.find("#gameOverWhistle"));
                this.helpAnimationScheduler = new AnimationScheduler(this.$el.find("#gameHelp"),{
                    "hideAtFirst":false
                });
                this.$score = this.$el.find("#game-score");
                this.$highestScore = this.$el.find("#game-topBar-high");
                this.$coupon = this.$el.find("#game-coupon");
                
                this.mainAnimationScheduler.animateIn();
                

                require(["games/game", "games/components", "games/object-randomizer"],function(Game, InitComponents, InitObjectRandomizer){
                    
                    self.Game = Game;
                    Game.registerEvents({
                        onGameOver: function() {
                            self.gameOver();
                        },
                        onCollectCoin: function() {
                            self.addCoupon();
                        },
                        onPassAmateur: function() {
                            self.addScore(1);
                        },
                        onPassObstacle: function() {
                        },
                        onPassWorldClass: function() {
                            self.addScore(1);
                        },
                        onLoadComplete: function() {
                            $("#loading").hide();
                        }
                    });

                    InitComponents();
                    InitObjectRandomizer();

                    require(["games/scene-game","games/scene-loading","games/scene-over"], function(){
                        self.$el.find("#gameStart").fadeIn();
                    });
                    
                });
                
            },
            ready: function(){
                this.model = new Game({ gameId:this.gameId, user:this.user, gameTypeId : this.gameTypeId });
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
                    Backbone.history.navigate("", { trigger: false, replace: true });
                    window.location.reload();
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
                       //self.Game.pause();
                   },
                   error: function(msg) {
                       Utils.showError(msg);
                   }
               });
                this.gameAnimationScheduler.animateIn();

            },
            gameOver: function() {
                var self = this;
                var isTimeUp = false;
                var isSubmited = false;
               this.model.submitResult({
                   success: function(){
                       isSubmited = true;
                       if ( isTimeUp ) {
                           self.gameAnimationScheduler.animateOut();
                           self.gameOverAnimationScheduler.animateOut();
                           self.gameOverView = new GameOverView({ model: self.model});
                           isGameOverShown = true;
                       }
                       
                       $("#loading").hide();
                   },
                   error: function(msg) {
                       Utils.showError(msg);
                   }
               });
               
               this.gameOverAnimationScheduler.animateIn( function(){
                   var timeout = setTimeout(function(){
                       isTimeUp = true;
                       clearTimeout(timeout);
                       if ( isSubmited ) {
                            self.gameAnimationScheduler.animateOut();
                            self.gameOverAnimationScheduler.animateOut();
                            self.gameOverView = new GameOverView({ model: self.model});
                           
                       } else {
                           $("#loading").hide();
                       }
                       
                   }, 500);
               });
               self.Game.pause();
            },
            onClickLotto: function() {
                var self = this;
                this.onExit();
                this.mainAnimationScheduler.animateOut(function(){
                    $('body').scrollTop(0);
                    Backbone.history.navigate("lottery", { trigger: true, replace: true });
                });
            },
            onClickReplay: function(e) {
                  if ( this.gameOverView ) {
                      this.gameOverView.onExit();
                  }
                  this.restartGame();
                  this.gameAnimationScheduler.animateIn();
                  
            },
            onClickLeaderboard: function(){
                var self = this;
                this.onExit();
                this.mainAnimationScheduler.animateOut(function(){
                    $('body').scrollTop(0);
                    Backbone.history.navigate("", { trigger: true, replace: true });
                });
            },
            restartGame: function(){
                var self = this;
                $("#loading").show();
                this.$score.text("0");
                this.$coupon.text( this.model.get("originCoupon"));
                this.model.startGame({
                   success: function(){
                       self.Game.restart();
                       $("#loading").hide();
                   },
                   error: function(msg) {
                       Utils.showError(msg);
                   }
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
            onClickShare: function() {
                this.Game.pause();
            }
            
        });
        // Returns the View class
        return GameView;
    }
);
