// User.js

define(["jquery", "backbone", "models/Card", "Utils"],

    function ($, Backbone, Card, Utils) {

        var User = Backbone.Model.extend({
            default: {
              "isLogin":false,
              "hasCoupon":false
            },
        
            initialize: function() {
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
                return this.get("isLogin");
            },
            checkCoupon: function(){
                if ( this.has("numOfCoupons") && this.get("numOfCoupons") > 0 ) {
                    return true;
                } else {
                    return false;
                }
            },
            weiboLogin: function(){
                this.wechatLogin();
                
            },
            wechatLogin: function() {
            /*
                window.location.href="http://quiz.seemeloo.com/hs/#login/123";
                */
            /*
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx98d5949213c73fa2&redirect_uri=http%3a%2f%2fquiz.seemeloo.com%2ffootballgameservice%2ffootballgameservice%2fusers%2fwechat%2f&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                */
                
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
            },
            fetchDataByUserId: function(options) {
                var self = this;
                if ( options && options.userId ) {
                    this.setUserId(options.userId);
                }
                $.ajax({
                  url: "app/data/user.json",
                  dataType:"json",
                  data: {
                      "userId":this.get("userId")
                  },
                  success: function(data, textStatus, jqXHR){
                    self.parseUserdata(data);
                    if ( options && options.success ) {
                       options.success(); 
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
            },
            parseUserdata: function(userdata) {
                this.set(userdata);
                
                this.set("isLogin", true);
                this.set("hasCoupon", this.checkCoupon());
                              
                this.initLeaderSetting();
                this.trigger("onFetchSuccess");
            },
            redeemACard: function(options){
                var self = this;

                var card = new Card();
                card.fetch({
                        success:function(){
                            options.success(card);
                            if ( self.get("numOfCoupons") < 1 ) {
                                self.set("numOfCoupons", 0 );
                            } else {
                                self.set("numOfCoupons", self.get("numOfCoupons") - 1);
                            }
                            self.set("hasCoupon", self.checkCoupon());
                        },
                        error: function(){
                            options.error("abcde");
                        }
                });
                
            }
        });

        return User;
    }

);