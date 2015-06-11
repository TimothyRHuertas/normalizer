'use strict';

module.exports = function(karma) {
  var configuration = {
    frameworks: ['mocha', 'chai', 'browserify' ],

    files: [
      'test/**/*Spec.js'
    ],

    reporters: ['progress'],
    browserNoActivityTimeout: 100000,
    preprocessors: {
      'test/**/*Spec.js': ['browserify']
    },

    client: {
      mocha: {
        reporter: 'html' // change Karma's debug.html to the mocha web reporter
        ,ui: 'bdd'
      }
    },

    browsers: [ 'Chrome', 'ChromeCanary' ],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    logLevel: 'LOG_DEBUG',

    singleRun: false,
    autoWatch: true,

    // browserify configuration
    browserify: {
      debug: true,
      transform: [ 'babelify', 'hintify' ]
    }
  };

  if(process.env.TRAVIS){
    configuration.browsers = ['Chrome_travis_ci'];
  }

  karma.set(configuration);

};
