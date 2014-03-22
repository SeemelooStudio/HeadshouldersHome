define(["jquery", "backbone","mustache", "text!templates/Game.html", "animationscheduler", "crafty", "views/GameOverView"],
    function ($, Backbone, Mustache, template, AnimationScheduler, Crafty, GameOverView) {
        var GameView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#main",
            // View constructor
            initialize: function (options) {
                this.user = options.user;
                this.listenTo(this, "render", this.postRender);
                this.render();
            },
            // View Event Handlers
            events: {
                "tap #gameStart": "onClickStartGame",
                "tap #gameBackHome": "onClickBackHome",
                "tap #gameOver-lotto": "onClickLotto"
            },
            render: function(){
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, {}));
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
            },
            onClickStartGame: function(e) {
                var self = this;
                this.helpAnimationScheduler.animateOut(function(){
                    self.onStartGame();
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
            onStartGame: function() {
                var self = this;
                this.gameAnimationScheduler.animateIn(function(){
                    self.Game.start();
                });
            },
            onGameOver: function() {
                $("#loading").show();
               var self = this; 
               this.gameAnimationScheduler.animateOut();
               this.gameOverAnimationScheduler.animateIn(function(){
                   
                   setTimeout(function(){
                       var gameOverView = new GameOverView();
                       $("#loading").hide();
                   }, 1000);
               });
            },
            onClickLotto: function() {
                var self = this;
                this.mainAnimationScheduler.animateOut(function(){
                    $('body').scrollTop(0);
                    Backbone.history.navigate("lottery", { trigger: true, replace: false });
                });
            }
            
        });
        // Returns the View class
        return GameView;
    }
);
