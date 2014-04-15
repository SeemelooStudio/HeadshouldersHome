define(["jquery", "backbone","mustache", "text!templates/Lotto.html", "animationscheduler", "views/CardView", "Utils"],
    function ($, Backbone, Mustache, template, AnimationScheduler, CardView, Utils) {
        var LottoView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#main",
            // View constructor
            initialize: function (options) {
                this.listenTo(this, "render", this.postRender);
                this.ready = false;
                
                if ( this.model.get("hasData") ) {
                    this.render();
                } else {
                    this.listenToOnce(this.model,"onFetchSuccess", this.render);
                }
                _hmt.push(['_trackPageview', '/Lottery']);
            },
            // View Event Handlers
            events: {
                "touch #lottoBackHome":"onClickBack",
                "touch #envelope-sealing" :"onClickCard",
                "touch #btnAwardOK":"onClickAwardOK",
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
                Utils.setPageTitle("#海飞丝巴西实力挑战赛#好基友！好姐妹！看到这些请擦干口水！梅西签名球衣、海飞丝洗发水、神秘奖品，玩玩游戏动动手指就是你的，今天会中什么呢？来玩了就知道咯！");
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
                            console.log(self.card);
                            self.openCard();                    
                        },
                        error: function(erroMessage) {
                            Utils.showError(erroMessage);
                        }
                    });  
                }
                _hmt.push(['_trackPageview', '/Lottery/Draw']);
                
                
                
                
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
                var self =this;
                var isWon = this.card.get("isWon");
                  
                if ( isWon ) {
                    this.$el.find("#card").addClass("opencard"); 
                } else {
                    this.$el.find("#card").addClass("opencard notWon"); 
                }           
                $('#envelope-cover,#envelope-back,#envelope-front').one(Utils.animationEndTrigger, function(e){
                    $(e.currentTarget).remove();
                });
                $("#envelope-content").one(Utils.animationEndTrigger, function(e) {
                    $(this).find("#award-address,#award-action").fadeIn();
                });
                if ( isWon ) { 
                   Utils.setPageTitle("#海飞丝巴西实力挑战赛# 小手一抖，奖品拿走，我在海飞丝足球游戏中赢得了奖品"+ this.card.get("prizeName") +"。羡慕嫉妒恨？不如和我一起玩游戏赢奖品~");
                } else {
                   Utils.setPageTitle("#海飞丝巴西实力挑战赛# 苍天哪~大地哪~干爹赐我一点手气吧~");
                }
                
            },
            onClickAwardOK: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                var self = this;
                if ( this.card.get("isWon") && (!this.card.get("isVirtualPrize")) ) { 
                    if ( this.validateAddress() ) {
                        this.saveAddress();
                    }
                } else {
                    this.mainAnimationScheduler.animateOut(function(){
                           $('body').scrollTop(0);
                           self.render();
                    });
                }
                
            },
            saveAddress: function(){
                var self = this;
                this.card.saveAddress({
                    shipTo:this.shipTo,
                    phone: this.phone,
                    shippingAddress: this.shippingAddress,
                    success: function() {
                        self.mainAnimationScheduler.animateOut(function(){
                        $('body').scrollTop(0);
                        Backbone.history.navigate("winningRecords", { trigger: true, replace: true });
                        });
                    },
                    error: function(msg) {
                        Utils.showError(msg + "<br />服务器好像有些问题，请试试点击【确定】按钮");
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
                Backbone.history.navigate("winningRecords", { trigger: true, replace: true });
                });
            },
            validateAddress: function() {
                this.shipTo = this.$el.find("#shipTo").val();
                this.phone = this.$el.find("#phone").val();
                this.shippingAddress = this.$el.find("#shippingAddress").val();
                var self = this;
                if ( !Utils.validateName(this.shipTo) ) {
                    
                    Utils.showError("请填写正确的收件人姓名", null, function(){
                        self.$el.find("#shipTo").focus();
                    });
                    return false;
                }
                if ( !Utils.validatePhone(this.phone) ) {
                    Utils.showError("请填写正确的电话号码<br />例如：<br />手机号：13100000000<br />座机号：010-86000000<br />0591-2600000-3213等", null, function(){
                        self.$el.find("#phone").focus();
                    });
                    return false;
                } 
                if ( !Utils.validateAddress(this.shippingAddress) ) {
                    Utils.showError("请填写能收快件的详细地址，<br />具体到省、市、街道、门牌号等", null, function(){
                        self.$el.find("#phone").focus();
                    });
                    return false;
                }
                return true;
            }
        });
        // Returns the View class
        return LottoView;
    }
);