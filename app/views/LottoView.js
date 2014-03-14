define(["jquery", "backbone","mustache", "text!templates/Lotto.html", "animationscheduler"],
    function ($, Backbone, Mustache, template, AnimationScheduler) {
        var LottoView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#main",
            // View constructor
            initialize: function (options) {
                this.listenTo(this, "render", this.postRender);
                this.listenTo(this.model,"onFetchSuccess", this.render);
                
            },
            // View Event Handlers
            events: {
                "touch #lottoBackHome":"onClickBack"
            },
            render: function(){
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));
                this.trigger("render");
                return this;                
            },
            postRender: function() {
                this.$el.hammer();
                Hammer.plugins.fakeMultitouch();
                this.mainAnimationScheduler = new AnimationScheduler(this.$el.find("#lotto"));
                this.mainAnimationScheduler.animateIn();
            },
            onClickBack: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                $('body').scrollTop(0);
                this.$el.find("#lottoBackHome").fadeOut();
                this.mainAnimationScheduler.animateOut(function(){
                    Backbone.history.navigate("", { trigger: true, replace: true });
                });
                
            }
        });
        // Returns the View class
        return LottoView;
    }
);