/*
 angular-diff-match-patch
 http://amweiss.github.io/angular-diff-match-patch/
 @license: MIT
*/
angular.module('diff-match-patch', [])
	.factory('dmp', ['$window', function dmpFactory($window) {
		var DiffMatchPatch = $window.diff_match_patch;
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
			var tagOptions = new Map();
			var retVal = [];
			var opName = diffAttrName(op);

			if (angular.isDefined(options) && angular.isDefined(options.attrs) && options.attrs instanceof Map && options.attrs.has(opName)) {
				options.attrs.get(opName).forEach(function (value, key) {
					tagOptions.set(key, value);
				});
			}

			if (angular.isDefined(attrs)) {
				attrs.forEach(function (value, key) {
					tagOptions.set(key, value);
				});
			}

			if (tagOptions.size === 0) {
				return '';
			}

			tagOptions.forEach(function (value, key) {
				retVal.push(key + '="' + value + '"');
			});

			return ' ' + retVal.join(' ');
		}

		function getHtmlPrefix(op, display, options) {
			switch (display) {
				case displayType.LINEDIFF:
					return '<div class="' + diffClass(op) + '"><span' + getTagAttrs(options, op, new Map().set('class', 'noselect')) + '>' + diffSymbol(op) + '</span>';
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
					if (angular.isDefined(options) && angular.isDefined(options.interLineDiff) && options.interLineDiff && diffs[y][0] === DIFF_DELETE && diffs[y + 1][0] === DIFF_INSERT && diffs[y][1].indexOf('\n') === -1) {
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

		return {
			createDiffHtml: function createDiffHtml(left, right, options) {
				var diffs;
				if (assertArgumentsIsStrings(left, right)) {
					diffs = new DiffMatchPatch().diff_main(left, right);
					return createHtmlFromDiffs(diffs, displayType.INSDEL, options);
				}
				return '';
			},

			createProcessingDiffHtml: function createProcessingDiffHtml(left, right, options) {
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

			createSemanticDiffHtml: function createSemanticDiffHtml(left, right, options) {
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

			createLineDiffHtml: function createLineDiffHtml(left, right, options) {
				var dmp;
				var chars;
				var diffs;
				if (assertArgumentsIsStrings(left, right)) {
					dmp = new DiffMatchPatch();
					chars = dmp.diff_linesToChars_(left, right);
					diffs = dmp.diff_main(chars.chars1, chars.chars2, false);
					dmp.diff_charsToLines_(diffs, chars.lineArray);
					return createHtmlFromDiffs(diffs, displayType.LINEDIFF, options);
				}
				return '';
			}
		};
	}])
	.directive('diff', ['$compile', 'dmp', function factory($compile, dmp) {
		var ddo = {
			scope: {
				left: '=leftObj',
				right: '=rightObj',
				options: '=options'
			},
			link: function postLink(scope, iElement) {
				var listener = function listener() {
					iElement.html(dmp.createDiffHtml(scope.left, scope.right, scope.options));
					$compile(iElement.contents())(scope);
				};
				scope.$watch('left', listener);
				scope.$watch('right', listener);
			}
		};
		return ddo;
	}])
	.directive('processingDiff', ['$compile', 'dmp', function factory($compile, dmp) {
		var ddo = {
			scope: {
				left: '=leftObj',
				right: '=rightObj',
				options: '=options'
			},
			link: function postLink(scope, iElement) {
				var listener = function listener() {
					iElement.html(dmp.createProcessingDiffHtml(scope.left, scope.right, scope.options));
					$compile(iElement.contents())(scope);
				};
				scope.$watch('left', listener);
				scope.$watch('right', listener);
				scope.$watch('options.editCost', listener, true);
			}
		};
		return ddo;
	}])
	.directive('semanticDiff', ['$compile', 'dmp', function factory($compile, dmp) {
		var ddo = {
			scope: {
				left: '=leftObj',
				right: '=rightObj',
				options: '=options'
			},
			link: function postLink(scope, iElement) {
				var listener = function listener() {
					iElement.html(dmp.createSemanticDiffHtml(scope.left, scope.right, scope.options));
					$compile(iElement.contents())(scope);
				};
				scope.$watch('left', listener);
				scope.$watch('right', listener);
			}
		};
		return ddo;
	}])
	.directive('lineDiff', ['$compile', 'dmp', function factory($compile, dmp) {
		var ddo = {
			scope: {
				left: '=leftObj',
				right: '=rightObj',
				options: '=options'
			},
			link: function postLink(scope, iElement) {
				var listener = function listener() {
					iElement.html(dmp.createLineDiffHtml(scope.left, scope.right, scope.options));
					$compile(iElement.contents())(scope);
				};
				scope.$watch('left', listener);
				scope.$watch('right', listener);
				scope.$watch('options.interLineDiff', listener, true);
			}
		};
		return ddo;
	}]);
