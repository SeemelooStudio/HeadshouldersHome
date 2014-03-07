// RankView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Rank.html"],

    function ($, Backbone, Mustache, template) {

        var RankView = Backbone.View.extend({

            el: ".leaderboard-list",

            initialize: function () {
                this.listenTo(this.collection, "change", this.render);
                this.listenTo(this, "render", this.postRender);
                this.render();
            },

            events: {
            },

            // Renders the view's template to the UI
            render: function () {
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, { "ranks" : this.collection.toJSON() }));

                this.trigger("render");

                return this;

            },
            
            postRender: function() {

            }
        });

        // Returns the View class
        return RankView;
    }

);