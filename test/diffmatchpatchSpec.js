describe('diffmatchpatch', function() {

	beforeEach(module('diffmatchpatch'));

	describe('filter', function() {
		describe('diff', function() {
			it('exists', inject(function($filter) {
				expect($filter('diff')).not.toBeNull();
			}));

			var diffFilter;
			beforeEach(inject(function($filter) {
				diffFilter = $filter('diff');
			}));

			it('no sides returns empty string', function() {
				expect(diffFilter()).toBe('');
			});

			it('one side returns base', function() {
				var left = 'hello world';
				var result = diffFilter(left);

				expect(result).toMatch(/\<span class="base"\>.*hello world.*\<\/span\>/);
			});

			it('two sides returns diff HTML', function() {
				var left = ['hello', 'world'].join('\n');
				var right = ['hello', 'friends!'].join('\n');
				var result = diffFilter(left, right);

				expect(result).toMatch(/<span class="matching">.*hello.*\<\/span\>[.\s\S]*\<span class="del"\>.*world.*\<\/span\>[.\s\S]*\<span class="ins"\>.*friends!\<\/span\>/);
			});
		});
	});
});
