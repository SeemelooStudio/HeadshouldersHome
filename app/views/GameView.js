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
                
                this.defaultReviveCouponNum = 20;
                this.reviveCouponNum = this.defaultReviveCouponNum;
                this.isGameover = false;
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
                this.$newRecord = this.$el.find("#game-newRecord");
                this.$coupon = this.$el.find("#game-coupon");
                
                this.mainAnimationScheduler.animateIn();
                
                
                require(["games/game", "games/components", "games/components-pass", "games/object-randomizer", "games/scene-loading", "games/scene-dribble", "games/scene-pass"],function(Game){
                    
                    self.Game = Game;
                    Game.registerEvents({
                        onGameOver: function() {
                            console.log("gameOver");
                            self.onGameOver();
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
                        },
                        onPlayerTrapBall: function(playerId) {
                            self.addScore(1);
                            self.onPlayerTrapBall();
                        }
                    });

                    //InitComponents();
                    //InitObjectRandomizer();

                    //require([], function(){
                        self.$el.find("#gameStart").fadeIn();
                    //});
                    
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
                this.Game.pause();
                Backbone.history.navigate("", { trigger: false, replace: true });
                this.mainAnimationScheduler.animateOut(function(){
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
                       self.Game.start(self.model.get("sceneName"));
                       if ( self.gameTypeId == 2 ) {
                           self.onPlayerTrapBall(1);
                       }
                       
                       //self.Game.pause();
                   },
                   error: function(msg) {
                       Utils.showError(msg);
                   }
               });
                this.gameAnimationScheduler.animateIn();

            },
            onPlayerTrapBall: function() {
                /*
                $("#game-dialog").show().addClass("animated slideInLeft");

                var timeout = setTimeout(function(){
                    $("#game-dialog").removeClass("animated slideInLeft").hide();
                    clearTimeout(timeout);
                }, 2000);
                */             
            },
            gameOver: function() {
               var self = this;
               var isTimeUp = false;
               var isSubmited = false;
               self.Game.pause();
               
               this.model.submitResult({
                   success: function(){
                       isSubmited = true;
                       if ( isTimeUp ) {
                           self.showGameOverView();

                       }
                       if( self.model.get("isBad")) {
                           Utils.setPageTitle(self.model.get("badText") + self.model.get("shareResultBegin") + self.model.get("score") + self.model.get("shareResultEnd"));
                       } else if( self.model.get("isBreakRecord")) {
                           Utils.setPageTitle( self.model.get("shareResultBegin") + self.model.get("score") + self.model.get("shareResultEnd"));
                       } else {
                           Utils.setPageTitle(self.model.get("goodText") + self.model.get("shareResultBegin") + self.model.get("score") + self.model.get("shareResultEnd"));
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
                            self.showGameOverView();
                            
                       } else {
                           $("#loading").show();
                       }
                       
                   }, 500);
               });
               
            },
            showGameOverView: function() {
                this.gameAnimationScheduler.animateOut();
                this.gameOverAnimationScheduler.animateOut();
                this.gameOverView = new GameOverView({ model: this.model});
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
                this.isGameover = false;
                $("#loading").show();
                this.$score.text("0");
                this.$coupon.text( this.model.get("originCoupon"));
                this.$newRecord.hide();
                this.reviveCouponNum = this.defaultReviveCouponNum;
                this.model.startGame({
                   success: function(){
                       self.Game.restart();
                       if ( self.gameTypeId == 2 ) {
                           self.onPlayerTrapBall(1);
                       }
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
                if ( this.model.get("isBreakRecord") ) {
                    this.$newRecord.show();
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
            },
            onGameOver: function() {
                var self = this;
                
                if ( this.isGameover ) {
                    return;
                } else {
                    this.Game.pause();
                    this.isGameover = true;
                    if ( this.model.get("coupon") > this.reviveCouponNum ) {
                        Utils.showConfirm({
                            title: "好可惜啊！",
                            content: "土豪，你愿意花 <span class='lotto-pointsCount'>" + this.reviveCouponNum + "</span>张 奖券继续比赛么？",
                            okText:"潇洒地花掉",
                            cancelText:"算了",
                            ok: function() {
                                self.continueGame();
                            },
                            cancel: function() {
                                self.gameOver();
                            }
                        });
                    } else {
                        this.gameOver();
                    }                    
                }

            },
            continueGame: function() {
                this.model.revive(this.reviveCouponNum);
                this.$coupon.text( this.model.get("coupon"));
                this.reviveCouponNum  = this.reviveCouponNum * 2;
                this.Game.restart();
                this.isGameover = false;
            }
            
        });
        // Returns the View class
        return GameView;
    }
);
