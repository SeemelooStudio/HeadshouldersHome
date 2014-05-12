// Rank.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Rank = Backbone.Model.extend({
            url: "http://192.168.1.101:8008/footballgameService/Games/Top/5" + "?ts=" + (new Date()).getTime(),

            //url: "app/data/ranklist.json"
        });

        return Rank;
    }

);