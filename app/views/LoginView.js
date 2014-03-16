define(["jquery", "backbone","mustache", "text!templates/Login.html","hammerjs"],
    function ($, Backbone, Mustache, template, Hammer) {
        var LoginView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#main",
            // View constructor
            initialize: function (options) {
                this.user = options.user;
                this.listenTo(this, "render", this.postRender);
            },
            // View Event Handlers
            events: {
                "touch #weiboLogin": "onClickWeibo",
                "touch #wechatLogin": "onWechat"
            },
            render: function(){
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, {}));
                this.trigger("render");
                return this;                
            },
            postRender: function() {
                this.$el.hammer();
                Hammer.plugins.fakeMultitouch();
            },
            onClickWeibo: function() {
                this.user.weiboLogin();
            },
            onWechat: function() {
                this.user.wechatLogin();
            }
        });
        // Returns the View class
        return LoginView;
    }
);