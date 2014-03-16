define(["jquery", "backbone","mustache", "text!templates/Lotto.html", "animationscheduler","hammerjs"],
    function ($, Backbone, Mustache, template, AnimationScheduler,Hammer) {
        var LottoView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#main",
            // View constructor
            initialize: function (options) {
                this.listenTo(this, "render", this.postRender);
                this.render();
                
            },
            // View Event Handlers
            events: {
                "touch #lottoBackHome":"onClickBack",
                "touch #envelope-sealing" :"onClickCard"
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
                
                this.miceAnimationScheduler = new AnimationScheduler(this.$el.find("#lottoLogo,#lotto-info,#lottoActions,#lottoAward"), {
                    "hideAtFirst":false
                });
            },
            onClickCard: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                this.miceAnimationScheduler.animateOut();
                $("#envelope-arrow").hide();
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