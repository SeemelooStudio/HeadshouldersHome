define(["jquery", "backbone","mustache", "text!templates/Game.html","hammerjs", "crafty"],
    function ($, Backbone, Mustache, template, Hammer, Crafty) {
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

            },
            render: function(){
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, {}));
                this.trigger("render");
                return this;                
            },
            postRender: function() {
                this.$el.hammer();
                Hammer.plugins.fakeMultitouch();
                require(["games/game","games/components","games/scene-game","games/scene-loading","games/scene-over"],function(Game){
                    Game.start();
                });
            }
        });
        // Returns the View class
        return GameView;
    }
);