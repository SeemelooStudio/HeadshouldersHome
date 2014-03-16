define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  require("hammerjs");
  require("jqueryhammer");
  require("fakemultitouch");
  //views
  var MainView = require("views/MainView");
  var mainView;
  var StartView = require("views/StartView");
  var startView;
  var LottoView = require("views/LottoView");
  var lottoView;
  var LoginView = require("views/LoginView");
  var loginView;
  
  var GameView = require("views/GameView");
  var gameView;
  
  //models
  var User = require("models/User");
  var user;
  
  var Game = require("models/Game");
  var game;
  
  // Defining the application router.
  module.exports = Backbone.Router.extend({
    initialize: function() {
        user = new User();
        game = new Game();
        mainView = new MainView();
        
        startView = new StartView({ model: user });
        loginView = new LoginView({ user : user});
    },
    routes: {
      "": "index",
      "login":"login",
      "leaderboard/:type":"leaderboard",
      "lotto":"lotto",
      "gameDribble":"gameDribble",
      "gamePass":"gamePass",
      "gameShoot":"gameShoot"
    },

    index: function() {
        mainView.showHeader(function(){
            user.checkLogin();
        });
        
    },
    login: function() {
        mainView.showHeader(function(){
            loginView.render();
        });
    },
    leaderboard: function(type) {
        user.checkLogin();
        if ( !startView.isReady ) {
           startView.once("render", function(){
               startView.showLeaderboard(type);
           });
        } else {
            startView.showLeaderboard(type);
        }
    },
    lotto: function() {
        if ( user.get("isLogin") ) {
            mainView.hideHeader();
            lottoView = new LottoView( { model: user });
        } else {
            Backbone.history.navigate("login", { trigger: true, replace: true });
        }
        
    },
    gameDribble: function() {
        if ( user.get("isLogin") ) {
            mainView.hideHeader();
            gameView = new GameView({ model: game, user : user });
        } else {
            Backbone.history.navigate("login", { trigger: true, replace: true });
        }
        
    },
    ready: function(){        
        startView.ready();
    }
  });
});
