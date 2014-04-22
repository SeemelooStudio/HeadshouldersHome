// RuleView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Rule.html", "animationscheduler"],
    function ($, Backbone, Mustache, template, AnimationScheduler) {
        var RuleView = Backbone.View.extend({

            el: "#main",
            
            initialize: function (options) {
                this.listenTo(this, "render", this.postRender);
                this.render();
                _hmt.push(['_trackPageview', '/Rule']);  
            },

            events: {
                "tap #ruleBackHome,#ruleBackHomeTop": "onBackHome"
            },
            render: function () {
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, {}));
                
                this.trigger("render");
                return this;
            },
            postRender: function() {
                if ( window.self !== window.top ) {
                    var top = this.$el.position().top;
                    this.$el.find("#ruleMain").css({
                      "height":$(window).height() - top - 120,
                      "overflow-y":"scroll"  
                    });
                }
                
            },
            onBackHome: function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                
                Backbone.history.navigate("", { trigger: true, replace: true });
            }
        });
        return RuleView;
    }

);