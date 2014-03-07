define(["jquery", "backbone","animationscheduler"],
    function ($, Backbone, AnimationScheduler) {
        var MainView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "body",
            // View constructor
            initialize: function (options) {
                
            },
            // View Event Handlers
            events: {
                "click #logo":"onClickLogo"
            },
            onClickLogo: function() {

            }
        });
        // Returns the View class
        return MainView;
    }
);