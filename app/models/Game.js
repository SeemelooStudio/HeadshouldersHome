// Rank.js

define(["jquery", "backbone"],

    function ($, Backbone) {
        var GameConfig = {
            badScoreLine : 6,
            dribble_share_default_text: "",
            dribble_share_result_text_begin:"我竟然晃过了",
            dribble_share_result_text_end:"个足坛巨星！你也过得去算你NB！",
            dribble_bad_text:"难过史了!!",
            dribble_good_text:"NB不是一两天!",
            pass_share_default_text: "",
            pass_share_result_text_begin:"我在竟然过了",
            pass_share_result_text_end:"个足坛巨星！你敢试试么？",
            pass_bad_text:"传你妹阿!!",
            pass_good_text:"NB不是一两天",
            shoot_share_default_text: "",
            shoot_share_result_text_begin:"#海飞丝巴西实力挑战赛# 面对足坛巨星的围追堵截，过得去算你NB。我刚刚在带球游戏中获得了",
            shoot_share_result_text_end:"积分 [奥特曼] 有信心比我更NB，超过我的成绩吗？",
            shoot_bad_text:"难过史了!!",
            shoot_good_text:"好NB呀!!",
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
                            "isDribbleGame": true,
                            "shareDefaultText": GameConfig.dribble_share_default_text,
                            "shareResultBegin": GameConfig.dribble_share_result_text_begin,
                            "shareResultEnd": GameConfig.dribble_share_result_text_end,
                            "badText":GameConfig.dribble_bad_text,
                            "goodText":GameConfig.dribble_good_text
                            });
                        break;

                    case 2:
                        this.set({
                            "highestScore": options.user.get("passGameScore"),
                            "originGameRanking": options.user.get("passGameRanking"),
                            "isPassGame": true,
                            "shareDefaultText": GameConfig.pass_share_default_text,
                            "shareResultBegin": GameConfig.pass_share_result_text_begin,
                            "shareResultEnd": GameConfig.pass_share_result_text_end,
                            "badText":GameConfig.pass_bad_text,
                            "goodText":GameConfig.pass_good_text

                        });
                        break;

                    default:
                        this.set({
                            "highestScore": options.user.get("shootGameScore"),
                            "originGameRanking": options.user.get("shootGameRanking"),
                            "isShootGame": true,
                            "shareDefaultText": GameConfig.shoot_share_default_text,
                            "shareResultBegin": GameConfig.shoot_share_result_text_begin,
                            "shareResultEnd": GameConfig.shoot_share_result_text_end,
                            "badText":GameConfig.shoot_bad_text,
                            "goodText":GameConfig.shoot_good_text
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
                this.set({
                "score":0,
                "coupon":this.get("originCoupon"),
                "isBad": false
                });

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
                } else {
                    this.set("isBad", false);
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