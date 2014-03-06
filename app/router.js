define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  var BackboneTouch = require("backbonetouch");
  
  // Defining the application router.
  module.exports = Backbone.Router.extend({
    routes: {
      "": "index",
      "leaderboard":"leaderboard"
    },

    index: function() {
      console.log("Welcome to your / route.");
    },
    
    leaderboard: function() {
      console.log("Welcome to your / route.");
    }
  });
});
