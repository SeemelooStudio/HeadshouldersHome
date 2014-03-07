define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  var BackboneTouch = require("backbonetouch");
  
  //views
  var MainView = require("views/MainView");
  var mainView;
  var StartView = require("views/StartView");
  var startView;
  
  //models
  var User = require("models/User");
  var user;
  
  // Defining the application router.
  module.exports = Backbone.Router.extend({
    initialize: function() {
        user = new User();
        mainView = new MainView();
        startView = new StartView({ model: user });
        
    },
    routes: {
      "": "index",
      "leaderboard":"leaderboard"
    },

    index: function() {
      console.log("Welcome to your / route.");
    },
    
    leaderboard: function() {

    },
    ready: function(){
        
        
        startView.ready();
    }
  });
});
