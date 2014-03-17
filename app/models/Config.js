// Config.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Config = Backbone.Model.extend({
            url: "app/data/config.json",
        });

        return Config;
    }

);