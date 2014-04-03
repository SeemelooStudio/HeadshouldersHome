define(["jquery", "backbone","mustache", "text!templates/GameOver.html", "animationscheduler"],
    function ($, Backbone, Mustache, template, AnimationScheduler) {
        var GameOverView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#gameOver",
            // View constructor
            initialize: function () {
                this.listenTo(this, "render", this.postRender);
                this.render();
            },
            render: function(){
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));
                this.trigger("render");
                return this;                
            },
            postRender: function() {
                var self = this;
                this.mainAnimation = new AnimationScheduler(this.$el.find(".container"));
                this.mainAnimation.animateIn(function(){
                    self.$el.find("#gameOverBg").removeClass("hidden").fadeIn(function(){
                        $(this).addClass("rotate");
                        self.$el.find("#gameOverScore").addClass("animated tada");
                        self.$el.find("#gameOver-newRecord").show().addClass("animated rollIn");
                    });
                });
            },
            onExit: function() {
                this.mainAnimation.animateOut();
            }
            
        });
        // Returns the View class
        return GameOverView;
    }
);