// User.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var User = Backbone.Model.extend({
        
            initialize: function() {
                //this.login();
                this.onLoginSuccess("0","本地测试用户名","test");
            },
            login: function(){
                var self = this;
                
                //get uid and username from sina weibo
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
            onLoginSuccess: function(uid, name, type) {
                var self = this;
                this.set({
                    "uid":uid,
                    "name":name,
                    "type":type
                });
                this.url = "app/data/user.json" + "?weiboUid=" + uid + "&type=" + type;
                this.fetch({
                    success: function(){
                        self.initLeaderSetting();
                        self.trigger("onFetchSuccess");
                    }
                });                
            },
            
            initLeaderSetting: function() {
                console.log(this);
                if ( this.get("accumulatePointsRanking") < 11 ) {
                    this.set("accumulateLeader",true);
                } else {
                    this.set("accumulateLeader",false);
                }
                
                if ( this.get("passGameRanking") < 11 ) {
                    this.set("passGameLeader",true);
                } else {
                    this.set("passGameLeader",false);
                }
                
                if ( this.get("dribbleGameRanking") < 11 ) {
                    this.set("dribbleGameLeader",true);
                } else {
                    this.set("dribbleGameLeader",false);
                }
                
                if ( this.get("shootGameRanking") < 11 ) {
                    this.set("shootGameLeader",true);
                }else {
                    this.set("shootGameLeader",false);
                }
            }
        });

        return User;
    }

);