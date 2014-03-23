// Rank.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Game = Backbone.Model.extend({
            defaults: {
                "score": 0,
                "coupon": 0
            },
            initialize: function( options ) {
                switch( options.gameTypeId ) {
                    case 1:
                        this.set({
                           "highestScore" : options.user.get("dribbleGameScore"),
                           "originGameRanking": options.user.get("dribbleGameRanking")
                        });
                    break;
                    
                    case 2:
                        this.set({
                           "highestScore" : options.user.get("passGameScore"),
                           "originGameRanking": options.user.get("passGameRanking")
                        });
                    break;
                    
                    default:
                        this.set({
                           "highestScore" : options.user.get("shootGameScore"),
                           "originGameRanking": options.user.get("shootGameRanking")
                        });
                    break;
                }
                this.set({
                        "gameTypeId": options.gameTypeId,
                        "originTotalRanking": options.user.get("accumulatePointsRanking"),
                        "originTotalScore": options.user.get("accumulatePoints"),
                        "originCoupon": options.user.get("numOfCoupons"),
                        "coupon": options.user.get("numOfCoupons")
                });
            },
            addScore: function( score ){
                this.set("score", this.get("score") + score);
            },
            addCoupon: function(){
                this.set("coupon", this.get("coupon") + 1);
            },
            startGame: function(options){
                var self = this;
                $.ajax({
                  url: "app/data/startgame.json",
                  dataType:"json",
                  data: {
                      gameTypeId:this.get("gameTypeId"),
                      userId:this.get("userId")
                  },
                  success: function(data, textStatus, jqXHR){
                      self.set("gameId", data.gameId); 
                      options.success();
                  },
                  error: function(jqXHR, textStatus, errorThrown){
                      options.error( textStatus + ": " + errorThrown);
                  }
                });
            },
            submitResult: function(options){
                var self = this;
                $.ajax({
                  url: "app/data/gameresult.json",
                  dataType:"json",
                  data: {
                      gameTypeId:this.get("gameTypeId"),
                      gameId:this.get("gameId"),
                      userId:this.get("userId"),
                      score:this.get("score"),
                      coupon:this.get("coupon") - this.get("originCoupon")
                  },
                  success: function(data, textStatus, jqXHR){
                      self.processSuccessData(data);
                      options.success();
                  },
                  error: function(jqXHR, textStatus, errorThrown){
                      options.error( textStatus + ": " + errorThrown);
                  }
                });
            },
            processSuccessData: function(data){
                this.set(data);
                var accumulatePoints = this.get("score") + this.get("originTotalScore");
                this.set("accumulatePoints", accumulatePoints);
            }
        });

        return Game;
    }

);