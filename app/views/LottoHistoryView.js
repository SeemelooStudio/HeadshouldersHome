define(["jquery", "backbone","mustache", "text!templates/LottoHistory.html", "animationscheduler"],
    function ($, Backbone, Mustache, template, AnimationScheduler) {
        var LottoHistoryView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#main",
            // View constructor
            initialize: function (options) {
                this.listenTo(this, "render", this.postRender);
                this.user = options.user;
                var self = this;
                if ( this.user.checkLogin() ) {
                    
                    this.collection.fetch({
                        success: function(){
                            self.render();
                        }
                    });
                } else {
                    this.listenToOnce(this.user,"onFetchSuccess", function(){
                        self.collection.fetch({
                        success: function(){
                            self.render();
                        }
                    });
                    });
                }                
                
            },
            // View Event Handlers
            events: {
                "touch #btnWinningBack":"onClickBackLotto",
                "touch #winningBackHome":"onClickBackHome"
            },
            render: function(){
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, { 
                "userName" : this.user.get("userName"),
                "headImageUrl": this.user.get("headImageUrl"),
                "numOfPrizes" : this.user.get("numOfPrizes"),
                "records" : this.collection.toJSON() 
                } ));
                this.trigger("render");
                return this;                
            },
            postRender: function() {
                this.$el.hammer();
                $("#share").hide();
                this.mainAnimationScheduler = new AnimationScheduler(this.$el.find("#lottoHistory"));
                this.mainAnimationScheduler.animateIn();

            },
            onClickBackHome: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                $('body').scrollTop(0);
                this.$el.find("#winningBackHome").fadeOut();
                this.mainAnimationScheduler.animateOut(function(){
                    Backbone.history.navigate("", { trigger: true, replace: true });
                });
                
            },
            onClickBackLotto : function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                $('body').scrollTop(0);
                this.$el.find("#winningBackHome").fadeOut();
                this.mainAnimationScheduler.animateOut(function(){
                    Backbone.history.navigate("lottery", { trigger: true, replace: true });
                });
                
            },
        });
        // Returns the View class
        return LottoHistoryView;
    }
);