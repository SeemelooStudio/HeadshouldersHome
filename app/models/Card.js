// Card.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Card = Backbone.Model.extend({
            default: {
                "isWinner" : false
            },
            url: "app/data/card.json",
            onFetchSuccess: function() {
                if ( this.has("type") && this.get("type") > 1 ) {
                    this.set("isWinner", true);
                }
            }
        });

        return Card;
    }

);