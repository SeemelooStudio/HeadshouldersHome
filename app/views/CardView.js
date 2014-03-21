// CardView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Card.html"],

    function ($, Backbone, Mustache, template, Hammer) {

        var CardView = Backbone.View.extend({

            el: "#envelope-content",

            initialize: function (options) {
                this.render();
            },
            render: function () {
                this.template = _.template(template, {});                
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));
                return this;
            }
        });

        // Returns the View class
        return CardView;
    }

);