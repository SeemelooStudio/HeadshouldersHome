// Rank.js

define(["jquery", "backbone","cypher"],

    function ($, Backbone) {
        var GameConfig = {
            badScoreLine : 6,
            dribble_share_default_text: "正在对战球场巨星，过得去算你NB，最NB的免费游巴西！",
            dribble_share_good_text_begin:"晃过了",
            dribble_share_good_text_end:"个足坛巨星！NB不？求挑战！球星都得跪！",
            dribble_share_bad_text_begin:"只晃过了",
            dribble_share_bad_text_end:"个人，玩游戏中大奖的机会留给你们了！",
            dribble_bad_text:"难过shi了！！",
            dribble_good_text:"NB不是一两天！",
            pass_share_default_text: "为了赢巴西游，一直在玩传球游戏，传得根本停不下来！",
            pass_share_good_text_begin:"传出",
            pass_share_good_text_end:"脚绝妙传球！预感要被巴萨签约了！",
            pass_share_bad_text_begin:"传了",
            pass_share_bad_text_end:"脚就丢了。如何拿高分？在线等，挺急的！",
            pass_bad_text:"传你妹阿!!",
            pass_good_text:"NB不是一两天!",
            shoot_share_default_text: "：别忍着，尽情射！足球射门游戏，射中最多就赢免费巴西游！",
            shoot_share_good_text_begin:"射中了",
            shoot_share_good_text_end:"次球门！把球网都射疼了，你行么？",
            shoot_share_bad_text_begin:"：不科学，只射中了",
            shoot_share_bad_text_end:"次球门！被国足附体了吗？",
            shoot_bad_text:"往哪儿射呢？！",
            shoot_good_text:"NB不是一两天！"
        };
        var Game = Backbone.Model.extend({
            defaults: {
                "score": 0,
                "coupon": 0,
                "isBreakRecord": false,
                "isBad": false,
                "sceneName":"DribbleGame"
            },
            initialize: function (options) {
                this.userName = options.user.get("userName");
                switch (options.gameTypeId) {
                    case 1:
                        this.set({
                            "highestScore": options.user.get("dribbleGameScore"),
                            "originGameRanking": options.user.get("dribbleGameRanking"),
                            "isDribbleGame": true,
                            "shareDefaultText": this.userName + GameConfig.dribble_share_default_text,
                            "shareGoodBegin": this.userName + GameConfig.dribble_share_good_text_begin,
                            "shareGoodEnd": GameConfig.dribble_share_good_text_end,
                            "shareBadBegin": this.userName + GameConfig.dribble_share_bad_text_begin,
                            "shareBadEnd": GameConfig.dribble_share_bad_text_end,
                            "badText":GameConfig.dribble_bad_text,
                            "goodText":GameConfig.dribble_good_text,
                            "sceneName":"DribbleGame"
                            });
                        break;

                    case 2:
                        this.set({
                            "highestScore": options.user.get("passGameScore"),
                            "originGameRanking": options.user.get("passGameRanking"),
                            "isPassGame": true,
                            "shareDefaultText": this.userName + GameConfig.pass_share_default_text,
                            "shareGoodBegin": this.userName + GameConfig.pass_share_good_text_begin,
                            "shareGoodEnd": GameConfig.pass_share_good_text_end,
                            "shareBadBegin": this.userName + GameConfig.pass_share_bad_text_begin,
                            "shareBadEnd": GameConfig.pass_share_bad_text_end,
                            "badText":GameConfig.pass_bad_text,
                            "goodText":GameConfig.pass_good_text,
                            "sceneName":"PassGame"

                        });
                        break;

                    default:
                        this.set({
                            "highestScore": options.user.get("shootGameScore"),
                            "originGameRanking": options.user.get("shootGameRanking"),
                            "isShootGame": true,
                            "shareDefaultText": this.userName + GameConfig.shoot_share_default_text,
                            "shareGoodBegin": this.userName + GameConfig.shoot_share_good_text_begin,
                            "shareGoodEnd": GameConfig.shoot_share_good_text_end,
                            "shareBadBegin": this.userName + GameConfig.shoot_share_bad_text_begin,
                            "shareBadEnd": GameConfig.shoot_share_bad_text_end,
                            "badText":GameConfig.shoot_bad_text,
                            "goodText":GameConfig.shoot_good_text,
                            "sceneName":"ShootGame"
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
            addCoupon: function ( couponCount ) {
                this.set("coupon", this.get("coupon") + couponCount );
            },
            startGame: function (options) {
                var self = this;
                this.set({
                "score":0,
                "coupon":this.get("originCoupon"),
                "isBad": false,
                "isBreakRecord": false
                });

                $.ajax({
                    url: "http://192.168.1.101:8008/footballgameservice/Games",
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
                var resultString;
                if ( this.originGameId == this.get("gameId") ) {
                    //is Submitted
                    $("#loading").hide();
                    return;
                } else {
                    self.originGameId = self.get("gameId");                    
                    resultString = self.get("score") + "";
                    couponString = (self.get("coupon") - self.get("originCoupon")) + "";
                    
                    var cipheredScore = { stream: { value: resultString }, key: { value: this.originGameId + "" } };
                    encipher(cipheredScore);
                    
                    var cipheredCoupon = { stream: { value: couponString }, key: { value: this.originGameId + "" } };
                    encipher(cipheredCoupon);

                    $.ajax({
                        url: "http://192.168.1.101:8008/footballgameservice/Games",
                        //url: "app/data/gameresult.json",
                        dataType: "json",
                        data: JSON.stringify({
                            gameId: self.get("gameId"),
                            gameTypeId: self.get("gameTypeId"),
                            userId: self.get("userId"),
                            score: cipheredScore.stream.value,
                            numOfCoupons: cipheredCoupon.stream.value
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