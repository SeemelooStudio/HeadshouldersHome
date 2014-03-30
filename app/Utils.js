define(["jquery"],function ($) {
var Utils = {
    default: {
      shareImage:"app/img/logo.png",
      shareUrl:"http://quiz.seemeloo.com/hs",
      shareTag:"#海飞丝巴西实力挑战赛# "
    },
    animationEndTrigger:"webkitAnimationEnd mozAnimationEnd oAnimationEnd msAnimationEnd animationEnd animationend",
    isWechat: function() {
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }        
    },
    share: function(pic) {
        var shareString;
        var title = encodeURIComponent(this.default.shareTag +  $("title").html());
        
        if ( pic ) {
            pic = "&pic=" + this.default.shareUrl + "/" + pic;
        } else {
            pic = "&pic=" + this.default.shareUrl + "/" + this.default.shareImage;
        }
        if ( this.isWechat() ) {
            $("#shareOverlay").show();
        } else {
            shareString = "title=" + title + "&url=" + window.location.href + pic;
            window.open("http://v.t.sina.com.cn/share/share.php?" + shareString);
        }      
    },
    setPageTitle: function(title) {
        if ( title ) {
            $("title").html(title);
        }
    },
    getParameterByName: function( name,href )
            {
              name = name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
              var regexS = "[\\?&]"+name+"=([^&#]*)";
              var regex = new RegExp( regexS );
              var results = regex.exec( href );
              if( results === null )
                return "";
              else
                return decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    showError: function(errorMessage, title, callback ) {
        if ( errorMessage ) {
            $("#errorContent").html(errorMessage);
        } else {
            $("#errorContent").html("网络有些问题，刷新页面看看吧");
        }
        
        if ( title ) {
            $("#errorTitle").text(title);
        } else {
            $("#errorTitle").text("( T-T) 出错了");
        }
        
        $("#error").show();
        $("#error .btn").one("tap", function(){
            $("#error").hide();
            if (callback) {
                callback();
            }
        });
    },
    showConfirm: function( options ) {
        if ( options.content ) {
            $("#confirmContent").html(options.content);
        } 
        if ( options.title ) {
            $("#confirmTitle").text(options.title);
        } else {
            $("#confirmTitle").text("( T-T)");
        }
        if ( options.okText ) {
            $("#confirmOk .btn-inner").text(options.okText);
        } else {
            $("#confirmOk .btn-inner").text("确定");
        }
        if ( options.cancelText ) {
            $("#confirmCancel .btn-inner").text(options.cancelText);
        } else {
            $("#confirmCancel .btn-inner").text("取消");
        }
        
        $("#confirm").show();
        $("#confirmOk").one("tap", function(){
            $("#confirm").hide();
            if (options.ok) {
                options.ok();
            }
        });
        $("#confirmCancel").one("tap", function(){
            $("#confirm").hide();
            if (options.cancel) {
                options.cancel();
            }
        });
    },
    highlight: function($el, color) {
        $el.addClass("highlight tada " + color);
        $el.one(this.animationEndTrigger, function(e){
            $el.removeClass("highlight tada " + color);
        });
    },
    validateName: function(name) {
        var regex = /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/;
        var results = regex.test( name );
        return results;
    },
    validatePhone: function(phone) {
       var regex= /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
       var results = regex.test( phone );
       return results;

    },
    validateAddress: function(address) {
        if (address.length < 15 ) {
            return false;
        } else {
            return true;
        }
    }
};
  
return Utils;

});
