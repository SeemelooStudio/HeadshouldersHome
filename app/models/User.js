// User.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var User = Backbone.Model.extend({
            default: {
              "isLogin":false  
            },
        
            initialize: function() {

            },
            checkLogin: function(){
                if ( this.get("isLogin") ) {
                    this.trigger("onFetchSuccess");
                } else if ( this.isWechat() ) {
                    var data = this.getParameterByName("userdata",window.location.href);
                    if ( data ) {
                        user.parseUserdata(data);
                    } else {
                        this.wechatLogin();
                    }
                } else {
                    //get weibo info
                    this.weiboLogin();
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
                this.wechatLogin();
            },
            wechatLogin: function() {
                this.onLoginSuccess("0","本地测试用户名","test", "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/64"); 
                return;
                /* 
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx98d5949213c73fa2&redirect_uri=http%3a%2f%2fquiz.seemeloo.com%2ffootballgameservice%2ffootballgameservice%2fusers%2fwechat%2f&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                */
            },
            onLoginSuccess: function(uid, name, type, avatar) {
                var self = this;
                this.set({
                    "uid":uid,
                    "name":name,
                    "type":type,
                    "isLogin": true,
                    "headimgurl":avatar
                });
                this.url = "app/data/user.json" + "?uid=" + uid + "&type=" + type;
                this.fetch({
                    success: function(){
                        self.initLeaderSetting();
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
            getParameterByName: function( name,href )
            {
              name = name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
              var regexS = "[\\?&]"+name+"=([^&#]*)";
              var regex = new RegExp( regexS );
              var results = regex.exec( href );
              if( results === null )
                return "";
              else
                return decodeURIComponent(results[1].replace(/\+/g, " "));
            },
            isWechat: function() {
                var ua = navigator.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i)=="micromessenger") {
                    return true;
                } else {
                    return false;
                }
            },
            parseUserdata: function(userdata) {
                $("#main").html(userdata);
                alert(userdata);
                this.set($.parseJSON(userdata));
                
                this.initLeaderSetting();
                this.trigger("onFetchSuccess");
            }
        });

        return User;
    }

);