define(["jquery", "backbone","animationscheduler"],
    function ($, Backbone, AnimationScheduler) {
        var MainView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "body",
            // View constructor
            initialize: function (options) {
                this.headerAnimationScheduler = new AnimationScheduler(this.$el.find("#header"), {
                    hideAtFirst: false
                });
            },
            // View Event Handlers
            events: {
                "click #logo":"onClickLogo"
            },
            onClickLogo: function() {

            },
            hideHeader: function(callback) {
                if ($("#header").is(":hidden")) {
                    callback();
                } else {
                this.headerAnimationScheduler.animateOut(callback);
                }
            },
            showHeader: function(callback) {
                if ($("#header").is(":visible")) {
                    callback();
                } else {
                this.headerAnimationScheduler.animateIn(callback);
                }

            }
        });
        // Returns the View class
        return MainView;
    }
);