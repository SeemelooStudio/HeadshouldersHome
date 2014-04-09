// Card.js

define(["jquery", "backbone"],
    function ($, Backbone) {

        var Card = Backbone.Model.extend({
            defaults: {
              "isMessiDance":false,
              "isRabbitDance":false,
              "isSushiDance":false  
            },
            url: "http://192.168.1.104:8008/footballGameService/Prizes",
            initialize: function(){
              var dancerId = 0;
              dancerId = Math.floor(Math.random() * 3);
              if ( dancerId == 1 ) {
                 this.set("isRabbitDance",true);
               } else if ( dancerId == 2 ){
                 this.set("isSushiDance", true);
              } else {
                 this.set("isMessiDance", true);
              }  
            },
            //url: "app/data/card.json",
            saveAddress: function(options) {
                var self = this;
                $.ajax({
                  url: "http://192.168.1.104:8008/footballGameService/Prizes",
                  //url: "app/data/card.json",
                  dataType: "json",
                  type: 'PUT',
                  contentType: "application/json; charset=utf-8",
                  data: JSON.stringify({
                      prizeRedeemId: this.get("prizeRedeemId"),
                      shipTo: options.shipTo,
                      phoneNumber: options.phone,
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