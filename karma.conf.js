'use strict';

module.exports = function(karma) {
  karma.set({
    frameworks: ['mocha-debug', 'mocha', 'chai', 'browserify' ],

    files: [
      'test/**/*Spec.js'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      'test/**/*Spec.js': ['browserify', 'coverage']
    },

    client: {
      mocha: {
        reporter: 'html' // change Karma's debug.html to the mocha web reporter
        ,ui: 'bdd'
      }
    },

    browsers: [ 'Chrome' ],

    logLevel: 'LOG_DEBUG',

    singleRun: false,
    autoWatch: true,

    // browserify configuration
    browserify: {
      debug: true
    }
  });
};
