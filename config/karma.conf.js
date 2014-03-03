module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-facebook/lib/angular-facebook.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/restangular/dist/restangular.min.js',
      'bower_components/lodash/dist/lodash.underscore.min.js',
      'test/lib/angular/angular-mocks.js',
      'app/js/*.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],

    exclude : [
      'app/lib/angular/angular-loader.js',
      'app/lib/angular/*.min.js',
      'app/lib/angular/angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
