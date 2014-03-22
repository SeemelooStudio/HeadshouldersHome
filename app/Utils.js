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
            $("")
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
    showError: function( errorMessage, callback ) {
        $("#errorContent").html(errorMessage);
        $("#error").show();
        $("#error .btn").one("tap", function(){
            $("#error").hide();
            if (callback) {
                callback();
            }
        });
    },
    highlight: function($el, color) {
        $el.addClass("highlight tada " + color);
        $el.one(this.animationEndTrigger, function(e){
            $el.removeClass("highlight tada " + color);
        });
    }
};
  
return Utils;

});
