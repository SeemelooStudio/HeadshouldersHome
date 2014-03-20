define(function(require, exports, module) {
  "use strict";

var gameConfigs = {
    "dribbleGame": {
        "id" : 1,
        "name": "dribble",
        "enabled": true
    },
    "passGame": {
        "id" : 2,
        "name": "pass",
        "enabled": false        
    },
    "shootGame": {
        "id" : 3,
        "name": "shoot",
        "enabled": false            
    }
};
  
return gameConfigs;

});
