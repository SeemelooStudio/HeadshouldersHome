// Rank.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Rank = Backbone.Model.extend({

            idAttribute: "rankId"

        });

        return Rank;
    }

);