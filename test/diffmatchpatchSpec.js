/// <reference path="../typings/tsd.d.ts" />
describe('diff-match-patch', function() {

	beforeEach(module('diff-match-patch'));

	var oneLineBasicLeft = 'hello world';
	var oneLineBasicRight = 'hello';

	var diffRegex = '<span.*?>hello</span><del.*?> world</del>';
	var lineDiffRegex = '<div class="del.*?">.*?hello world</div><div class="ins.*?">.*?hello</div>';

	describe('directive', function() {
		var $scope;
		var $compile;

		beforeEach(inject(function(_$rootScope_, _$compile_) {
			$scope = _$rootScope_.$new();
			$compile = _$compile_;
		}));

		describe('diff', function() {
			it('no sides returns empty string', function() {
				var element = $compile('<div diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('one side returns empty string', function() {
				$scope.left = oneLineBasicLeft;
				var element = $compile('<div diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('left side is empty string', function() {
				$scope.left = '';
				$scope.right = oneLineBasicLeft;
				var element = $compile('<div diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp('<ins.*?>hello world</ins>'));
			});

			it('single lines return total diff', function() {
				$scope.left = oneLineBasicLeft;
				$scope.right = oneLineBasicRight;
				var element = $compile('<div diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(diffRegex));
			});

			it('two lines returns diff HTML', function() {
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				var element = $compile('<div diff left-obj="left" right-obj="right"></div>')($scope);
				var regex = '<span.*?>hello[\\s\\S]*?</span><del.*?>wo</del><ins.*?>f</ins><span.*?>r</span><del.*?>l</del><ins.*?>ien</ins><span.*?>d</span><ins.*?>s!</ins>';
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});

			it('two lines with options returns diff HTML', function() {
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.options = {
					attrs: {
						'insert': {
							'data-attr': 'insert'
						},
						'delete': {
							'data-attr': 'delete'
						},
						'equal': {
							'data-attr': 'equal'
						}
					}
				};
				var element = $compile('<div diff left-obj="left" right-obj="right" options="options"></div>')($scope);
				var regex = '<span .*?data-attr="equal".*?>hello[\\s\\S]*?<\/span><del .*?data-attr="delete".*?>wo<\/del><ins .*?data-attr="insert".*?>f<\/ins><span .*?data-attr="equal".*?>r<\/span><del .*?data-attr="delete".*?>l<\/del><ins .*?data-attr="insert".*?>ien<\/ins><span .*?data-attr="equal".*?>d<\/span><ins.*?data-attr="insert".*?>s!<\/ins>';
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});
		});

		describe('processingDiff', function() {
			it('no sides returns empty string', function() {
				var element = $compile('<div processing-diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('one side returns empty string', function() {
				$scope.left = oneLineBasicLeft;
				var element = $compile('<div processing-diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('single lines return total diff', function() {
				$scope.left = oneLineBasicLeft;
				$scope.right = oneLineBasicRight;
				var element = $compile('<div processing-diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(diffRegex));
			});

			it('two lines returns diff HTML', function() {
				$scope.left = ['I know the kings of England, and I quote the fights historical,', 'From Marathon to Waterloo, in order categorical.'].join('\n');
				$scope.right = ['I\'m quite adept at funny gags, comedic theory I have read', 'From wicked puns and stupid jokes to anvils that drop on your head.'].join('\n');
				var element = $compile('<div processing-diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				var regex = '<span.*?>I</span><del.*?> know the kings of England, and I quote</del><ins.*?>\'m quite adept at funny gags, comedic</ins><span.*?> the</span><del.*?> fights historical,</del><ins.*?>ory I have read</ins><span.*?>[\\s\\S]*?From </span><del.*?>Marathon</del><ins.*?>wicked puns and stupid jokes</ins><span.*?> to </span><del.*?>Waterloo, in order categorical</del><ins.*?>anvils that drop on your head</ins><span.*?>.</span>';
				expect(element.html()).toMatch(new RegExp(regex));
			});
		});

		describe('semanticDiff', function() {
			it('no sides returns empty string', function() {
				var element = $compile('<div semantic-diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('one side returns empty string', function() {
				$scope.left = oneLineBasicLeft;
				var element = $compile('<div semantic-diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('single lines return total diff', function() {
				$scope.left = oneLineBasicLeft;
				$scope.right = oneLineBasicRight;
				var element = $compile('<div semantic-diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(diffRegex));
			});

			it('two lines returns diff HTML', function() {
				$scope.left = ['I know the kings of England, and I quote the fights historical,', 'From Marathon to Waterloo, in order categorical.'].join('\n');
				$scope.right = ['I\'m quite adept at funny gags, comedic theory I have read', 'From wicked puns and stupid jokes to anvils that drop on your head.'].join('\n');
				var element = $compile('<div semantic-diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				var regex = '<span.*?>I</span><del.*?> know the kings of England, and I quote the fights historical,[\\s\\S]*?From Marathon to Waterloo, in order categorical</del><ins.*?>\'m quite adept at funny gags, comedic theory I have read[\\s\\S]*?From wicked puns and stupid jokes to anvils that drop on your head</ins><span.*?>.</span>';
				expect(element.html()).toMatch(new RegExp(regex));
			});
		});

		describe('lineDiff', function() {
			it('no sides returns empty string', function() {
				var element = $compile('<div line-diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('one side returns empty string', function() {
				$scope.left = oneLineBasicLeft;
				var element = $compile('<div line-diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toBe('');
			});

			it('single lines return total diff', function() {
				$scope.left = oneLineBasicLeft;
				$scope.right = oneLineBasicRight;
				var element = $compile('<div line-diff left-obj="left" right-obj="right"></div>')($scope);
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(lineDiffRegex));
			});

			it('two lines returns diff HTML', function() {
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				var element = $compile('<div line-diff left-obj="left" right-obj="right"></div>')($scope);
				var regex = '<div class="match .*?"><span class="noselect"> </span>hello</div><div class="del .*?"><span class="noselect">-</span>world</div><div class="ins .*?"><span class="noselect">\\+</span>friends!</div>';
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});

			it('two lines empty options returns diff HTML', function() {
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
                $scope.options = {};
				var element = $compile('<div line-diff left-obj="left" right-obj="right" options="options"></div>')($scope);
				var regex = '<div class="match .*?"><span class="noselect"> </span>hello</div><div class="del .*?"><span class="noselect">-</span>world</div><div class="ins .*?"><span class="noselect">\\+</span>friends!</div>';
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));

				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
                $scope.options = {attrs: {}};
				var element = $compile('<div line-diff left-obj="left" right-obj="right" options="options"></div>')($scope);
				var regex = '<div class="match .*?"><span class="noselect"> </span>hello</div><div class="del .*?"><span class="noselect">-</span>world</div><div class="ins .*?"><span class="noselect">\\+</span>friends!</div>';
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});

			it('two lines with options returns diff HTML', function() {
				$scope.left = ['hello', 'world'].join('\n');
				$scope.right = ['hello', 'friends!'].join('\n');
				$scope.options = {
					attrs: {
						'insert': {
							'data-attr': 'insert',
							'class': 'insertion'
						},
						'delete': {
							'data-attr': 'delete'
						},
						'equal': {
							'data-attr': 'equal'
						}
					}
				};
				var element = $compile('<div line-diff left-obj="left" right-obj="right" options="options"></div>')($scope);
				var regex = '<div class="match .*?"><span (?=.*data-attr="equal")(?=.*class="noselect").*> <\/span>hello<\/div><div class="del .*?"><span (?=.*data-attr="delete")(?=.*class="noselect").*>-<\/span>world<\/div><div class="ins .*?"><span (?=.*data-attr="insert")(?=.*class="noselect insertion").*>\\+<\/span>friends!<\/div>';
				$scope.$digest();
				expect(element.html()).toMatch(new RegExp(regex));
			});
		});
	});
});