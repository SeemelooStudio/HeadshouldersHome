define(["jquery", "backbone","mustache", "text!templates/Lotto.html", "animationscheduler", "views/CardView", "Utils"],
    function ($, Backbone, Mustache, template, AnimationScheduler, CardView, Utils) {
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
                this.isEnvelopeSealed = true;            
                this.mainAnimationScheduler = new AnimationScheduler(this.$el.find("#lotto"));
                this.mainAnimationScheduler.animateIn();
                
                this.miceAnimationScheduler = new AnimationScheduler(this.$el.find("#lottoLogo,#lotto-info,#lottoActions,#lottoAward,#lottoBackHome"), {
                    "hideAtFirst":false
                });

            },
            onClickCard: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                var self = this;
                
                if ( this.isEnvelopeSealed && this.model.checkCoupon() ) {
                    this.isEnvelopeSealed = false;
                    this.miceAnimationScheduler.animateOut();
                    
                    this.$el.find("#envelope-arrow").remove();
                    this.$el.find("#envelope-sealing").addClass("hinge animated");
                    $('#envelope-sealing').one( Utils.animationEndTrigger , function(e){
                        $(e.currentTarget).remove();
                    });
                
                    $("#share").hide();
                    $("#loading").show();           
                
                    this.model.redeemACard({
                        success: function(card){
                            $("#loading").hide();
                            self.card = card;
                            self.cardView = new CardView({ model: card });
                            self.openCard();                    
                        },
                        error: function(erroMessage) {
                            Utils.showError(erroMessage);
                        }
                    });  
                }
                
                
                
                
            },
            onClickBack: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                $('body').scrollTop(0);
                this.$el.find("#lottoBackHome").fadeOut();
                this.mainAnimationScheduler.animateOut(function(){
                    Backbone.history.navigate("", { trigger: true, replace: false });
                });
                
            },
            openCard: function(e) {
                var self =this;
                this.$el.find("#card").addClass("opencard");                
                $('#envelope-cover,#envelope-back,#envelope-front').one(Utils.animationEndTrigger, function(e){
                    $(e.currentTarget).remove();
                });
                $("#envelope-content").one(Utils.animationEndTrigger, function(e) {
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
                    if ( self.card.get("isWon") )  {
                        Backbone.history.navigate("winningRecords", { trigger: true, replace: false });
                    } else {
                        self.render();
                    }
                    
                });
            },
            onClickLottoHistory: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                $('body').scrollTop(0);
                this.$el.find("#lottoBackHome").fadeOut();
                this.mainAnimationScheduler.animateOut(function(){
                Backbone.history.navigate("winningRecords", { trigger: true, replace: false });
                });
            }
        });
        // Returns the View class
        return LottoView;
    }
);