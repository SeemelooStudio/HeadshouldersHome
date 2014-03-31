// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Start.html", "animationscheduler", "views/RankView", "models/RankList"],
    function ($, Backbone, Mustache, template, AnimationScheduler, RankView, RankList) {
        var gameConfig = new Backbone.Model();
        gameConfig.set({
                "dribbleGame": {
                    "id" : 1,
                    "name": "dribble",
                    "enabled": true
                },
                "passGame": {
                    "id" : 2,
                    "name": "pass",
                    "enabled": false        
                },
                "shootGame": {
                    "id" : 3,
                    "name": "shoot",
                    "enabled": false            
                }
        });
        var StartView = Backbone.View.extend({

            el: "#main",
            
            initialize: function (options) {
                this.user = options.user;
                this.model = gameConfig;
                this.listenTo(this, "render", this.postRender);
                this.isReady = false;
                if ( this.user.get("hasData") ) {
                    this.ready();
                } else {
                    this.listenToOnce(this.user,"onFetchSuccess", this.ready);
                }
            },

            events: {

                "tap #showTops,#rule":"onClickLeaderboard",
                "tap #backHome":"onClickBackHome",
                "tap .leaderboard-button":"onClickLeaderboardTab",
                "tap #ruleRight":"onClickLotto",
                "tap #ruleLeft":"onClickLeaderboard"
            },
            render: function () {
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));
                
                this.trigger("render");
                return this;
            },
            postRender: function() {
                var self = this;                
                this.lottoAnimationScheduler = new AnimationScheduler(this.$el.find("#user,#rule,#plane"));
                this.btnAnimationScheduler = new AnimationScheduler(this.$el.find(".gameButton"), {"isSequential":true,"sequentialDelay":350});
                $("#share").show();
                this.lottoAnimationScheduler.animateIn(function(){
                    
                });
                this.btnAnimationScheduler.animateIn();
            },
            ready: function(){
                this.model.set(this.user.toJSON());
                this.render();
                this.isReady = true;
            },
            onClickLeaderboard: function(e){
                e.preventDefault();
                e.stopPropagation();
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();

                this.showLeaderboard();
                return false;
                
            },
            showLeaderboard: function( leaderboardName ){
                $("#loading").show();
                var tabId = "#leaderboard-buttonScore";
                if ( leaderboardName ) {
    
                    if ( leaderboardName == "dribble" ) {
                        tabId = "#leaderboard-buttonDribble";
                    } else if ( leaderboardName == "pass" ) {
                        tabId = "#leaderboard-buttonPass";
                    } else if ( leaderboardName == "shoot" ) {
                        tabId = "#leaderboard-buttonShoot";
                    }
                    
                }
                var self = this;
                this.ranklist = new RankList();
                this.ranklist.fetch({
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(){
                        self.$el.find("#leaderboard").addClass("expand");
                        self.rankView = new RankView({model:self.ranklist, user: self.user});
                        $("#loading").hide();
                          
                        if ( tabId ) {
                            var e = {};
                            e.target = tabId;
                            self.onClickLeaderboardTab(e);
                        }
                    }
                });                
            },
            onClickBackHome: function(e){
                e.preventDefault();
                e.stopPropagation();
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                var self = this;
                $('body').animate({
                    scrollTop:0
                },500,
                function(){
                    self.$el.find("#leaderboard").removeClass("expand");
                    Backbone.history.navigate("", { trigger: false, replace: true });
                }
                );
                
                return false;
            },
            onClickLeaderboardTab: function(e) {
                if ( e.gesture ) {
                   e.gesture.preventDefault();
                   e.gesture.stopPropagation(); 
                   e.gesture.stopDetect(); 
                }
                
                var self = this;
                var tab = $(e.target);
                var type =tab.attr("data-type");
                var id = "#leaderboard-" + type;
                
                tab.siblings(".current").removeClass("current");
                tab.addClass("current");
                
                $(".leaderboard-content.current").removeClass("current");
                $(id).addClass("current animated fadeIn");
                
                Backbone.history.navigate("leaderboard/" + type, { trigger: false, replace: true });
            },
            onSwipeLeaderboard: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation();
            },
            onClickLotto: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                this.onExit();
                Backbone.history.navigate("lottery", { trigger: true, replace: true });

            },
            onClickGameButton: function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                this.onExit();
                var target = $(e.currentTarget).attr("data-target");
                Backbone.history.navigate(target, { trigger: true, replace: true });
            },
            onExit: function(e) {
                this.isReady = false;
            }
        });
        return StartView;
    }

);