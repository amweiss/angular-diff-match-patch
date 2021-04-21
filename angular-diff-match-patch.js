/*
 angular-diff-match-patch
 http://amweiss.github.io/angular-diff-match-patch/
 @license: MIT
*/
angular.module('diff-match-patch', [])
	.constant('DiffMatchPatch', diff_match_patch)
	.factory('DIFF_INSERT', ['DiffMatchPatch', function (DiffMatchPatch) {
		return DiffMatchPatch.DIFF_INSERT === undefined ? DIFF_INSERT : DiffMatchPatch.DIFF_INSERT;
	}])
	.factory('DIFF_DELETE', ['DiffMatchPatch', function (DiffMatchPatch) {
		return DiffMatchPatch.DIFF_DELETE === undefined ? DIFF_DELETE : DiffMatchPatch.DIFF_DELETE;
	}])
	.factory('dmp', ['DiffMatchPatch', 'DIFF_INSERT', 'DIFF_DELETE', function (DiffMatchPatch, DIFF_INSERT, DIFF_DELETE) {
		const displayType = {
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
			const tagOptions = {};
			const returnValue = [];
			const opName = diffAttrName(op);

			if (angular.isDefined(options) && angular.isDefined(options.attrs)) {
				const attributesFromOptions = options.attrs[opName];
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

			for (const [key, value] of Object.entries(tagOptions)) {
				returnValue.push(key + '="' + value + '"');
			}

			return ' ' + returnValue.join(' ');
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
			const lines = text.split('\n');
			let y;
			for (y = 0; y < lines.length; y++) {
				if (lines[y].length === 0) {
					continue;
				}

				lines[y] = getHtmlPrefix(op, displayType.LINEDIFF, options) + lines[y] + getHtmlSuffix(op, displayType.LINEDIFF);
			}

			return lines.join('');
		}

		function createHtmlFromDiffs(diffs, display, options, excludeOp) {
			let x;
			const html = [];
			let y;
			let op;
			let text;
			const diffData = diffs;
			const dmp = (display === displayType.LINEDIFF) ? new DiffMatchPatch() : null;
			let intraDiffs;
			let intraHtml1;
			let intraHtml2;

			for (x = 0; x < diffData.length; x++) {
				diffData[x][1] = diffData[x][1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}

			for (y = 0; y < diffData.length; y++) {
				op = diffData[y][0];
				text = diffData[y][1];
				if (display === displayType.LINEDIFF) {
					if (angular.isDefined(options) && angular.isDefined(options.interLineDiff) && options.interLineDiff && diffs[y][0] === DIFF_DELETE && angular.isDefined(diffs[y + 1]) && diffs[y + 1][0] === DIFF_INSERT && !diffs[y][1].includes('\n')) {
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
			const lineArray = [];
			const lineHash = {};
			lineArray[0] = '';

			function linesToCharsMunge(text) {
				let chars = '';
				let lineStart = 0;
				let lineEnd = -1;
				let lineArrayLength = lineArray.length;
				let hasNewLine = false;
				while (lineEnd < text.length - 1) {
					lineEnd = text.indexOf('\n', lineStart);
					hasNewLine = (lineEnd !== -1);
					if (!hasNewLine) {
						lineEnd = text.length - 1;
					}

					const line = text.slice(lineStart, lineEnd + ((ignoreTrailingNewLines && hasNewLine) ? 0 : 1));
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

			const chars1 = linesToCharsMunge(text1);
			const chars2 = linesToCharsMunge(text2);
			return {chars1, chars2, lineArray};
		}

		// Taken from source https://code.google.com/p/google-diff-match-patch/
		// and then modified for style and to strip newline
		function charsToLines(diffs, lineArray, ignoreTrailingNewLines) {
			for (let i = 0; i < diffs.length; i++) { // eslint-disable-line unicorn/no-for-loop
				const chars = diffs[i][1];
				const text = [];
				for (let y = 0; y < chars.length; y++) {
					text[y] = lineArray[chars.charCodeAt(y)];
				}

				diffs[i][1] = text.join((ignoreTrailingNewLines) ? '\n' : '');
			}
		}

		return {
			createDiffHtml(left, right, options) {
				let diffs;
				if (assertArgumentsIsStrings(left, right)) {
					diffs = new DiffMatchPatch().diff_main(left, right);
					return createHtmlFromDiffs(diffs, displayType.INSDEL, options);
				}

				return '';
			},

			createProcessingDiffHtml(left, right, options) {
				let dmp;
				let diffs;
				if (assertArgumentsIsStrings(left, right)) {
					dmp = new DiffMatchPatch();
					diffs = dmp.diff_main(left, right);

					if (angular.isDefined(options) && angular.isDefined(options.editCost) && Number.isFinite(options.editCost)) {
						dmp.Diff_EditCost = options.editCost; // eslint-disable-line camelcase
					}

					dmp.diff_cleanupEfficiency(diffs);
					return createHtmlFromDiffs(diffs, displayType.INSDEL, options);
				}

				return '';
			},

			createSemanticDiffHtml(left, right, options) {
				let dmp;
				let diffs;
				if (assertArgumentsIsStrings(left, right)) {
					dmp = new DiffMatchPatch();
					diffs = dmp.diff_main(left, right);
					dmp.diff_cleanupSemantic(diffs);
					return createHtmlFromDiffs(diffs, displayType.INSDEL, options);
				}

				return '';
			},

			createLineDiffHtml(left, right, options) {
				let dmp;
				let chars;
				let diffs;
				if (assertArgumentsIsStrings(left, right)) {
					dmp = new DiffMatchPatch();
					const ignoreTrailingNewLines = angular.isDefined(options) && angular.isDefined(options.ignoreTrailingNewLines) && options.ignoreTrailingNewLines;
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
		const ddo = {
			scope: {
				left: '=leftObj',
				right: '=rightObj',
				options: '=options'
			},
			link(scope, iElement) {
				const listener = function () {
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
		const ddo = {
			scope: {
				left: '=leftObj',
				right: '=rightObj',
				options: '=options'
			},
			link(scope, iElement) {
				const listener = function () {
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
		const ddo = {
			scope: {
				left: '=leftObj',
				right: '=rightObj',
				options: '=options'
			},
			link(scope, iElement) {
				const listener = function () {
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
		const ddo = {
			scope: {
				left: '=leftObj',
				right: '=rightObj',
				options: '=options'
			},
			link(scope, iElement) {
				const listener = function () {
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
