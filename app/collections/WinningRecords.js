// WinningRecords.js

define(["jquery", "backbone"],

    function ($, Backbone) {
        var Record = Backbone.Model.extend({
            
        });
        var WinningRecords = Backbone.Collection.extend({
            url:"app/data/winningrecords.json",
            model:Record
        });

        return WinningRecords;
    }

);