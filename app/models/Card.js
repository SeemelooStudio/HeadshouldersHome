// Card.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Card = Backbone.Model.extend({
            url: "http://192.168.1.100:8008/footballGameService/Prizes",
            saveAddress: function(options) {
                var self = this;
                $.ajax({
                  url: "http://192.168.1.100:8008/footballGameService/Prizes",
                  dataType: "json",
                  type: 'PUT',
                  contentType: "application/json; charset=utf-8",
                  data: JSON.stringify({
                      prizeRedeemId: this.get("prizeRedeemId"),
                      shipTo: options.shipTo,
                      phone: options.phone,
                      shippingAddress:options.shippingAddress
                  }),
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