// Card.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Card = Backbone.Model.extend({
            url: "app/data/card.json",
            saveAddress: function(options) {
                var self = this;
                $.ajax({
                  url: "app/data/card.json",
                  dataType:"json",
                  data: {
                      prizeRedeemId: this.get("prizeRedeemId"),
                      shipTo: options.shipTo,
                      phone: options.phone,
                      shippingAddress:options.shippingAddress
                  },
                  success: function(data, textStatus, jqXHR){
                      options.success();
                  },
                  error: function(jqXHR, textStatus, errorThrown){
                      options.error( textStatus + ": " + errorThrown);
                  }
                });
            }
        });

        return Card;
    }

);