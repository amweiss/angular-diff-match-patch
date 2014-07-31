// Karma configuration file
// See http://karma-runner.github.io/0.10/config/configuration-file.html
module.exports = function(config) {
	config.set({
		basePath: '..',

		frameworks: ['jasmine'],

		preprocessors: {
			'angular-diff-match-patch.js': ['coverage']
		},

		reporters: ['progress', 'coverage'],

		// list of files / patterns to load in the browser
		files: [
			// libraries
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'bower_components/google-diff-match-patch/javascript/diff_match_patch_uncompressed.js',

			// our app
			'angular-diff-match-patch.js',

			// tests
			'test/*.js'//,
		],

		autoWatch: true,
		browsers: ['PhantomJS'],

		coverageReporter: {
			type: 'html',
			dir: 'coverage/'
		}
	});
};
