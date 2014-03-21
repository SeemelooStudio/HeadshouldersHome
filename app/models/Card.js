// Card.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Card = Backbone.Model.extend({
            url: "app/data/card.json"
        });

        return Card;
    }

);