// CardView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Card.html","hammerjs"],

    function ($, Backbone, Mustache, template, Hammer) {

        var CardView = Backbone.View.extend({

            el: "#envelope-content",

            initialize: function (options) {
                this.listenTo(this.model, "change", this.render);
                this.listenTo(this, "render", this.postRender);
            },

            events: {
            },

            render: function () {
                this.template = _.template(template, {});                
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));
                this.trigger("render");
                return this;

            },
            
            postRender: function() {

            }
        });

        // Returns the View class
        return CardView;
    }

);