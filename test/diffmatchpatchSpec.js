describe('diff-match-patch', function() {

	beforeEach(module('diff-match-patch'));

	var oneLineBasicLeft = 'hello world';
	var oneLineBasicRight = 'hello';

	var diffRegex = '<span.*?>hello</span><del.*?> world</del>';
	var lineDiffRegex = '<div class="del.*?">.*?hello world</div><div class="ins.*?">.*?hello</div>';

	describe('filter', function() {
		describe('diff', function() {
			it('exists', inject(function($filter) {
				expect($filter('diff')).not.toBeNull();
			}));

			beforeEach(inject(function($filter) {
				diffFilter = $filter('diff');
			}));

			it('no sides returns empty string', function() {
				expect(diffFilter()).toBe('');
			});

			it('one side returns empty string', function() {
				var result = diffFilter(oneLineBasicLeft);
				expect(result).toBe('');
			});

			it('single lines return total diff', function() {
				var result = diffFilter(oneLineBasicLeft, oneLineBasicRight);
				expect(result).toMatch(new RegExp(diffRegex));
			});

			it('two lines returns diff HTML', function() {
				var left = ['hello', 'world'].join('\n');
				var right = ['hello', 'friends!'].join('\n');
				var result = diffFilter(left, right);
				var regex = '<span>hello[\\s\\S]*?</span><del>wo</del><ins>f</ins><span>r</span><del>l</del><ins>ien</ins><span>d</span><ins>s!</ins>';
				expect(result).toMatch(new RegExp(regex));
			});
		});

		describe('processingDiff', function() {
			it('exists', inject(function($filter) {
				expect($filter('processingDiff')).not.toBeNull();
			}));

			beforeEach(inject(function($filter) {
				diffFilter = $filter('processingDiff');
			}));

			it('no sides returns empty string', function() {
				expect(diffFilter()).toBe('');
			});

			it('one side returns empty string', function() {
				var result = diffFilter(oneLineBasicLeft);
				expect(result).toBe('');
			});

			it('single lines return total diff', function() {
				var result = diffFilter(oneLineBasicLeft, oneLineBasicRight);
				expect(result).toMatch(new RegExp(diffRegex));
			});

			it('two lines returns diff HTML', function() {
				var left = ['I know the kings of England, and I quote the fights historical,', 'From Marathon to Waterloo, in order categorical.'].join('\n');
				var right = ['I\'m quite adept at funny gags, comedic theory I have read', 'From wicked puns and stupid jokes to anvils that drop on your head.'].join('\n');
				var result = diffFilter(left, right);
				var regex = '<span>I</span><del> know the kings of England, and I quote</del><ins>\'m quite adept at funny gags, comedic</ins><span> the</span><del> fights historical,</del><ins>ory I have read</ins><span>[\\s\\S]*?From </span><del>Marathon</del><ins>wicked puns and stupid jokes</ins><span> to </span><del>Waterloo, in order categorical</del><ins>anvils that drop on your head</ins><span>.</span>';
				expect(result).toMatch(new RegExp(regex));
			});
		});

		describe('semanticDiff', function() {
			it('exists', inject(function($filter) {
				expect($filter('semanticDiff')).not.toBeNull();
			}));

			beforeEach(inject(function($filter) {
				diffFilter = $filter('semanticDiff');
			}));

			it('no sides returns empty string', function() {
				expect(diffFilter()).toBe('');
			});

			it('one side returns empty string', function() {
				var result = diffFilter(oneLineBasicLeft);
				expect(result).toBe('');
			});

			it('single lines return total diff', function() {
				var result = diffFilter(oneLineBasicLeft, oneLineBasicRight);
				expect(result).toMatch(new RegExp(diffRegex));
			});

			it('two lines returns diff HTML', function() {
				var left = ['I know the kings of England, and I quote the fights historical,', 'From Marathon to Waterloo, in order categorical.'].join('\n');
				var right = ['I\'m quite adept at funny gags, comedic theory I have read', 'From wicked puns and stupid jokes to anvils that drop on your head.'].join('\n');
				var result = diffFilter(left, right);
				var regex = '<span>I</span><del> know the kings of England, and I quote the fights historical,[\\s\\S]*?From Marathon to Waterloo, in order categorical</del><ins>\'m quite adept at funny gags, comedic theory I have read[\\s\\S]*?From wicked puns and stupid jokes to anvils that drop on your head</ins><span>.</span>';
				expect(result).toMatch(new RegExp(regex));
			});
		});

		describe('lineDiff', function() {
			it('exists', inject(function($filter) {
				expect($filter('lineDiff')).not.toBeNull();
			}));

			beforeEach(inject(function($filter) {
				diffFilter = $filter('lineDiff');
			}));

			it('no sides returns empty string', function() {
				expect(diffFilter()).toBe('');
			});

			it('one side returns empty string', function() {
				var result = diffFilter(oneLineBasicLeft);
				expect(result).toBe('');
			});

			it('single lines return total diff', function() {
				var result = diffFilter(oneLineBasicLeft, oneLineBasicRight);
				expect(result).toMatch(new RegExp(lineDiffRegex));
			});

			it('two lines returns diff HTML', function() {
				var left = ['hello', 'world'].join('\n');
				var right = ['hello', 'friends!'].join('\n');
				var result = diffFilter(left, right);
				var regex = '<div class="match">.*?hello</div><div class="del">.*?world</div><div class="ins">.*?friends!</div>';
				expect(result).toMatch(new RegExp(regex));
			});
		});
	});

	//cop out on directive testing since it's shared code and covered by the filter tests currently.
	describe('directive', function() {
		var $scope;
		var $compile;

		beforeEach(inject(function(_$rootScope_, _$compile_) {
			$scope = _$rootScope_.$new();
			$compile = _$compile_;
		}));

		it('diff', function() {
			$scope.left = oneLineBasicLeft;
			$scope.right = oneLineBasicRight;
			var element = $compile('<div diff left-obj="left" right-obj="right"></div>')($scope);
			$scope.$digest();
			expect(element.html()).toMatch(new RegExp(diffRegex));
		});

		it('processingDiff', function() {
			$scope.left = oneLineBasicLeft;
			$scope.right = oneLineBasicRight;
			var element = $compile('<div processing-diff left-obj="left" right-obj="right"></div>')($scope);
			$scope.$digest();
			expect(element.html()).toMatch(new RegExp(diffRegex));
		});

		it('semanticDiff', function() {
			$scope.left = oneLineBasicLeft;
			$scope.right = oneLineBasicRight;
			var element = $compile('<div semantic-diff left-obj="left" right-obj="right"></div>')($scope);
			$scope.$digest();
			expect(element.html()).toMatch(new RegExp(diffRegex));
		});

		it('lineDiff', function() {
			$scope.left = oneLineBasicLeft;
			$scope.right = oneLineBasicRight;
			var element = $compile('<div line-diff left-obj="left" right-obj="right"></div>')($scope);
			$scope.$digest();
			expect(element.html()).toMatch(new RegExp(lineDiffRegex));
		});
	});
});
