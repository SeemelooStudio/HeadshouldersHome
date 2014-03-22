define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  require("hammerjs");
  require("jqueryhammer");
  
  //views
  var MainView = require("views/MainView");
  var mainView;
  var StartView = require("views/StartView");
  var startView;
  var LottoView = require("views/LottoView");
  var lottoView;
  var LottoHistoryView = require("views/LottoHistoryView");
  var lottoHistoryView;
  var PrepareView = require("views/PrepareView");
  var prepareView;
  
  var GameView = require("views/GameView");
  var gameView;
  
  //models
  var User = require("models/User");
  var user;
  
  var LottoHistory = require("collections/WinningRecords");
  var lottoHistory;
  
  
  // Defining the application router.
  module.exports = Backbone.Router.extend({
    initialize: function() {
        
        user = new User();
        mainView = new MainView();        
        prepareView = new PrepareView();
        lottoHistory = new LottoHistory();
        
    },
    routes: {
      "": "index",
      "leaderboard/:type":"leaderboard",
      "lottery":"lottery",
      "winningRecords":"winningRecords",
      "gameDribble":"gameDribble",
      "gamePass":"gameDribble",
      "gameShoot":"gameDribble"
    },

    index: function() {
        mainView.showHeader(function(){
            prepareView.render();
            startView = new StartView({ model: user });
        });
        
    },
    leaderboard: function(type) {
        if ( !startView ) {
            startView = new StartView({ model: user });
        }
        if ( !startView.isReady ) {
           startView.once("render", function(){
               startView.showLeaderboard(type);
           });
        } else {
            startView.showLeaderboard(type);
        }
    },
    lottery: function() {
        prepareView.render();
        mainView.hideHeader(function(){
            lottoView = new LottoView( { model: user });
        });
        
    },
    winningRecords: function() {
        prepareView.render();
        mainView.hideHeader(function(){
            lottoHistoryView = new LottoHistoryView( { collection:lottoHistory, user: user });

        });
    },
    gameDribble: function() {
        prepareView.render();
        mainView.hideHeader(function(){
            gameView = new GameView({ user : user, gameTypeId : 1});
        });
    },
    ready: function(){        
        startView.ready();
    }
  });
});
