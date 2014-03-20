define(["jquery", "backbone","mustache", "text!templates/Lotto.html", "animationscheduler", "views/CardView", "models/Card"],
    function ($, Backbone, Mustache, template, AnimationScheduler, CardView, Card) {
        var LottoView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#main",
            // View constructor
            initialize: function (options) {
                this.listenTo(this, "render", this.postRender);
                this.ready = false;
                if ( this.model.checkLogin() ) {
                    this.render();
                } else {
                    this.listenToOnce(this.model,"onFetchSuccess", this.render);
                }
                
                
            },
            // View Event Handlers
            events: {
                "touch #lottoBackHome":"onClickBack",
                "touch #envelope-sealing" :"onClickCard",
                "touch #btnAwardOK,#btnAwardShare":"onClickAwardOk",
                "touch #btnLottoHistory" : "onClickLottoHistory"
            },
            render: function(){
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));
                this.ready = true;
                this.trigger("render");
                return this;                
            },
            postRender: function() {                
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
                
                this.$el.find("#envelope-sealing").addClass("hinge animated");
                this.$el.find("#card").addClass("opencard");
                var self =this;
                $('#envelope-sealing').one('webkitAnimationEnd mozAnimationEnd oAnimationEnd msAnimationEnd animationEnd animationend', function(e){
                    $(e.currentTarget).remove();
                });
                $('#envelope-cover,#envelope-back,#envelope-front').one('webkitAnimationEnd mozAnimationEnd oAnimationEnd msAnimationEnd animationEnd animationend', function(e){
                    $(e.currentTarget).remove();
                });
                $("#envelope-content").one('webkitAnimationEnd mozAnimationEnd oAnimationEnd msAnimationEnd animationEnd animationend', function(e) {
                    console.log('here');
                    $(this).find("#award-address,#award-action").fadeIn();
                });
            },
            onClickAwardOk: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                var self = this;
                
                this.mainAnimationScheduler.animateOut(function(){
                    $('body').scrollTop(0);
                    Backbone.history.navigate("winningRecords", { trigger: true, replace: true });
                });
            },
            onClickLottoHistory: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                $('body').scrollTop(0);
                this.$el.find("#lottoBackHome").fadeOut();
                this.mainAnimationScheduler.animateOut(function(){
                Backbone.history.navigate("winningRecords", { trigger: true, replace: true });
                });
            }
        });
        // Returns the View class
        return LottoView;
    }
);