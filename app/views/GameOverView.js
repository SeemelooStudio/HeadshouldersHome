define(["jquery", "backbone","mustache", "text!templates/GameOver.html"],
    function ($, Backbone, Mustache, template) {
        var GameOverView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#gameOverContent",
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
            }
            
        });
        // Returns the View class
        return GameOverView;
    }
);