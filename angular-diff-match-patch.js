/*
 angular-diff-match-patch
 http://amweiss.github.io/angular-diff-match-patch/
 @license: MIT
*/
/* global DIFF_INSERT, DIFF_DELETE, DIFF_EQUAL, diff_match_patch */
/// <reference path="typings/tsd.d.ts" />
angular.module('diff-match-patch', [])
	.factory('dmp', ['$window', function($window) {

        var diff_match_patch = $window.diff_match_patch;

		var displayType = {
			INSDEL: 0,
			LINEDIFF: 1
		};

		function diffClass(op) {
			switch(op) {
				case DIFF_INSERT: return 'ins';
				case DIFF_DELETE: return 'del';
				case DIFF_EQUAL: return 'match';
			}
		}

		function diffSymbol(op) {
			switch(op) {
				case DIFF_EQUAL: return ' ';
				case DIFF_INSERT: return '+';
				case DIFF_DELETE: return '-';
			}
		}

		function diffTag(op) {
			switch(op) {
				case DIFF_EQUAL: return 'span';
				case DIFF_INSERT: return 'ins';
				case DIFF_DELETE: return 'del';
			}
		}

		function diffAttrName(op) {
			switch(op) {
				case DIFF_EQUAL: return 'equal';
				case DIFF_INSERT: return 'insert';
				case DIFF_DELETE: return 'delete';
			}
		}

		function isEmptyObject(o) {
		    return Object.getOwnPropertyNames(o).length === 0;
		}

		function getTagAttrs(options, op, attrs) {
			attrs = attrs || {};

			var tagOptions = {};
			if (angular.isDefined(options) && angular.isDefined(options.attrs)){
				tagOptions = angular.copy(options.attrs[diffAttrName(op)] || {});
			}

			if (isEmptyObject(tagOptions) && isEmptyObject(attrs)) {
				return '';
			}

			for (var k in attrs) {
				if (angular.isDefined(tagOptions[k])) {
					// The attribute defined in attrs should be first
					tagOptions[k] = attrs[k] + ' ' + tagOptions[k];
				}
				else {
					tagOptions[k] = attrs[k];
				}
			}

			var lis = [];
			for (var k in tagOptions) {
				lis.push(k+'="'+tagOptions[k] + '"');
			}
			return ' ' + lis.join(' ');
		}

		function getHtmlPrefix(op, display, options) {
			var retVal = '';
				switch(display) {
					case displayType.LINEDIFF:
						retVal = '<div class="'+diffClass(op)+'"><span' + getTagAttrs(options, op, {'class': 'noselect'}) + '>'+diffSymbol(op)+'</span>';
						break;
					case displayType.INSDEL:
						var tag = diffTag(op);

						retVal = '<' + tag + getTagAttrs(options, op) + '>';
						break;
				}
			return retVal;
		}

		function getHtmlSuffix(op, display) {
			var retVal = '';
				switch(display) {
					case displayType.LINEDIFF:
						retVal = '</div>';
						break;
					case displayType.INSDEL:
						retVal = '</'+diffTag(op)+'>';
						break;
				}
			return retVal;
		}

		function createHtmlLines(text, op, options) {
			var lines = text.split('\n');
			for (var y = 0; y < lines.length; y++) {
				if (lines[y].length === 0) continue;
				lines[y] = getHtmlPrefix(op, displayType.LINEDIFF, options) + lines[y] + getHtmlSuffix(op, displayType.LINEDIFF);
			}
			return lines.join('');
		}

		function createHtmlFromDiffs(diffs, display, options) {
			var pattern_amp = /&/g;
			var pattern_lt = /</g;
			var pattern_gt = />/g;
			for (var x = 0; x < diffs.length; x++) {
				var data = diffs[x][1];
				var text = data.replace(pattern_amp, '&amp;')
					.replace(pattern_lt, '&lt;')
					.replace(pattern_gt, '&gt;');
				diffs[x][1] = text;
			}
		
			var html = [];
			for (var x = 0; x < diffs.length; x++) {
				var op = diffs[x][0];
				var text = diffs[x][1];
				if (display === displayType.LINEDIFF) {
					html[x] = createHtmlLines(text, op, options);
				} else {
					html[x] = getHtmlPrefix(op, display, options) + text + getHtmlSuffix(op, display);
				}
			}
			return html.join('');
		}

		function assertArgumentsIsStrings(left, right) {
			return angular.isString(left) && angular.isString(right);
		}

		return {
			createDiffHtml: function(left, right, options) {
				if (assertArgumentsIsStrings(left, right)) {
					var dmp = new diff_match_patch();
					var diffs = dmp.diff_main(left, right);
					return createHtmlFromDiffs(diffs, displayType.INSDEL, options);
				} else {
					return '';
				}
			},

			createProcessingDiffHtml: function(left, right, options) {
				if (assertArgumentsIsStrings(left, right)) {
					var dmp = new diff_match_patch();
					var diffs = dmp.diff_main(left, right);
					//dmp.Diff_EditCost = 4;
					dmp.diff_cleanupEfficiency(diffs);
					return createHtmlFromDiffs(diffs, displayType.INSDEL, options);
				} else {
					return '';
				}
			},

			createSemanticDiffHtml: function(left, right, options) {
				if (assertArgumentsIsStrings(left, right)) {
					var dmp = new diff_match_patch();
					var diffs = dmp.diff_main(left, right);
					dmp.diff_cleanupSemantic(diffs);
					return createHtmlFromDiffs(diffs, displayType.INSDEL, options);
				} else {
					return '';
				}
			},

			createLineDiffHtml: function(left, right, options) {
				if (assertArgumentsIsStrings(left, right)) {
					var dmp = new diff_match_patch();
					var a = dmp.diff_linesToChars_(left, right);
					var diffs = dmp.diff_main(a.chars1, a.chars2, false);
					dmp.diff_charsToLines_(diffs, a.lineArray);
					return createHtmlFromDiffs(diffs, displayType.LINEDIFF, options);
				} else {
					return '';
				}
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
						var listener = function() {
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
						var listener = function() {
							iElement.html(dmp.createProcessingDiffHtml(scope.left, scope.right, scope.options));
							$compile(iElement.contents())(scope);
						};
						scope.$watch('left', listener);
						scope.$watch('right', listener);
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
						var listener = function() {
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
					var listener = function() {
						iElement.html(dmp.createLineDiffHtml(scope.left, scope.right, scope.options));
						$compile(iElement.contents())(scope);
					};
					scope.$watch('left', listener);
					scope.$watch('right', listener);
				}
		};
		return ddo;
	}]);
