define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  var Hammer = require("hammerjs");
  require("fakemultitouch");
  var JqueryHammer = require("jqueryhammer");
  //views
  var MainView = require("views/MainView");
  var mainView;
  var StartView = require("views/StartView");
  var startView;
  var LottoView = require("views/LottoView");
  var lottoView;
  
  //models
  var User = require("models/User");
  var user;
  
  // Defining the application router.
  module.exports = Backbone.Router.extend({
    initialize: function() {
        user = new User();
        mainView = new MainView();
    },
    routes: {
      "": "index",
      "leaderboard/:type":"leaderboard",
      "lotto":"lotto"
    },

    index: function() {
        mainView.showHeader(function(){
            if ( startView ) {
                startView.render();
            } else {
                startView = new StartView({ model: user });
                user.login();
            }
            
        });
        
    },
    
    leaderboard: function(type) {
        if ( !startView ) {
            startView = new StartView({ model: user });
            user.login();
        }
        if ( !startView.isReady ) {
           startView.once("render", function(){
               startView.showLeaderboard(type);
           });
        } else {
            startView.showLeaderboard(type);
        }
    },
    lotto: function() {
        mainView.hideHeader();
        lottoView = new LottoView( { model: user });
        user.login();
    },
    ready: function(){        
        startView.ready();
    }
  });
});
