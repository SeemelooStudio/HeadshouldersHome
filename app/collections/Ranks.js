// Ranks.js

define(["jquery", "backbone", "models/Rank" ],

    function ($, Backbone, Rank) {

        var Ranks = Backbone.Collection.extend({
            url: "app/data/ranks.json",
            model: Rank
        });

        return Ranks;
    }

);