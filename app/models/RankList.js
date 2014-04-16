// Rank.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Rank = Backbone.Model.extend({
            url: "http://192.168.1.105:8008/footballgameService/Games/Top/5",
            //url: "app/data/ranklist.json"
        });

        return Rank;
    }

);