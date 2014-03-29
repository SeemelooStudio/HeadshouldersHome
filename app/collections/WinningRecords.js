// WinningRecords.js

define(["jquery", "backbone"],

    function ($, Backbone) {
        var Record = Backbone.Model.extend({
            
        });
        var WinningRecords = Backbone.Collection.extend({
            url: function() {
                return "http://192.168.1.100:8008/footballgameservice/prizes/" + this.userId;
            },
            model:Record
        });

        return WinningRecords;
    }

);