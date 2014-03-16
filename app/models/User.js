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
                } else if (  WB2.checkLogin() ) {
                    //get weibo info
                    this.weiboLogin();
                } else {
                    this.trigger("onFetchSuccess");
                }
            },
            weiboLogin: function(){
                var self = this;   
                WB2.login(function(){
                    WB2.anyWhere(function(W){
                        W.parseCMD("/account/get_uid.json", function(sResult, bStatus){
                                var uid = sResult.uid;
                                WB2.anyWhere(function(W){
                                    W.parseCMD("/users/show.json", function(sResult, bStatus){
                                        self.onLoginSuccess(uid, sResult.name, "weibo");
                                        
                                    },{uid:uid},{method:'GET'});
        
                                });
                            
                        },{},{method: 'GET'});
                    });
        
                    
                });
            },
            wechatLogin: function() {
                this.onLoginSuccess("0","本地测试用户名","test"); 
                return;
            },
            onLoginSuccess: function(uid, name, type) {
                var self = this;
                this.set({
                    "uid":uid,
                    "name":name,
                    "type":type,
                    "isLogin": true
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
            }
        });

        return User;
    }

);