// Rank.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Game = Backbone.Model.extend({
            defaults: {
                "score": 0,
                "coupon": 0
            },
            initialize: function (options) {
                switch (options.gameTypeId) {
                    case 1:
                        this.set({
                            "highestScore": options.user.get("dribbleGameScore"),
                            "originGameRanking": options.user.get("dribbleGameRanking")
                        });
                        break;

                    case 2:
                        this.set({
                            "highestScore": options.user.get("passGameScore"),
                            "originGameRanking": options.user.get("passGameRanking")
                        });
                        break;

                    default:
                        this.set({
                            "highestScore": options.user.get("shootGameScore"),
                            "originGameRanking": options.user.get("shootGameRanking")
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
                console.log( this.get("coupon"));
            },
            addScore: function (score) {
                this.set("score", this.get("score") + score);
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
                    dataType: "json",
                    data: JSON.stringify({
                        gameTypeId: self.get("gameTypeId"),
                        userId: self.get("userId")
                    }),
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data, textStatus, jqXHR) {
                        console.log(data.gameId);
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
                console.log(JSON.stringify({
                        gameId: self.get("gameId"),
                        gameTypeId: self.get("gameTypeId"),
                        userId: self.get("userId"),
                        score: self.get("score"),
                        coupon: self.get("coupon") - self.get("originCoupon")
                    }));
                $.ajax({
                    url: "http://192.168.1.100:8008/footballgameservice/Games",
                    dataType: "json",
                    data: JSON.stringify({
                        gameId: self.get("gameId"),
                        gameTypeId: self.get("gameTypeId"),
                        userId: self.get("userId"),
                        score: self.get("score"),
                        coupon: self.get("coupon") - self.get("originCoupon")
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
            },
            processSuccessData: function (data) {
                this.set(data);
                this.set("originCoupon", this.get("coupon"));
                this.set("originGameRanking", this.get("gameRanking"));
                this.set("originTotalRanking", this.get("totalRanking"));
                var accumulatePoints = this.get("score") + this.get("originTotalScore");
                this.set("accumulatePoints", accumulatePoints);
            }
        });

        return Game;
    }

);