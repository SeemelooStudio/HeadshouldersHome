define(["jquery", "backbone","animationscheduler", "Utils"],
    function ($, Backbone, AnimationScheduler, Utils) {
        var MainView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "body",
            // View constructor
            initialize: function (options) {
                this.headerAnimationScheduler = new AnimationScheduler(this.$el.find("#header"), {
                    hideAtFirst: false
                });
                this.$el.hammer();
            },
            // View Event Handlers
            events: {
                "click #logo":"onClickLogo",
                "tap #shareOverlay":"onClickShareOverlay",
                "tap .share":"onClickShare"
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

            },
            onClickShareOverlay: function(e) {
                $("#shareOverlay").hide();
            },
            onClickShare: function(e) {
                var pic = $(e.currentTarget).attr("data-pic");
                Utils.share(pic);
            }
        });
        // Returns the View class
        return MainView;
    }
);