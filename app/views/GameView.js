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
                "tap #gameOver-lotto": "onClickLotto"
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
                this.helpAnimationScheduler = new AnimationScheduler(this.$el.find("#gameHelp"),{
                    "hideAtFirst":false
                });
                
                this.mainAnimationScheduler.animateIn();
                require(["games/game","games/components","games/scene-game","games/scene-loading","games/scene-over"],function(Game){
                    self.$el.find("#gameStart").fadeIn();
                    self.Game = Game;
                    
                });
                this.$score = this.$el.find("#game-topBar-score");
                this.$highestScore = this.$el.find("#game-topBar-high");
                this.$coupon = this.$el.find("#game-topBar-coupon");
            },
            ready: function(){
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
                    Backbone.history.navigate("", { trigger: true, replace: false });
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
                       $("#loading").hide();
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
                    Backbone.history.navigate("lottery", { trigger: true, replace: false });
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
                this.text(this.model.get("coupon"));
                Utils.highlight( this.$coupon, "blue");
            },
            pause: function() {
                
            },
            restart: function(){
                
            }
            
        });
        // Returns the View class
        return GameView;
    }
);