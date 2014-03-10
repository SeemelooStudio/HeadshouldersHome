// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Start.html", "animationscheduler", "views/RankView", "collections/Ranks", "scrollto"],
    function ($, Backbone, Mustache, template, AnimationScheduler, RankView, Ranks) {
        var StartView = Backbone.View.extend({

            el: "#main",
            
            initialize: function () {
                this.listenTo(this, "render", this.postRender);
                this.listenTo(this.model,"onFetchSuccess", this.render);
            },
            
            events: {
                "click #showTops":"onClickLeaderboard",
                "click #backHome":"onClickBackHome"
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
                console.log(e);
                e.preventDefault();
                e.stopPropagation();
                var self = this;
                
                this.$el.find("#leaderboard").addClass("expand");                
                this.ranks = new Ranks();
                this.ranks.fetch({
                    success: function(){
                        self.rankView = new RankView({collection:self.ranks});
                    }
                });
                return false;
                
            },
            onClickBackHome: function(e){
                e.preventDefault();
                e.stopPropagation();
                this.$el.find("#leaderboard").removeClass("expand");
                $.scrollTo("#header", 500);
                return false;
            }
        });
        return StartView;
    }

);