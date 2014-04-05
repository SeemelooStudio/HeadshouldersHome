// Rank.js

define(["jquery", "backbone"],

    function ($, Backbone) {
        var GameConfig = {
            badScoreLine : 6
        };
        var Game = Backbone.Model.extend({
            defaults: {
                "score": 0,
                "coupon": 0,
                "isBreakRecord": false,
                "isBad": false
            },
            initialize: function (options) {
                switch (options.gameTypeId) {
                    case 1:
                        this.set({
                            "highestScore": options.user.get("dribbleGameScore"),
                            "originGameRanking": options.user.get("dribbleGameRanking"),
                            "isDribbleGame": true
                            });
                        break;

                    case 2:
                        this.set({
                            "highestScore": options.user.get("passGameScore"),
                            "originGameRanking": options.user.get("passGameRanking"),
                            "isPassGame": true

                        });
                        break;

                    default:
                        this.set({
                            "highestScore": options.user.get("shootGameScore"),
                            "originGameRanking": options.user.get("shootGameRanking"),
                            "isShootGame": true
                            });
                        break;
                }
                this.set({
                    "gameTypeId": options.gameTypeId,
                    "originTotalRanking": options.user.get("accumulatePointsRanking"),
                    "originTotalScore": options.user.get("accumulatePoints"),
                    "originCoupon": options.user.get("numOfCoupons"),
                    "coupon": options.user.get("numOfCoupons"),
                    "userId": options.user.get("userId")
                });
                this.isResultSubmitted = false;
                this.originGameId = 0;
            },
            addScore: function (score) {
                this.set("score", this.get("score") + score);
                var newScore = this.get("score");
                if ( newScore > this.get("highestScore") ) {
                    this.set("highestScore", newScore);
                    this.set("isBreakRecord", true);
                }
            },
            addCoupon: function () {
                this.set("coupon", this.get("coupon") + 1);
            },
            startGame: function (options) {
                var self = this;
                this.set("score",0);
                this.set("coupon", this.get("originCoupon"));
                $.ajax({
                    url: "http://192.168.1.100:8008/footballgameservice/Games",
                    //url: "app/data/startgame.json",
                    dataType: "json",
                    data: JSON.stringify({
                        gameTypeId: self.get("gameTypeId"),
                        userId: self.get("userId")
                    }),
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data, textStatus, jqXHR) {
                        self.set("gameId", data.gameId);
                        
                        options.success();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        options.error(textStatus + ": " + errorThrown);
                    }
                });
            },
            submitResult: function (options) {
                var self = this;
                if ( this.originGameId == this.get("gameId") ) {
                    //is Submitted
                    $("#loading").hide();
                    return;
                } else {
                    self.originGameId = self.get("gameId");
                    $.ajax({
                        url: "http://192.168.1.100:8008/footballgameservice/Games",
                        //url: "app/data/gameresult.json",
                        dataType: "json",
                        data: JSON.stringify({
                            gameId: self.get("gameId"),
                            gameTypeId: self.get("gameTypeId"),
                            userId: self.get("userId"),
                            score: self.get("score"),
                            numOfCoupons: self.get("coupon") - self.get("originCoupon")
                        }),
                        type: 'PUT',
                        contentType: "application/json; charset=utf-8",
                        success: function (data, textStatus, jqXHR) {
                            self.processSuccessData(data);
                            options.success();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            options.error(textStatus + ": " + errorThrown);
                        }
                    });                    
                }
                

            },
            processSuccessData: function (data) {
                this.set(data);
                var totalRanking = this.get("totalRanking");
                var originTotalRanking = this.get("originTotalRanking");
                
                if ( this.get("score") < GameConfig.badScoreLine ) {
                    this.set("isBad", true);
                }
                if ( totalRanking < originTotalRanking ) {
                    this.set("isRankUp", true);
                    this.set("rankGap", originTotalRanking - totalRanking);
                } else {
                    this.set("isRankUp", false);
                    this.set("rankGap", 0);
                }
                this.set("originCoupon", this.get("coupon"));
                this.set("originGameRanking", this.get("gameRanking"));
                this.set("originTotalRanking", this.get("totalRanking"));
                var accumulatePoints = this.get("score") + this.get("originTotalScore");
                this.set("accumulatePoints", accumulatePoints);
            },
            revive: function(reviveCouponNum) {
                this.set("coupon", this.get("coupon") - reviveCouponNum);
                if ( this.get("coupon") < 0 ) {
                    this.set("coupon", 0);
                }
            }
        });

        return Game;
    }

);