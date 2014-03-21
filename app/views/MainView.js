define(["jquery", "backbone","animationscheduler"],
    function ($, Backbone, AnimationScheduler) {
        var MainView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "body",
            // View constructor
            initialize: function (options) {
                this.headerAnimationScheduler = new AnimationScheduler(this.$el.find("#header"), {
                    hideAtFirst: false
                });
                this.$el.hammer();
            },
            // View Event Handlers
            events: {
                "click #logo":"onClickLogo",
                "tap #shareOverlay":"onClickShareOverlay",
                "tap .share":"onClickShare"
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
                    callback();
                } else {
                this.headerAnimationScheduler.animateIn(callback);
                }

            },
            onClickShareOverlay: function(e) {
                $("#shareOverlay").hide();
            },
            onClickShare: function(e) {
                this.share(e);
                
                
            },
            share: function(e) {
                var title = $(e.currentTarget).attr("data-title");
                var pic = $(e.currentTarget).attr("data-pic");
                var shareString;
                if ( title ) {
                    $("title").html(title);
                } else {
                    title = $("title").html();
                }
                if ( pic ) {
                    pic = "&pic=" + window.location.origin + "/" + pic;
                } else {
                    pic = "";
                }
                if ( this.isWechat() ) {
                    $("#shareOverlay").show();
                } else {
                    shareString = "title=" + title + "&url=" + window.location.href + pic;
                    window.open("http://v.t.sina.com.cn/share/share.php?" + shareString);
                }
                
            },
            isWechat: function() {
                var ua = navigator.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i)=="micromessenger") {
                    return true;
                } else {
                    return false;
                }
            }
        });
        // Returns the View class
        return MainView;
    }
);