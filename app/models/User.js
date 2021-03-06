// User.js
define(["jquery", "backbone", "models/Card", "Utils"],

    function ($, Backbone, Card, Utils) {

        var User = Backbone.Model.extend({
            defaults: {
                "isLogin": false,
                "hasCoupon": false,
                "hasData": false,
                "cardPrice": 10
            },

            initialize: function () {
                var cookieId = $.cookie("userId");
                if (cookieId) {
                    this.setUserId(cookieId);
                }
                this.weboLoginUrl = "https://api.weibo.com/oauth2/authorize?client_id=2081808740&response_type=code&redirect_uri=http%3a%2f%2fhfsshili.app.social-touch.com%2ffootballgamewebservice%2ffootballgameservice%2fusers%2fweibo%2f";
                this.wechatLoginUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaca4b565bbea999a&redirect_uri=http%3a%2f%2fhfsshili.app.social-touch.com%2ffootballgamewebservice%2ffootballgameservice%2fusers%2fwechat2%2f&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
                this.qzoneLoginUrl = "http://hfsshili.app.social-touch.com/footballgamewebService/footballgameService/users/QQ/";

            },
            syncData: function () {
                _hmt.push(['_trackPageview', '/SyncData']);
                if (this.checkLogin()) {
                    this.fetchDataByUserId();
                } else {
                    this.login();
                }
            },
            login: function () {
                _hmt.push(['_trackPageview', '/Login']);
                if (Utils.isWechat()) {
                    this.wechatLogin();
                } else if (Utils.isQzone()){
                    this.qzoneLogin();
                } else {
                    this.weiboLogin();
                }
            },
            logout: function(){
                $.removeCookie("userId");
                $.removeCookie("userId",{path:"/"});
                $.removeCookie("userId",{path:"/aa"});
                $.removeCookie("userId",{path:"http://hfsshili.app.social-touch.com/"});
                $.removeCookie("userId",{path:"http://quiz.seemeloo.com/aa/"});
                _hmt.push(['_trackPageview', '/Logout']); 
                
                
                Backbone.history.navigate("", { trigger: false, replace: false });
                window.location.reload();
            },
            checkLogin: function () {
                return this.has("userId");
            },
            checkCoupon: function () {
                if (this.has("numOfCoupons") && this.get("numOfCoupons") > (this.get("cardPrice") - 1)) {
                    return true;
                } else {
                    return false;
                }
            },
            weiboLogin: function () {

                _hmt.push(['_trackPageview', '/Login/Weibo']); 
                if ( (navigator.userAgent.indexOf('Android') != -1) ) {
                    document.location.href = this.weboLoginUrl ;
                } else {
                    window.location.href = this.weboLoginUrl;
                }
                
            },
            wechatLogin: function () {

                _hmt.push(['_trackPageview', '/Login/Wechat']); 
                if ( (navigator.userAgent.indexOf('Android') != -1) ) {
                    document.location.href = this.wechatLoginUrl ;
                } else {
                    window.location.href = this.wechatLoginUrl ;
                }
                
            },
            qzoneLogin: function() {
                _hmt.push(['_trackPageview', '/Login/QZone']); 
                fusion2.dialog.relogin();
                /*
                if ( (navigator.userAgent.indexOf('Android') != -1) ) {
                    document.location.href = this.qzoneLoginUrl ;
                } else {
                    document.location.href = this.qzoneLoginUrl ;
                }
                */

            },
            initLeaderSetting: function () {
                var leadershipRank = 6;
                if (this.get("accumulatePointsRanking") < leadershipRank) {
                    this.set("accumulateLeader", true);
                } else {
                    this.set("accumulateLeader", false);
                }

                if (this.get("passGameRanking") < leadershipRank) {
                    this.set("passGameLeader", true);
                } else {
                    this.set("passGameLeader", false);
                }

                if (this.get("dribbleGameRanking") < leadershipRank) {
                    this.set("dribbleGameLeader", true);
                } else {
                    this.set("dribbleGameLeader", false);
                }

                if (this.get("shootGameRanking") < leadershipRank) {
                    this.set("shootGameLeader", true);
                } else {
                    this.set("shootGameLeader", false);
                }
            },
            setUserId: function (userId) {
                this.set("userId", userId);
                $.cookie("userId", userId);
                this.set("isLogin", true);
            },
            fetchDataByUserId: function (options) {
                var self = this;
                _hmt.push(['_trackPageview', '/SyncData/Fetch']);
                if (options && options.userId) {
                    this.setUserId(options.userId);
                }
                
                $.ajax({

                    //url:"app/data/user.json",
                    url: "http://192.168.1.101:8008/footballgameService/users/" + this.get("userId") + "?ts=" + (new Date()).getTime(),

                    dataType: "json",
                    success: function (data, textStatus, jqXHR) {

                        if( !data.userId || data.userId < 0 ) {
                            Backbone.history.navigate("logout", { trigger: true, replace: false });
                        } else {
                            self.parseUserdata(data);
                            self.set("hasData", true);
                            if (options && options.success) {
                                options.success();
                            }
                            _hmt.push(['_trackPageview', '/SyncData/Success']);
                        }
                        
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        self.set("hasData", false);
                        if (options && options.error) {
                            options.error(textStatus + ": " + errorThrown);
                        } else {
                            alert.log(errorThrown);
                        }
                        _hmt.push(['_trackPageview', '/Login/Error']);
                    }
                });
            },
            parseUserdata: function (userdata) {
                this.set(userdata);
                this.set("hasCoupon", this.checkCoupon());
                this.initLeaderSetting();
                this.trigger("onFetchSuccess");
            },
            redeemACard: function (options) {
                var self = this;
                var card = new Card();
                card.fetch({
                    data: JSON.stringify({ userId: self.get("userId") }),
                    contentType: "application/json; charset=utf-8",
                    type: 'POST',
                    dataType: "json",
                    success: function () {
                        if (card.has("points")) {
                            self.set("accumulatePoints", self.get("accumulatePoints") + card.get("points"));
                        }
                        card.set("accumulatePoints", self.get("accumulatePoints"));
                        options.success(card);

                        self.set("numOfCoupons", self.get("numOfCoupons") - 10);
                        self.set("hasCoupon", self.checkCoupon());
                    },
                    error: function () {
                        options.error("抽奖失败");
                    }
                });
            },
            share: function (options) {
                var self = this;
                $.ajax({
                    url: "http://192.168.1.101:8008/footballgameService/coupons",
                    data: JSON.stringify({ userId: self.get("userId") }),
                    contentType: "application/json; charset=utf-8",
                    type: 'POST',
                    dataType: "json",
                    success: function (data, textStatus, jqXHR) {
                        if (data.numOfCoupons && data.numOfCoupons > 0) {
                            self.set("numOfCoupons", self.get("numOfCoupons") + data.numOfCoupons);
                        }
                        if (options && options.success) {
                            options.success(data.numOfCoupons);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (options && options.error) {
                            options.error(textStatus + ": " + errorThrown);
                        } else {
                            alert.log(errorThrown);
                        }
                    }
                });
            }
        });

        return User;
    }

);