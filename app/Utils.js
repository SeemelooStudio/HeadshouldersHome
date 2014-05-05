define(["jquery"],function ($) {
var Utils = {
    default: {
      shareImage:"app/img/weiboshare.jpg",
      shareUrl:"http://hfsshili.app.social-touch.com",
      shareTag:"#海飞丝巴西实力挑战赛# ",
      weiboAppKey:2081808740,
      weiboRelateUid:"1867772587"
    },
    animationEndTrigger:"webkitAnimationEnd mozAnimationEnd oAnimationEnd msAnimationEnd animationEnd animationend",
    isWechat: function() {
        var ua = navigator.userAgent.toLowerCase();
        if ( $("body").hasClass("wechat") ) {
            return true;
        } else if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }        
    },
    isQzone: function() {
        if ( $(".qzone").size()>0 ){
            return true;
        } else {
            return false;
        }
    },
    share: function(pic) {
        var shareString;
        var title;
        
        if ( pic ) {
            pic = this.default.shareUrl + "/" + pic;
        } else {
            pic = this.default.shareUrl + "/" + this.default.shareImage;
        }
        if ( this.isWechat() ) {
            $("#shareOverlay").show();
        } else if ( this.isQzone() ){
            title = $("title").html();
            var p = {
                url:location.href,
                title:title,
                pics:pic
            };
            var s = [];
            for(var i in p){
                s.push(i + '=' + encodeURIComponent(p[i]||''));
            }
            
            shareString = s.join('&');
            window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + shareString);
            
        } else {
            title = encodeURIComponent(this.default.shareTag +  $("title").html());
            shareString = "title=" + title + "&url=" + encodeURIComponent(window.location.href) + "&pic=" + pic + "&appkey=" + this.default.weiboAppKey + "&ralateUid=" + encodeURIComponent(this.default.weiboRelateUid);
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
            $("#errorTitle").text("(>﹏<) 小海好像出错了");
        }
        
        $("#error").show();
        $("#error .btn").one("tap", function(e){
            e.gesture.preventDefault();
            e.gesture.stopPropagation(); 
            e.gesture.stopDetect();
            
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
        $("#confirmOk").one("tap", function(e){
            e.gesture.preventDefault();
            e.gesture.stopPropagation(); 
            e.gesture.stopDetect();
            
            $("#confirm").hide();
            if (options.ok) {
                options.ok();
            }
            $("#confirmCancel").unbind("tap");
        });
        $("#confirmCancel").one("tap", function(e){
            e.gesture.preventDefault();
            e.gesture.stopPropagation(); 
            e.gesture.stopDetect();
            
            $("#confirm").hide();
            if (options.cancel) {
                options.cancel();
            }
            $("#confirmOk").unbind("tap");
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
    },
    isMsie: function(){
              var ua = window.navigator.userAgent;
              var msie = ua.indexOf ( "MSIE " );
        
              if ( msie > 0 )      // If Internet Explorer, return version number
              {   return true; }
              else                 // If another browser, return 0
              {   return false;}
        
    },
    isWindowsPhone: function() {
        if ( navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        } else {
            return false;
        }
    },
    isFirefox: function() {
        return typeof InstallTrigger !== 'undefined';
    },
    detectCSSFeature: function(featurename){
        var feature = false,
        domPrefixes = 'Webkit Moz ms O'.split(' '),
        elm = document.createElement('div'),
        featurenameCapital = null;
    
        featurename = featurename.toLowerCase();
    
        if( elm.style[featurename] !== undefined ) { feature = true; } 
    
        if( feature === false ) {
            featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);
            for( var i = 0; i < domPrefixes.length; i++ ) {
                if( elm.style[domPrefixes[i] + featurenameCapital ] !== undefined ) {
                  feature = true;
                  break;
                }
            }
        }
        return feature; 
    }
};

return Utils;

});
