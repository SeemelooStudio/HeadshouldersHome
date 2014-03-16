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
    "hammerjs":"../vendor/hammer.min",
    "jqueryhammer":"../vendor/jquery.hammer.min",
    "fakemultitouch":"../vendor/hammer.fakemultitouch",
    "animationscheduler":"../vendor/animationScheduler",
    "image": "../vendor/image",
    "crafty":"../vendor/bower/crafty/dist/crafty-min"
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
    "fakemultitouch": {
        deps: ['hammerjs'],
        exports:"Hammer.plugins.fakemultitouch"
    },
    "jqueryhammer": {
        deps: ['hammerjs']
    }
    }
});
