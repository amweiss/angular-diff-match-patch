/* global inject */
describe('diff-match-patch', function () {
	var oneLineBasicLeft = 'hello world';
	var oneLineBasicRight = 'hello';
	var multiLineLeft = ['I know the kings of England, and I quote the fights historical,',
		'From Marathon to Waterloo, in order categorical.'].join('\n');
	var multiLineRight = ['I\'m quite adept at funny gags, comedic theory I have read',
		'From wicked puns and stupid jokes to anvils that drop on your head.'].join('\n');
	var diffRegex = '<span.*?>hello</span><del.*?> world</del>';
	var oneLineAngularLeft = '{{1 + 2}} hello world';
	var oneLineAngularRight = '{{1 + 2}} hello';
	var angularProcessedDiffRegex = '<span.*?>3 hello</span><del.*?> world</del>';

	beforeEach(module('diff-match-patch'));
	describe('directive', function () {
		var $scope;
		var $compile;

		beforeEach(inject(function (_$rootScope_, _$compile_) {
			$scope = _$rootScope_.$new();
			$compile = _$compile_;
		}));

		describe('diff', function () {
			var diffHtmlNoOptions = '<div diff left-obj="left" right-obj="right"></div>';
			var diffHtmlWithOptions = '<div diff left-obj="left" right-obj="right" options="options"></div>';

			it('compile angular tokens in the diff', function () {
				var element = $compile(diffHtmlNoOptions)($scope);
				$scope.left = '';
				$scope.right = oneLineAngularRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('<ins.*?>3 hello</ins>'));
			});

			it('compile angular tokens in the total diff', function () {
				var element = $compile(diffHtmlNoOptions)($scope);
				$scope.left = oneLineAngularLeft;
				$scope.right = oneLineAngularRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(angularProcessedDiffRegex));
			});

			it('compile angular tokens in the diff if no flag has given in options', function () {
				var element = $compile(diffHtmlWithOptions)($scope);
				$scope.left = '';
				$scope.right = oneLineAngularRight;
				$scope.options = {};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('<ins.*?>3 hello</ins>'));
			});

			it('should not compile angular tokens in the diff if the flag has been set', function () {
				var element = $compile(diffHtmlWithOptions)($scope);
				$scope.left = '';
				$scope.right = oneLineAngularRight;
				$scope.options = {
					skipAngularCompilingOnDiff: true
				};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('<ins.*?>{{1 \\+ 2}} hello</ins>'));
			});

			it('no sides returns empty string', function () {
				var element = $compile(diffHtmlNoOptions)($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('one side returns empty string', function () {
				var element = $compile(diffHtmlNoOptions)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('left side is empty string', function () {
				var element = $compile(diffHtmlNoOptions)($scope);
				$scope.left = '';
				$scope.right = oneLineBasicLeft;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('<ins.*?>hello world</ins>'));
			});

			it('single lines return total diff', function () {
				var element = $compile(diffHtmlNoOptions)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.right = oneLineBasicRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(diffRegex));
			});

			it('two lines returns diff HTML', function () {
				var element = $compile(diffHtmlNoOptions)($scope);
				var regex = '<span.*?>hello[\\s\\S]*?</span><del.*?>wo</del><ins.*?>f</ins><span.*?>r</span><del.*?>l</del><ins.*?>ien</ins><span.*?>d</span><ins.*?>s!</ins>';
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});

			it('two lines with options returns diff HTML', function () {
				var element = $compile(diffHtmlWithOptions)($scope);
				var regex = '<span .*?data-attr="equal".*?>hello[\\s\\S]*?</span><del .*?data-attr="delete".*?>wo</del><ins .*?data-attr="insert".*?>f</ins><span .*?data-attr="equal".*?>r</span><del .*?data-attr="delete".*?>l</del><ins .*?data-attr="insert".*?>ien</ins><span .*?data-attr="equal".*?>d</span><ins.*?data-attr="insert".*?>s!</ins>';
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.options = {
					attrs: {
						insert: {
							'data-attr': 'insert'
						},
						delete: {
							'data-attr': 'delete'
						},
						equal: {
							'data-attr': 'equal'
						}
					}
				};

				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});
		});

		describe('processingDiff', function () {
			var processingDiffHtml = '<div processing-diff left-obj="left" right-obj="right"></div>';
			var processingDiffOptionsHtml = '<div processing-diff left-obj="left" right-obj="right" options="options"></div>';
			var twoLineRegex = '<span.*?>I</span><del.*?> know the kings of England, and I quote</del><ins.*?>\'m quite adept at funny gags, comedic</ins><span.*?> the</span><del.*?> fights historical,</del><ins.*?>ory I have read</ins><span.*?>[\\s\\S]*?From </span><del.*?>Marathon</del><ins.*?>wicked puns and stupid jokes</ins><span.*?> to </span><del.*?>Waterloo, in order categorical</del><ins.*?>anvils that drop on your head</ins><span.*?>.</span>';

			it('compile angular tokens in the diff', function () {
				var element = $compile(processingDiffHtml)($scope);
				$scope.left = '';
				$scope.right = oneLineAngularRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('<ins.*?>3 hello</ins>'));
			});

			it('compile angular tokens in the total diff', function () {
				var element = $compile(processingDiffHtml)($scope);
				$scope.left = oneLineAngularLeft;
				$scope.right = oneLineAngularRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(angularProcessedDiffRegex));
			});

			it('compile angular tokens in the diff if no flag has given in options', function () {
				var element = $compile(processingDiffOptionsHtml)($scope);
				$scope.left = '';
				$scope.right = oneLineAngularRight;
				$scope.options = {};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('<ins.*?>3 hello</ins>'));
			});

			it('should not compile angular tokens in the diff if the flag has been set', function () {
				var element = $compile(processingDiffOptionsHtml)($scope);
				$scope.left = '';
				$scope.right = oneLineAngularRight;
				$scope.options = {
					skipAngularCompilingOnDiff: true
				};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('<ins.*?>{{1 \\+ 2}} hello</ins>'));
			});

			it('no sides returns empty string', function () {
				var element = $compile(processingDiffHtml)($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('one side returns empty string', function () {
				var element = $compile(processingDiffHtml)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('single lines return total diff', function () {
				var element = $compile(processingDiffHtml)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.right = oneLineBasicRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(diffRegex));
			});

			it('two lines returns diff HTML', function () {
				var element = $compile(processingDiffHtml)($scope);
				$scope.left = multiLineLeft;
				$scope.right = multiLineRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(twoLineRegex));
			});

			it('two lines with editCost option returns diff HTML', function () {
				var element = $compile(processingDiffOptionsHtml)($scope);
				var regex = '<span.*?>I</span><del.*?> know the kings of England, and I quote the fights historical,</del><ins.*?>\'m quite adept at funny gags, comedic theory I have read</ins><span.*?>[\\s\\S]*?From </span><del.*?>Marathon to Waterloo, in order categorical</del><ins.*?>wicked puns and stupid jokes to anvils that drop on your head</ins><span.*?>.</span>';
				$scope.left = multiLineLeft;
				$scope.right = multiLineRight;
				$scope.options = {
					editCost: 5
				};

				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
				expect(element.html()).not.toMatch(new RegExp(twoLineRegex));
			});
		});

		describe('semanticDiff', function () {
			var semanticDiffHtml = '<div semantic-diff left-obj="left" right-obj="right"></div>';
			var semanticDiffHtmlWithOptions = '<div semantic-diff left-obj="left" right-obj="right" options="options"></div>';

			it('compile angular tokens in the diff', function () {
				var element = $compile(semanticDiffHtml)($scope);
				$scope.left = '';
				$scope.right = oneLineAngularRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('<ins.*?>3 hello</ins>'));
			});

			it('compile angular tokens in the total diff', function () {
				var element = $compile(semanticDiffHtml)($scope);
				$scope.left = oneLineAngularLeft;
				$scope.right = oneLineAngularRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(angularProcessedDiffRegex));
			});

			it('compile angular tokens in the diff if no flag has given in options', function () {
				var element = $compile(semanticDiffHtmlWithOptions)($scope);
				$scope.left = '';
				$scope.right = oneLineAngularRight;
				$scope.options = {};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('<ins.*?>3 hello</ins>'));
			});

			it('should not compile angular tokens in the diff if the flag has been set', function () {
				var element = $compile(semanticDiffHtmlWithOptions)($scope);
				$scope.left = '';
				$scope.right = oneLineAngularRight;
				$scope.options = {
					skipAngularCompilingOnDiff: true
				};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('<ins.*?>{{1 \\+ 2}} hello</ins>'));
			});

			it('no sides returns empty string', function () {
				var element = $compile(semanticDiffHtml)($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('one side returns empty string', function () {
				var element = $compile(semanticDiffHtml)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('single lines return total diff', function () {
				var element = $compile(semanticDiffHtml)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.right = oneLineBasicRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(diffRegex));
			});

			it('two lines returns diff HTML', function () {
				var element = $compile(semanticDiffHtml)($scope);
				var regex = '<span.*?>I</span><del.*?> know the kings of England, and I quote the fights historical,[\\s\\S]*?From Marathon to Waterloo, in order categorical</del><ins.*?>\'m quite adept at funny gags, comedic theory I have read[\\s\\S]*?From wicked puns and stupid jokes to anvils that drop on your head</ins><span.*?>.</span>';
				$scope.left = multiLineLeft;
				$scope.right = multiLineRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});
		});

		describe('lineDiff', function () {
			var lineDiffHtml = '<div line-diff left-obj="left" right-obj="right"></div>';
			var lineDiffOptionHtml = '<div line-diff left-obj="left" right-obj="right" options="options"></div>';
			var twoLineRegex = '<div class="match .*?"><span class="noselect"> </span>hello</div><div class="del .*?"><span class="noselect">-</span>world</div><div class="ins .*?"><span class="noselect">\\+</span>friends!</div>';

			it('compile angular tokens in the diff', function () {
				var element = $compile(lineDiffHtml)($scope);
				$scope.left = '';
				$scope.right = oneLineAngularRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('.*?ins.*?</span>3 hello</div>'));
			});

			it('compile angular tokens in the total diff', function () {
				var element = $compile(lineDiffHtml)($scope);
				$scope.left = oneLineAngularLeft;
				$scope.right = oneLineAngularRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('.*?-</span>3 hello world.*?\\+</span>3 hello.*?'));
			});

			it('compile angular tokens in the diff if no flag has given in options', function () {
				var element = $compile(lineDiffOptionHtml)($scope);
				$scope.left = oneLineAngularLeft;
				$scope.right = oneLineAngularRight;
				$scope.options = {};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('.*?-</span>3 hello world.*?\\+</span>3 hello.*?'));
			});

			it('should not compile angular tokens in the diff if the flag has been set', function () {
				var element = $compile(lineDiffOptionHtml)($scope);
				$scope.left = oneLineAngularLeft;
				$scope.right = oneLineAngularRight;
				$scope.options = {
					skipAngularCompilingOnDiff: true
				};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('.*?-</span>{{1 \\+ 2}} hello world.*?\\+</span>{{1 \\+ 2}} hello.*?'));
			});

			it('no sides returns empty string', function () {
				var element = $compile(lineDiffHtml)($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('one side returns empty string', function () {
				var element = $compile(lineDiffHtml)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('single lines return total diff', function () {
				var element = $compile(lineDiffHtml)($scope);
				var regex = '<div class="del.*?">.*?hello world</div><div class="ins.*?">.*?hello</div>';
				$scope.left = oneLineBasicLeft;
				$scope.right = oneLineBasicRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});

			it('two lines returns diff HTML', function () {
				var element = $compile(lineDiffHtml)($scope);
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(twoLineRegex));
			});

			it('two lines empty options returns diff HTML', function () {
				var element = $compile(lineDiffOptionHtml)($scope);
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.options = {};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(twoLineRegex));
			});

			it('two lines empty options attrs returns diff HTML', function () {
				var element = $compile(lineDiffOptionHtml)($scope);
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.options = {attrs: {}};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(twoLineRegex));
			});

			it('two lines with options returns diff HTML', function () {
				var element = $compile(lineDiffOptionHtml)($scope);
				var regex = '<div class="match .*?"><span (?=.*data-attr="equal")(?=.*class="noselect").*> </span>hello</div><div class="del .*?"><span (?=.*data-attr="delete")(?=.*class="noselect").*>-</span>world</div><div class="ins .*?"><span (?=.*data-attr="insert")(?=.*class="noselect").*>\\+</span>friends!</div>';
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.options = {
					attrs: {
						insert: {
							'data-attr': 'insert',
							class: 'insertion'
						},
						delete: {
							'data-attr': 'delete'
						},
						equal: {
							'data-attr': 'equal'
						}
					}
				};

				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});

			it('two lines interLineDiff options returns diff HTML', function () {
				var element = $compile(lineDiffOptionHtml)($scope);
				var regex = '<div class="match .*?"><span class="noselect"> </span>hello</div><div class="del .*?"><span class="noselect">-</span><del>world</del></div><div class="ins .*?"><span class="noselect">\\+</span><ins>friends!</ins></div>';
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.options = {
					interLineDiff: true
				};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});
		});
	});
});
