// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Start.html", "animationscheduler", "views/RankView", "models/RankList", "game-config"],
    function ($, Backbone, Mustache, template, AnimationScheduler, RankView, RankList, GameConfig) {
        var StartView = Backbone.View.extend({

            el: "#main",
            
            initialize: function () {
                this.listenTo(this, "render", this.postRender);
                this.isReady = false;
                if ( this.model.checkLogin() ) {
                    this.ready();
                } else {
                    this.listenToOnce(this.model,"onFetchSuccess", this.ready);
                }
            },
            
            events: {
                "tap #showTops,#rule":"onClickLeaderboard",
                "tap #backHome":"onClickBackHome",
                "tap .leaderboard-button":"onClickLeaderboardTab",
                "tap #plane":"onClickLotto",
                "tap .gameButton": "onClickGameButton"
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
                
                this.lottoAnimationScheduler.animateIn(function(){
                    self.btnAnimationScheduler.animateIn();
                });
            },
            ready: function(){
                this.model.set(GameConfig);
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
                    success: function(){
                        self.$el.find("#leaderboard").addClass("expand");
                        self.rankView = new RankView({model:self.ranklist, user: self.model});
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
                    Backbone.history.navigate("", { trigger: false, replace: false });
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
                
                Backbone.history.navigate("leaderboard/" + type, { trigger: false, replace: false });
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
                Backbone.history.navigate("lottery", { trigger: true, replace: false });

            },
            onClickGameButton: function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                this.onExit();
                var target = $(e.currentTarget).attr("data-target");
                Backbone.history.navigate(target, { trigger: true, replace: false });
            },
            onExit: function(e) {
                this.isReady = false;
            }
        });
        return StartView;
    }

);