describe('namespace helpers', function() {

	beforeEach(function() {
		module('diff-match-patch');

		inject(function($injector) {
			dmp = $injector.get('dmp');
		});
	});

	describe('createHtmlLines works', function() {
		describe('for one line', function() {
			beforeEach(function() {
				text = 'hello world';
			});

			it('DIFF_EQUAL operation', function() {
				var op = DIFF_EQUAL;
				var result = dmp.createHtmlLines(text, op);
				var regex = '<div class="match">.*</div>';
				expect(result).toMatch(new RegExp(regex));
			});

			it('DIFF_DELETE operation', function() {
				var op = DIFF_DELETE;
				var result = dmp.createHtmlLines(text, op);
				var regex = '<div class="del">.*</div>';
				expect(result).toMatch(new RegExp(regex));
			});

			it('DIFF_INSERT operation', function() {
				var op = DIFF_INSERT;
				var result = dmp.createHtmlLines(text, op);
				var regex = '<div class="ins">.*</div>';
				expect(result).toMatch(new RegExp(regex));
			});
		});

		describe('for multiple lines', function() {
			it('DIFF_EQUAL operation', function() {
				var text = ['hello world', 'round two'].join('\n');
				var op = DIFF_EQUAL;
				var result = dmp.createHtmlLines(text, op);
				var regex = '<div class="match">.*?</div>';
				expect(result.match(new RegExp(regex, "g")).length).toBe(2);
			});

			it('DIFF_DELETE operation', function() {
				var text = ['hello world', 'round two'].join('\n');
				var op = DIFF_DELETE;
				var result = dmp.createHtmlLines(text, op);
				var regex = '<div class="del">.*?</div>';
				expect(result.match(new RegExp(regex, "g")).length).toBe(2);
			});

			it('DIFF_INSERT operation', function() {
				var text = ['hello world', 'round two'].join('\n');
				var op = DIFF_INSERT;
				var result = dmp.createHtmlLines(text, op);
				var regex = '<div class="ins">.*?</div>';
				expect(result.match(new RegExp(regex, "g")).length).toBe(2);
			});
		});
	});
});
