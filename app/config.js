// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
  paths: {
    "vendor": "../../vendor",
    "almond": "../../vendor/bower/almond/almond",
    "underscore": "../../vendor/bower/lodash/dist/lodash.underscore",
    "jquery": "../../vendor/bower/jquery/dist/jquery",
    "backbone": "../../vendor/bower/backbone/backbone",
    "mustache": '../../vendor/bower/mustache/mustache',
    "text": "../../vendor/bower/text/text",
    "backbonetouch":"../vendor/backbone.touch",
    "hammerjs":"../vendor/bower/hammerjs/hammer",
    "jqueryhammer":"../vendor/jquery.hammer.min",
    "fakemultitouch":"../vendor/bower/hammerjs/plugins/hammer.fakemultitouch",
    "showtouches":"../vendor/bower/hammerjs/plugins/hammer.showtouches",
    
    "animationscheduler":"../vendor/animationScheduler",
    "image": "../vendor/image"
  },

  shim: {
    // This is required to ensure Backbone works as expected within the AMD
    // environment.
    "backbone": {
      // These are the two hard dependencies that will be loaded first.
      deps: ["jquery", "underscore"],

      // This maps the global `Backbone` object to `require("backbone")`.
      exports: "Backbone",
    },
    "hammerjs": {
      exports: 'Hammer'
    },
    "jqueryhammer": {
        deps: ['hammerjs']
    },
    "fakemultitouch": {
        deps: ['jqueryhammer']
    },
    "showtouches": {
        deps: ['jqueryhammer', "fakemultitouch"]
    }
    }
});
