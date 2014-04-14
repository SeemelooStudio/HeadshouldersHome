// User.js
define(["jquery", "backbone", "models/Card", "Utils"],

    function ($, Backbone, Card, Utils) {

        var User = Backbone.Model.extend({
            defaults: {
              "isLogin":false,
              "hasCoupon":false,
              "hasData":false,
              "cardPrice":10
            },
        
            initialize: function() {
                var cookieId = $.cookie("userId");
                if ( cookieId ) {
                    this.setUserId(cookieId);
                }
            },
            syncData: function() {
                if ( this.checkLogin() ) {
                    this.fetchDataByUserId();
                } else {
                    this.login();
                }
            },
            login: function() {
                var cookieId = $.cookie("userId");
                if ( cookieId ) {
                    this.fetchDataByUserId({
                       userId: cookieId
                    });
                }
                if ( Utils.isWechat() ) {
                    this.wechatLogin();
                } else {
                    this.weiboLogin();
                }
            },
            checkLogin: function(){
                return this.has("userId");
            },
            checkCoupon: function(){
                if ( this.has("numOfCoupons") && this.get("numOfCoupons") > this.get("cardPrice") ) {
                    return true;
                } else {
                    return false;
                }
            },
            weiboLogin: function(){
                //window.location.href= window.location.origin + window.location.pathname + "#login/3";
                window.location.href= "https://api.weibo.com/oauth2/authorize?client_id=2081808740&response_type=code&redirect_uri=http%3a%2f%2fhfsshili.app.social-touch.com%2ffootballgamewebservice%2ffootballgameservice%2fusers%2fweibo%2f";
            },
            wechatLogin: function() {

                window.location.href= window.location.origin + window.location.pathname + "#login/3";

                //window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx98d5949213c73fa2&redirect_uri=http%3a%2f%2fquiz.seemeloo.com%2ffootballgameservice%2ffootballgameservice%2fusers%2fwechat%2f&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
            },
            initLeaderSetting: function() {
                var leadershipRank = 6;
                if ( this.get("accumulatePointsRanking") < leadershipRank ) {
                    this.set("accumulateLeader",true);
                } else {
                    this.set("accumulateLeader",false);
                }
                
                if ( this.get("passGameRanking") < leadershipRank ) {
                    this.set("passGameLeader",true);
                } else {
                    this.set("passGameLeader",false);
                }
                
                if ( this.get("dribbleGameRanking") < leadershipRank ) {
                    this.set("dribbleGameLeader",true);
                } else {
                    this.set("dribbleGameLeader",false);
                }
                
                if ( this.get("shootGameRanking") < leadershipRank ) {
                    this.set("shootGameLeader",true);
                }else {
                    this.set("shootGameLeader",false);
                }
            },
            setUserId: function(userId) {
                this.set("userId", userId);
                $.cookie("userId", userId);
                this.set("isLogin", true);
            },
            fetchDataByUserId: function(options) {
                var self = this;
                if ( options && options.userId ) {
                    this.setUserId(options.userId);
                }
                $.ajax({
                  //url:"app/data/user.json",
                  url: "http://192.168.1.102:8008/footballgameService/users/"+this.get("userId"),
                  dataType : "json",
                  success: function(data, textStatus, jqXHR){
                    self.parseUserdata(data);
                    self.set("hasData", true);
                    if ( options && options.success ) {
                       options.success(); 
                    }
                  },
                  error: function(jqXHR, textStatus, errorThrown){
                    self.set("hasData", false);
                    if ( options && options.error ) {
                        options.error( textStatus + ": " + errorThrown);
                    } else {
                        console.log(errorThrown);
                    }
                      
                  }
                });                
            },
            parseUserdata: function(userdata) {
                this.set(userdata);
                this.set("hasCoupon", this.checkCoupon());
                this.initLeaderSetting();
                this.trigger("onFetchSuccess");
            },
            redeemACard: function(options){
                var self = this;
                var card = new Card();
                card.fetch({
                        data: JSON.stringify({ userId: self.get("userId") }),
                        contentType: "application/json; charset=utf-8",
                        type: 'POST',
                        dataType : "json",
                        success:function(){
                            options.success(card);
                            if ( self.get("numOfCoupons") < 1 ) {
                                self.set("numOfCoupons", 0 );
                            } else {
                                self.set("numOfCoupons", self.get("numOfCoupons") - 10);
                            }
                            self.set("hasCoupon", self.checkCoupon());
                        },
                        error: function(){
                            options.error("抽奖失败");
                        }
                });
            },
            share: function(options){
                var self = this;
                $.ajax({
                    url: "http://192.168.1.102:8008/footballgameService/coupons",
                    data: JSON.stringify({ userId: self.get("userId") }),
                    contentType: "application/json; charset=utf-8",
                    type: 'POST',
                    dataType : "json",
                    success: function(data, textStatus, jqXHR){
                        if ( data.numOfCoupons && data.numOfCoupons > 0) {
                            self.set("numOfCoupons", self.get("numOfCoupons") + data.numOfCoupons);
                        }
                        if ( options && options.success ) {
                           options.success(data.numOfCoupons); 
                        }
                     },
                    error: function(jqXHR, textStatus, errorThrown){
                        if ( options && options.error ) {
                            options.error( textStatus + ": " + errorThrown);
                        } else {
                            console.log(errorThrown);
                        }
                    }
                });                   
            }
        });

        return User;
    }

);