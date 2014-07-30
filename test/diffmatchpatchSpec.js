describe('diff-match-patch', function() {

	beforeEach(module('diff-match-patch'));

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
				var left = 'hello world';
				var result = diffFilter(left);
				expect(result).toBe('');
			});

			it('single lines return total diff', function() {
				var left = 'hello world';
				var right = 'hello';
				var result = diffFilter(left, right);
				var regex = '<span>hello</span><del> world</del>'
				expect(result).toMatch(new RegExp(regex));
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
				var left = 'hello world';
				var result = diffFilter(left);
				expect(result).toBe('');
			});

			it('single lines return total diff', function() {
				var left = 'hello world';
				var right = 'hello';
				var result = diffFilter(left, right);
				var regex = '<span>hello</span><del> world</del>'
				expect(result).toMatch(new RegExp(regex));
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
				var left = 'hello world';
				var result = diffFilter(left);

				expect(result).toBe('');
			});

			it('single lines return total diff', function() {
				var left = 'hello world';
				var right = 'hello';
				var result = diffFilter(left, right);
				var regex = '<span>hello</span><del> world</del>'
				expect(result).toMatch(new RegExp(regex));
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
				var left = 'hello world';
				var result = diffFilter(left);
				expect(result).toBe('');
			});

			it('single lines return total diff', function() {
				var left = 'hello world';
				var right = 'hello';
				var result = diffFilter(left, right);
				var regex = '<div class="del">.*?hello world</div><div class="ins">.*?hello</div>'
				expect(result).toMatch(new RegExp(regex));
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
});
