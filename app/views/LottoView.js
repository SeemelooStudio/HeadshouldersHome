define(["jquery", "backbone","mustache", "text!templates/Lotto.html", "animationscheduler","hammerjs", "views/CardView", "models/Card"],
    function ($, Backbone, Mustache, template, AnimationScheduler,Hammer, CardView, Card) {
        var LottoView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#main",
            // View constructor
            initialize: function (options) {
                this.listenTo(this, "render", this.postRender);
                this.render();
                
                
            },
            // View Event Handlers
            events: {
                "touch #lottoBackHome":"onClickBack",
                "touch #envelope-sealing" :"onClickCard",
                "touch #btnAwardOK,#btnAwardShare":"onClickAwardOk"
            },
            render: function(){
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));
                this.trigger("render");
                return this;                
            },
            postRender: function() {
                this.$el.hammer();
                Hammer.plugins.fakeMultitouch();
                
                this.mainAnimationScheduler = new AnimationScheduler(this.$el.find("#lotto"));
                this.mainAnimationScheduler.animateIn();
                
                this.miceAnimationScheduler = new AnimationScheduler(this.$el.find("#lottoLogo,#lotto-info,#lottoActions,#lottoAward"), {
                    "hideAtFirst":false
                });

                this.card = new Card();
                this.cardView = new CardView({ model: this.card });
            },
            onClickCard: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                this.miceAnimationScheduler.animateOut();
                this.$el.find("#envelope-arrow,#lottoBackHome").hide();
                $("#share").hide();
                var self = this;
                //todo: get result from server
                this.card.fetch({
                    success: function(model, response, options) {
                        self.openCard();
                    },
                    error: function(model, response, options) {
                    
                    }
                });
            },
            onClickBack: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                $('body').scrollTop(0);
                this.$el.find("#lottoBackHome").fadeOut();
                this.mainAnimationScheduler.animateOut(function(){
                    Backbone.history.navigate("", { trigger: true, replace: true });
                });
                
            },
            openCard: function(e) {
                this.$el.find("#envelope-sealing").addClass("rollOut animated");
                this.$el.find("#card").addClass("opencard");
                var self =this;
                $('#envelope-sealing,#envelope-cover,#envelope-back,#envelope-front').one('webkitAnimationEnd mozAnimationEnd oAnimationEnd msAnimationEnd animationEnd animationend', function(e){
                    self.$el.find("#envelope-content").css({
                       "overflow": "visible"
                    });
                    $(e.currentTarget).remove();
                });
            },
            onClickAwardOk: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                var self = this;
                this.mainAnimationScheduler.animateOut(function(){
                    $("#share").show();
                    self.initialize();
                });
            }
        });
        // Returns the View class
        return LottoView;
    }
);