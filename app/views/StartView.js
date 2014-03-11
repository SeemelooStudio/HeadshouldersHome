// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Start.html", "animationscheduler", "views/RankView", "models/RankList"],
    function ($, Backbone, Mustache, template, AnimationScheduler, RankView, RankList) {
        var StartView = Backbone.View.extend({

            el: "#main",
            
            initialize: function () {
                this.listenTo(this, "render", this.postRender);
                this.listenTo(this.model,"onFetchSuccess", this.render);
            },
            
            events: {
                "click #showTops":"onClickLeaderboard",
                "click #backHome":"onClickBackHome",
                "click .leaderboard-button":"onClickLeaderboardTab"
            },
            render: function () {
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));
                this.trigger("render");
                return this;
            },
            postRender: function() {
                var self = this;
                this.lottoAnimationScheduler = new AnimationScheduler(this.$el.find("#belt,#plane"));
                this.btnAnimationScheduler = new AnimationScheduler(this.$el.find(".gameButton"), {"isSequential":true});
                
                this.lottoAnimationScheduler.animateIn(function(){
                    self.btnAnimationScheduler.animateIn();
                });
            },
            ready: function(){
                this.render();
            },
            onClickLeaderboard: function(e){
                e.preventDefault();
                e.stopPropagation();
                var self = this;
                
                this.$el.find("#leaderboard").addClass("expand");                
                this.ranklist = new RankList();
                this.ranklist.fetch({
                    success: function(){
                        self.rankView = new RankView({model:self.ranklist, user: self.model});
                    }
                });
                return false;
                
            },
            onClickBackHome: function(e){
                e.preventDefault();
                e.stopPropagation();
                var self = this;
                $('body').animate({
                    scrollTop:0
                },500,
                function(){
                    self.$el.find("#leaderboard").removeClass("expand");
                }
                );
                return false;
            },
            onClickLeaderboardTab: function(e) {
                e.preventDefault();
                e.stopPropagation();
                var self = this;
                var tab = $(e.target);
                var id =tab.attr("data-target");
                tab.siblings(".current").removeClass("current");
                tab.addClass("current");
                
                $(".leaderboard-content.current").removeClass("current");
                $(id).addClass("current animated fadeIn");
            }
        });
        return StartView;
    }

);