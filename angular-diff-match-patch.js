/*
 angular-diff-match-patch
 http://amweiss.github.io/angular-diff-match-patch/
 @license: MIT
*/
angular.module('diff-match-patch', [])
	.factory('dmp', ['$window', function ($window) {
		var DiffMatchPatch = $window.diff_match_patch;

		var DIFF_INSERT = DiffMatchPatch.DIFF_INSERT;
		var DIFF_DELETE = DiffMatchPatch.DIFF_DELETE;

		var displayType = {
			INSDEL: 0,
			LINEDIFF: 1
		};

		function diffClass(op) {
			switch (op) {
				case DIFF_INSERT:
					return 'ins';
				case DIFF_DELETE:
					return 'del';
				default: // case DIFF_EQUAL:
					return 'match';
			}
		}

		function diffSymbol(op) {
			switch (op) {
				case DIFF_INSERT:
					return '+';
				case DIFF_DELETE:
					return '-';
				default: // case DIFF_EQUAL:
					return ' ';
			}
		}

		function diffTag(op) {
			switch (op) {
				case DIFF_INSERT:
					return 'ins';
				case DIFF_DELETE:
					return 'del';
				default: // case DIFF_EQUAL:
					return 'span';
			}
		}

		function diffAttrName(op) {
			switch (op) {
				case DIFF_INSERT:
					return 'insert';
				case DIFF_DELETE:
					return 'delete';
				default: // case DIFF_EQUAL:
					return 'equal';
			}
		}

		function getTagAttrs(options, op, attrs) {
			var tagOptions = {};
			var retVal = [];
			var opName = diffAttrName(op);

			if (angular.isDefined(options) && angular.isDefined(options.attrs)) {
				var attributesFromOptions = options.attrs[opName];
				if (angular.isDefined(attributesFromOptions)) {
					angular.merge(tagOptions, attributesFromOptions);
				}
			}

			if (angular.isDefined(attrs)) {
				angular.merge(tagOptions, attrs);
			}

			if (Object.keys(tagOptions).length === 0) {
				return '';
			}

			angular.forEach(tagOptions, function (value, key) {
				retVal.push(key + '="' + value + '"');
			});

			return ' ' + retVal.join(' ');
		}

		function getHtmlPrefix(op, display, options) {
			switch (display) {
				case displayType.LINEDIFF:
					return '<div class="' + diffClass(op) + '"><span' + getTagAttrs(options, op, {class: 'noselect'}) + '>' + diffSymbol(op) + '</span>';
				default: // case displayType.INSDEL:
					return '<' + diffTag(op) + getTagAttrs(options, op) + '>';
			}
		}

		function getHtmlSuffix(op, display) {
			switch (display) {
				case displayType.LINEDIFF:
					return '</div>';
				default: // case displayType.INSDEL:
					return '</' + diffTag(op) + '>';
			}
		}

		function createHtmlLines(text, op, options) {
			var lines = text.split('\n');
			var y;
			for (y = 0; y < lines.length; y++) {
				if (lines[y].length === 0) {
					continue;
				}
				lines[y] = getHtmlPrefix(op, displayType.LINEDIFF, options) + lines[y] + getHtmlSuffix(op, displayType.LINEDIFF);
			}
			return lines.join('');
		}

		function createHtmlFromDiffs(diffs, display, options, excludeOp) {
			var x;
			var html = [];
			var y;
			var op;
			var text;
			var diffData = diffs;
			var dmp = (display === displayType.LINEDIFF) ? new DiffMatchPatch() : null;
			var intraDiffs;
			var intraHtml1;
			var intraHtml2;

			for (x = 0; x < diffData.length; x++) {
				diffData[x][1] = diffData[x][1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}

			for (y = 0; y < diffData.length; y++) {
				op = diffData[y][0];
				text = diffData[y][1];
				if (display === displayType.LINEDIFF) {
					if (angular.isDefined(options) && angular.isDefined(options.interLineDiff) && options.interLineDiff && diffs[y][0] === DIFF_DELETE && angular.isDefined(diffs[y + 1]) && diffs[y + 1][0] === DIFF_INSERT && diffs[y][1].indexOf('\n') === -1) {
						intraDiffs = dmp.diff_main(diffs[y][1], diffs[y + 1][1]);
						dmp.diff_cleanupSemantic(intraDiffs);
						intraHtml1 = createHtmlFromDiffs(intraDiffs, displayType.INSDEL, options, DIFF_INSERT);
						intraHtml2 = createHtmlFromDiffs(intraDiffs, displayType.INSDEL, options, DIFF_DELETE);
						html[y] = createHtmlLines(intraHtml1, DIFF_DELETE, options);
						html[y + 1] = createHtmlLines(intraHtml2, DIFF_INSERT, options);
						y++;
					} else {
						html[y] = createHtmlLines(text, op, options);
					}
				} else if (typeof excludeOp === 'undefined' || op !== excludeOp) {
					html[y] = getHtmlPrefix(op, display, options) + text + getHtmlSuffix(op, display);
				}
			}
			return html.join('');
		}

		function assertArgumentsIsStrings(left, right) {
			return angular.isString(left) && angular.isString(right);
		}

		// Taken from source https://code.google.com/p/google-diff-match-patch/
		// and then modified for style and to strip newline
		function linesToChars(text1, text2, ignoreTrailingNewLines) {
			var lineArray = [];
			var lineHash = {};
			lineArray[0] = '';

			function linesToCharsMunge(text) {
				var chars = '';
				var lineStart = 0;
				var lineEnd = -1;
				var lineArrayLength = lineArray.length;
				var hasNewLine = false;
				while (lineEnd < text.length - 1) {
					lineEnd = text.indexOf('\n', lineStart);
					hasNewLine = (lineEnd !== -1);
					if (!hasNewLine) {
						lineEnd = text.length - 1;
					}

					var line = text.substring(lineStart, lineEnd + ((ignoreTrailingNewLines && hasNewLine) ? 0 : 1));
					lineStart = lineEnd + 1;

					if (Object.prototype.hasOwnProperty.call(lineHash, line)) {
						chars += String.fromCharCode(lineHash[line]);
					} else {
						chars += String.fromCharCode(lineArrayLength);
						lineHash[line] = lineArrayLength;
						lineArray[lineArrayLength++] = line;
					}
				}
				return chars;
			}

			var chars1 = linesToCharsMunge(text1);
			var chars2 = linesToCharsMunge(text2);
			return {chars1: chars1, chars2: chars2, lineArray: lineArray};
		}

		// Taken from source https://code.google.com/p/google-diff-match-patch/
		// and then modified for style and to strip newline
		function charsToLines(diffs, lineArray, ignoreTrailingNewLines) {
			for (var x = 0; x < diffs.length; x++) {
				var chars = diffs[x][1];
				var text = [];
				for (var y = 0; y < chars.length; y++) {
					text[y] = lineArray[chars.charCodeAt(y)];
				}
				diffs[x][1] = text.join((ignoreTrailingNewLines) ? '\n' : '');
			}
		}

		return {
			createDiffHtml: function (left, right, options) {
				var diffs;
				if (assertArgumentsIsStrings(left, right)) {
					diffs = new DiffMatchPatch().diff_main(left, right);
					return createHtmlFromDiffs(diffs, displayType.INSDEL, options);
				}
				return '';
			},

			createProcessingDiffHtml: function (left, right, options) {
				var dmp;
				var diffs;
				if (assertArgumentsIsStrings(left, right)) {
					dmp = new DiffMatchPatch();
					diffs = dmp.diff_main(left, right);

					if (angular.isDefined(options) && angular.isDefined(options.editCost) && isFinite(options.editCost)) {
						dmp.Diff_EditCost = options.editCost; // eslint-disable-line camelcase
					}

					dmp.diff_cleanupEfficiency(diffs);
					return createHtmlFromDiffs(diffs, displayType.INSDEL, options);
				}
				return '';
			},

			createSemanticDiffHtml: function (left, right, options) {
				var dmp;
				var diffs;
				if (assertArgumentsIsStrings(left, right)) {
					dmp = new DiffMatchPatch();
					diffs = dmp.diff_main(left, right);
					dmp.diff_cleanupSemantic(diffs);
					return createHtmlFromDiffs(diffs, displayType.INSDEL, options);
				}
				return '';
			},

			createLineDiffHtml: function (left, right, options) {
				var dmp;
				var chars;
				var diffs;
				if (assertArgumentsIsStrings(left, right)) {
					dmp = new DiffMatchPatch();
					var ignoreTrailingNewLines = angular.isDefined(options) && angular.isDefined(options.ignoreTrailingNewLines) && options.ignoreTrailingNewLines;
					chars = linesToChars(left, right, ignoreTrailingNewLines);
					diffs = dmp.diff_main(chars.chars1, chars.chars2, false);
					charsToLines(diffs, chars.lineArray, ignoreTrailingNewLines);
					return createHtmlFromDiffs(diffs, displayType.LINEDIFF, options);
				}
				return '';
			}
		};
	}])
	.directive('diff', ['$compile', 'dmp', function ($compile, dmp) {
		var ddo = {
			scope: {
				left: '=leftObj',
				right: '=rightObj',
				options: '=options'
			},
			link: function (scope, iElement) {
				var listener = function () {
					iElement.html(dmp.createDiffHtml(scope.left, scope.right, scope.options));
					// If no options given, or, we have been given options and don't want to skip angular compiling
					// Then compile angular in the diff.
					if (!scope.options || (scope.options && !scope.options.skipAngularCompilingOnDiff)) {
						$compile(iElement.contents())(scope);
					}
				};
				scope.$watch('left', listener);
				scope.$watch('right', listener);
			}
		};
		return ddo;
	}])
	.directive('processingDiff', ['$compile', 'dmp', function ($compile, dmp) {
		var ddo = {
			scope: {
				left: '=leftObj',
				right: '=rightObj',
				options: '=options'
			},
			link: function (scope, iElement) {
				var listener = function () {
					iElement.html(dmp.createProcessingDiffHtml(scope.left, scope.right, scope.options));
					// If no options given, or, we have been given options and don't want to skip angular compiling
					// Then compile angular in the diff.
					if (!scope.options || (scope.options && !scope.options.skipAngularCompilingOnDiff)) {
						$compile(iElement.contents())(scope);
					}
				};
				scope.$watch('left', listener);
				scope.$watch('right', listener);
				scope.$watch('options.editCost', listener, true);
			}
		};
		return ddo;
	}])
	.directive('semanticDiff', ['$compile', 'dmp', function ($compile, dmp) {
		var ddo = {
			scope: {
				left: '=leftObj',
				right: '=rightObj',
				options: '=options'
			},
			link: function (scope, iElement) {
				var listener = function () {
					iElement.html(dmp.createSemanticDiffHtml(scope.left, scope.right, scope.options));
					// If no options given, or, we have been given options and don't want to skip angular compiling
					// Then compile angular in the diff.
					if (!scope.options || (scope.options && !scope.options.skipAngularCompilingOnDiff)) {
						$compile(iElement.contents())(scope);
					}
				};
				scope.$watch('left', listener);
				scope.$watch('right', listener);
			}
		};
		return ddo;
	}])
	.directive('lineDiff', ['$compile', 'dmp', function ($compile, dmp) {
		var ddo = {
			scope: {
				left: '=leftObj',
				right: '=rightObj',
				options: '=options'
			},
			link: function (scope, iElement) {
				var listener = function () {
					iElement.html(dmp.createLineDiffHtml(scope.left, scope.right, scope.options));
					// If no options given, or, we have been given options and don't want to skip angular compiling
					// Then compile angular in the diff.
					if (!scope.options || (scope.options && !scope.options.skipAngularCompilingOnDiff)) {
						$compile(iElement.contents())(scope);
					}
				};
				scope.$watch('left', listener);
				scope.$watch('right', listener);
				scope.$watch('options.interLineDiff', listener, true);
				scope.$watch('options.ignoreTrailingNewLines', listener, true);
			}
		};
		return ddo;
	}]);
