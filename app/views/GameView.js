define(["jquery", "backbone","mustache", "text!templates/Game.html", "animationscheduler", "crafty"],
    function ($, Backbone, Mustache, template, AnimationScheduler, Crafty) {
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
                "tap #gameBackHome": "onClickBackHome"
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
                this.mainAnimationScheduler = new AnimationScheduler(this.$el.find("#gameStage"));
                this.mainAnimationScheduler.animateIn();
                require(["games/game","games/components","games/scene-game","games/scene-loading","games/scene-over"],function(Game){
                    self.$el.find("#gameStart").fadeIn();
                    self.Game = Game;
                    
                });
            },
            onClickStartGame: function(e) {
                var self = this;
                this.$el.find("#game-help").fadeOut(function(){
                    self.Game.start();
                });
                
            },
            onClickBackHome: function(e) {
                var self = this;
                this.mainAnimationScheduler.animateOut(function(){
                    $('body').scrollTop(0);
                    Backbone.history.navigate("", { trigger: true, replace: true });
                });
                
            }
            
        });
        // Returns the View class
        return GameView;
    }
);