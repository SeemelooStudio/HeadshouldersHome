define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  require("hammerjs");
  require("jqueryhammer");
  require("jquerycookie");
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
      "login/:userId":"login",
      "leaderboard/:type":"leaderboard",
      "lottery":"lottery",
      "winningRecords":"winningRecords",
      "gameDribble":"gameDribble"
    },

    index: function() {
        prepareView.render();
        user.syncData();
        mainView.showHeader(function(){
            startView = new StartView({ user: user });
        });
        
    },
    login: function(userId) {
        prepareView.render();
        user.setUserId(userId);
        user.fetchDataByUserId({
            success:function(){
                Backbone.history.navigate("", { trigger: true, replace: true });
            },
            error: function(){
                alert("服务器出错了");
            }
        });
        
        
    },
    leaderboard: function(type) {
        prepareView.render();
        user.syncData();
        mainView.showHeader();
        if ( !startView ) {
            startView = new StartView({ user: user });
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
        user.syncData();
        mainView.hideHeader(function(){
            lottoView = new LottoView( { model: user });
        });
        
    },
    winningRecords: function() {
        prepareView.render();
        user.syncData();
        mainView.hideHeader(function(){
            lottoHistoryView = new LottoHistoryView( { collection:lottoHistory, user: user });

        });
    },
    gameDribble: function() {
        prepareView.render();
        user.syncData();
        mainView.hideHeader(function(){
            gameView = new GameView({ user : user, gameTypeId : 1});
        });
    },
    gamePass: function(){
        prepareView.render();
        user.syncData();
        mainView.hideHeader(function(){
            gameView = new GameView({ user : user, gameTypeId : 2});
        });
    },
    gameShoot: function(){
        prepareView.render();
        user.syncData();
        mainView.hideHeader(function(){
            gameView = new GameView({ user : user, gameTypeId : 3});
        });
    }
  });
});
