define(["jquery", "backbone","animationscheduler", "Utils"],
    function ($, Backbone, AnimationScheduler, Utils) {
        var MainView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "body",
            // View constructor
            initialize: function (options) {
                this.headerAnimationScheduler = new AnimationScheduler(this.$el.find("#header"), {
                    hideAtFirst: false
                });
                this.$el.hammer();
                this.user = options.user;
                this.isSharing = false;
            },
            // View Event Handlers
            events: {
                "click #logo":"onClickLogo",
                "tap #shareOverlay,#shareCancel":"onClickShareOverlay",
                "tap #shareOk":"onClickShareOk",
                "tap .share":"onClickShare",
                "tap #exitLink":"onClickExit"
            },
            onClickLogo: function() {

            },
            hideHeader: function(callback) {
                if ($("#header").is(":hidden")) {
                    callback();
                } else {
                this.headerAnimationScheduler.animateOut(callback);
                }
            },
            showHeader: function(callback) {
                if ($("#header").is(":visible")) {
                    if ( callback) { callback();}
                } else {
                this.headerAnimationScheduler.animateIn(callback);
                }

            },
            onClickShareOverlay: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                $("#shareOverlay").hide();
                $("#shareOk").hide();
            },
            onClickShareOk: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                if ( Utils.isWechat() ) {
                    this.share();
                }
                $("#shareOverlay").hide();
                $("#shareOk").hide();
            },
            onClickShare: function(e) {
                var self = this;
                var timeout;
                if ( !Utils.isWechat() ) {
                    this.share();
                } else {
                    timeout = setTimeout( function(){
                        if ($("#shareOverlay").is(":visible") ) {
                            $("#shareOk").show();
                        }
                        clearTimeout(timeout);
                    }, 2000);
                }
                var pic = $(e.currentTarget).attr("data-pic");
                Utils.share(pic);
            },
            onClickExit: function(e) {
                $.removeCookie("userId");
                window.location.reload();
            },
            share: function() {
                this.user.share({
                        success: function( newCouponsCount ){
                            if ( newCouponsCount ) {
                                Utils.showError("因为分享，小海送给你<span class='lotto-pointsCount'>" + newCouponsCount + "张奖券</span>！<br />现在奖券数<span class='lotto-pointsCount'>" + self.user.get("numOfCoupons") + "张</span>", "ლ（´∀`ლ） 恭喜你");
                            } else {
                                Utils.showError("这次木有奖券送，明天再试试手气会更好！", "( >﹏<。)～ 好遗憾");
                            }
                        }
                });
            }
        });
        // Returns the View class
        return MainView;
    }
);