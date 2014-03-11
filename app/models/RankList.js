// Rank.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Rank = Backbone.Model.extend({
            url: "app/data/ranklist.json",
        });

        return Rank;
    }

);