/* global inject */
describe('diff-match-patch', function diffMatchPatchDescription() {
	var oneLineBasicLeft = 'hello world';
	var oneLineBasicRight = 'hello';
	var diffRegex = '<span.*?>hello</span><del.*?> world</del>';

	beforeEach(module('diff-match-patch'));
	describe('directive', function directiveDescription() {
		var $scope;
		var $compile;

		beforeEach(inject(function injectScope(_$rootScope_, _$compile_) {
			$scope = _$rootScope_.$new();
			$compile = _$compile_;
		}));

		describe('diff', function diffDescription() {
			var diffHtmlNoOptions = '<div diff left-obj="left" right-obj="right"></div>';

			it('no sides returns empty string', function noSidesEmpty() {
				var element = $compile(diffHtmlNoOptions)($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('one side returns empty string', function oneSideEmpty() {
				var element = $compile(diffHtmlNoOptions)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('left side is empty string', function leftSideEmpty() {
				var element = $compile(diffHtmlNoOptions)($scope);
				$scope.left = '';
				$scope.right = oneLineBasicLeft;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('<ins.*?>hello world</ins>'));
			});

			it('single lines return total diff', function singleLineTotal() {
				var element = $compile(diffHtmlNoOptions)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.right = oneLineBasicRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(diffRegex));
			});

			it('two lines returns diff HTML', function twoLineDiff() {
				var element = $compile(diffHtmlNoOptions)($scope);
				var regex = '<span.*?>hello[\\s\\S]*?</span><del.*?>wo</del><ins.*?>f</ins>' +
					'<span.*?>r</span><del.*?>l</del><ins.*?>ien</ins><span.*?>d</span>' +
					'<ins.*?>s!</ins>';
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});

			it('two lines with options returns diff HTML', function twoLineOptionDiff() {
				var html = '<div diff left-obj="left" right-obj="right" options="options"></div>';
				var element = $compile(html)($scope);
				var regex = '<span .*?data-attr="equal".*?>hello[\\s\\S]*?<\/span>' +
					'<del .*?data-attr="delete".*?>wo<\/del>' +
					'<ins .*?data-attr="insert".*?>f<\/ins>' +
					'<span .*?data-attr="equal".*?>r<\/span>' +
					'<del .*?data-attr="delete".*?>l<\/del>' +
					'<ins .*?data-attr="insert".*?>ien<\/ins>' +
					'<span .*?data-attr="equal".*?>d<\/span>' +
					'<ins.*?data-attr="insert".*?>s!<\/ins>';
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

		describe('processingDiff', function processingDiffDescription() {
			var processingDiffHtml = '<div processing-diff left-obj="left" right-obj="right"></div>';
			it('no sides returns empty string', function noSidesEmpty() {
				var element = $compile(processingDiffHtml)($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('one side returns empty string', function oneSideEmpty() {
				var element = $compile(processingDiffHtml)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('single lines return total diff', function singleLineTotal() {
				var element = $compile(processingDiffHtml)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.right = oneLineBasicRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(diffRegex));
			});

			it('two lines returns diff HTML', function twoLineDiff() {
				var element = $compile(processingDiffHtml)($scope);
				var regex = '<span.*?>I</span><del.*?> know the kings of England, and I quote</del>' +
					'<ins.*?>\'m quite adept at funny gags, comedic</ins><span.*?> the</span>' +
					'<del.*?> fights historical,</del><ins.*?>ory I have read</ins>' +
					'<span.*?>[\\s\\S]*?From </span><del.*?>Marathon</del>' +
					'<ins.*?>wicked puns and stupid jokes</ins><span.*?> to </span>' +
					'<del.*?>Waterloo, in order categorical</del>' +
					'<ins.*?>anvils that drop on your head</ins><span.*?>.</span>';
				$scope.left = ['I know the kings of England, and I quote the fights historical,',
					'From Marathon to Waterloo, in order categorical.'].join('\n');
				$scope.right = ['I\'m quite adept at funny gags, comedic theory I have read',
					'From wicked puns and stupid jokes to anvils that drop on your head.'].join('\n');
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});
		});

		describe('semanticDiff', function semanticDiffDescription() {
			var semanticDiffHtml = '<div semantic-diff left-obj="left" right-obj="right"></div>';
			it('no sides returns empty string', function noSidesEmpty() {
				var element = $compile(semanticDiffHtml)($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('one side returns empty string', function oneSideEmpty() {
				var element = $compile(semanticDiffHtml)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('single lines return total diff', function singleLineTotal() {
				var element = $compile(semanticDiffHtml)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.right = oneLineBasicRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(diffRegex));
			});

			it('two lines returns diff HTML', function twoLineDiff() {
				var element = $compile(semanticDiffHtml)($scope);
				var regex = '<span.*?>I</span><del.*?> know the kings of England, and I quote the ' +
					'fights historical,[\\s\\S]*?From Marathon to Waterloo, in order categorical</del>' +
					'<ins.*?>\'m quite adept at funny gags, comedic theory I have read[\\s\\S]*?' +
					'From wicked puns and stupid jokes to anvils that drop on your head</ins>' +
					'<span.*?>.</span>';
				$scope.left = ['I know the kings of England, and I quote the fights historical,',
					'From Marathon to Waterloo, in order categorical.'].join('\n');
				$scope.right = ['I\'m quite adept at funny gags, comedic theory I have read',
					'From wicked puns and stupid jokes to anvils that drop on your head.'].join('\n');
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});
		});

		describe('lineDiff', function lineDiffDescription() {
			var lineDiffHtml = '<div line-diff left-obj="left" right-obj="right"></div>';
			var lineDiffOptionHtml =
				'<div line-diff left-obj="left" right-obj="right" options="options"></div>';
			var twoLineRegex = '<div class="match .*?"><span class="noselect"> </span>hello</div>' +
					'<div class="del .*?"><span class="noselect">-</span>world</div>' +
					'<div class="ins .*?"><span class="noselect">\\+</span>friends!</div>';

			it('no sides returns empty string', function noSidesEmpty() {
				var element = $compile(lineDiffHtml)($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('one side returns empty string', function oneSideEmpty() {
				var element = $compile(lineDiffHtml)($scope);
				$scope.left = oneLineBasicLeft;
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('single lines return total diff', function singleLineTotal() {
				var element = $compile(lineDiffHtml)($scope);
				var regex = '<div class="del.*?">.*?hello world</div><div class="ins.*?">.*?hello</div>';
				$scope.left = oneLineBasicLeft;
				$scope.right = oneLineBasicRight;
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});

			it('two lines returns diff HTML', function twoLineDiff() {
				var element = $compile(lineDiffHtml)($scope);
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(twoLineRegex));
			});

			it('two lines empty options returns diff HTML', function twoLineEmptyOptionDiff() {
				var element = $compile(lineDiffOptionHtml)($scope);
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.options = {};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(twoLineRegex));
			});

			it('two lines empty options attrs returns diff HTML', function twoLineEmptyOptionAttrsDiff() {
				var element = $compile(lineDiffOptionHtml)($scope);
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.options = {attrs: {}};
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(twoLineRegex));
			});

			it('two lines with options returns diff HTML', function twoLineOptionDiff() {
				var element = $compile(lineDiffOptionHtml)($scope);
				var regex =
					'<div class="match .*?"><span (?=.*data-attr="equal")(?=.*class="noselect").*> <\/span>' +
					'hello<\/div><div class="del .*?">' +
					'<span (?=.*data-attr="delete")(?=.*class="noselect").*>-<\/span>world<\/div>' +
					'<div class="ins .*?">' +
					'<span (?=.*data-attr="insert")(?=.*class="noselect insertion").*>\\+<\/span>' +
					'friends!<\/div>';
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.options = {
					attrs: {
						insert: {
							'data-attr': 'insert',
							'class': 'insertion'
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
	});
});
