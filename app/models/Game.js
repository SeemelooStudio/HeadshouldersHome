// Rank.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Game = Backbone.Model.extend({
            default: {
                gameId : 1
            }
        });

        return Game;
    }

);