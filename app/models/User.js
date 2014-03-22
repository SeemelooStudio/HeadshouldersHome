// User.js

define(["jquery", "backbone", "models/Card", "Utils"],

    function ($, Backbone, Card, Utils) {

        var User = Backbone.Model.extend({
            default: {
              "isLogin":false,
              "hasCoupon":false
            },
        
            initialize: function() {
                this.login();
            },
            login: function() {
                if ( Utils.isWechat() ) {
                    var data = Utils.getParameterByName("userdata",window.location.href);
                    if ( data ) {
                        this.parseUserdata(data);
                    } else {
                        this.wechatLogin();
                    }
                } else {
                    //get weibo info
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
                /*
                var self = this;   
                WB2.login(function(){
                    WB2.anyWhere(function(W){
                        W.parseCMD("/account/get_uid.json", function(sResult, bStatus){
                                var uid = sResult.uid;
                                WB2.anyWhere(function(W){
                                    W.parseCMD("/users/show.json", function(sResult, bStatus){
                                        self.onLoginSuccess(uid, sResult.name, "weibo", sResult.profile_image_url);
                                        
                                    },{uid:uid},{method:'GET'});
        
                                });
                            
                        },{},{method: 'GET'});
                    });
        
                    
                });*/
                var self = this;
                setTimeout(function(){
                    self.wechatLogin();
                }, 2000);
                
            },
            wechatLogin: function() {
                this.onLoginSuccess("0","本地测试用户名","test", "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/64"); 
                return;
                /* 
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx98d5949213c73fa2&redirect_uri=http%3a%2f%2fquiz.seemeloo.com%2ffootballgameservice%2ffootballgameservice%2fusers%2fwechat%2f&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";*/
                
            },
            onLoginSuccess: function(uid, name, type, avatar) {
                var self = this;
                this.set({
                    "userName":name,
                    "headImageUrl":avatar
                });
                this.url = "app/data/user.json";
                this.fetch({
                    success: function(){
                        self.initLeaderSetting();
                        self.set("isLogin", true);
                        self.set("hasCoupon", self.checkCoupon());
                        self.trigger("onFetchSuccess");
                        
                    }
                });                
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
            parseUserdata: function(userdata) {
                $("#main").html(userdata);
                this.set($.parseJSON(userdata));
                
                this.set("isLogin", true);
                this.set("hasCoupon", this.checkCoupon());
                              
                this.initLeaderSetting();
                this.trigger("onFetchSuccess");
            },
            redeemACard: function(options){
                var self = this;
                setTimeout(function(){

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
                }, 1000);
                
            }
        });

        return User;
    }

);