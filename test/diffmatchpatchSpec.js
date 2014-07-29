describe('diff-match-patch', function() {

	beforeEach(module('diff-match-patch'));

	describe('filter', function() {
		describe('lineDiff', function() {
			it('exists', inject(function($filter) {
				expect($filter('lineDiff')).not.toBeNull();
			}));

			var lineDiffFilter;
			beforeEach(inject(function($filter) {
				lineDiffFilter = $filter('lineDiff');
			}));

			it('no sides returns empty string', function() {
				expect(lineDiffFilter()).toBe('');
			});

			it('one side returns base', function() {
				var left = 'hello world';
				var result = lineDiffFilter(left);

				expect(result).toMatch(/\<span class="base"\>.*hello world.*\<\/span\>/);
			});

			it('two sides returns diff HTML', function() {
				var left = ['hello', 'world'].join('\n');
				var right = ['hello', 'friends!'].join('\n');
				var result = lineDiffFilter(left, right);

				expect(result).toMatch(/<span class="matching">.*hello.*\<\/span\>[.\s\S]*\<span class="del"\>.*world.*\<\/span\>[.\s\S]*\<span class="ins"\>.*friends!\<\/span\>/);
			});
		});
	});
});
