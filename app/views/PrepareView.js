// PrepareView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Prepare.html"],

    function ($, Backbone, Mustache, template) {

        var PrepareView = Backbone.View.extend({

            el: "#main",

            initialize: function (options) {
                
                this.listenTo(this, "render", this.postRender);
                this.render();
            },

            events: {
            },

            // Renders the view's template to the UI
            render: function () {
                this.template = _.template(template, {});
                  
                this.$el.html(Mustache.render(this.template, {}));

                this.trigger("render");

                return this;

            },
            
            postRender: function() {
                
            }
        });

        // Returns the View class
        return PrepareView;
    }

);