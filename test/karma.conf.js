var coverageReporters = [
	{type: 'text-summary'}
];

var junitReporterConfig = {
	outputDir: 'test/results'
}

var reporters = [
	'dots',
	'coverage',
	'junit'
];

if (process.env.CIRCLECI) {
	console.log('On CI sending coveralls');
	coverageReporters.push({type: 'lcov', dir: process.env.CIRCLE_ARTIFACTS});
	reporters.push('coveralls');
	junitReporter.outputDir = process.env.CIRCLE_TEST_REPORTS;
} else {
	console.log('Not on CI so not sending coveralls');
	coverageReporters.push({type: 'html', dir: 'coverage/'});
}

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '..',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			'node_modules/angular/angular.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'node_modules/diff-match-patch/index.js',
			'test/*.js',
			'angular-diff-match-patch.js'
		],

		// list of files to exclude
		exclude: [
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'angular-diff-match-patch.js': ['coverage']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: reporters,

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		coverageReporter: {
			reporters: coverageReporters
		},

		junitReporter: junitReporterConfig
	});
};
