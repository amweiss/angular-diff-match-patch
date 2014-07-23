describe('namespace helpers', function() {
	describe('globals checks', function() {
		it('namespace exists', function() {
			expect(NgDmpNamespace).toBeDefined();
		});

		it('helpers exist', function() {
			expect(NgDmpNamespace.helpers).toBeDefined();
		});

		it('constants exist', function() {
			expect(DIFF_BASE).toBeDefined();
			expect(DIFF_EQUAL).toBeDefined();
			expect(DIFF_DELETE).toBeDefined();
			expect(DIFF_INSERT).toBeDefined();
		});
	});

	describe('createHtmlLines works', function() {
		describe('for one line', function() {
			it('DIFF_BASE operation', function() {
				var text = 'hello world';
				var op = DIFF_BASE;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);

				expect(result).toMatch(/\<span class="base"\>.*\<\/span\>/);
			});

			it('DIFF_EQUAL operation', function() {
				var text = 'hello world';
				var op = DIFF_EQUAL;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);

				expect(result).toMatch(/\<span class="matching"\>.*\<\/span\>/);
			});

			it('DIFF_DELETE operation', function() {
				var text = 'hello world';
				var op = DIFF_DELETE;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);

				expect(result).toMatch(/\<span class="del"\>.*\<\/span\>/);
			});

			it('DIFF_INSERT operation', function() {
				var text = 'hello world';
				var op = DIFF_INSERT;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);

				expect(result).toMatch(/\<span class="ins"\>.*\<\/span\>/);
			});
		});

		describe('for multiple lines', function() {
			it('DIFF_BASE operation', function() {
				var text = ['hello world', 'round two'].join('\n');
				var op = DIFF_BASE;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);

				var split = result.split('\n');
				expect(split.length).toBe(2);
				expect(split[0]).toMatch(/\<span class="base"\>.*\<\/span\>/);
				expect(split[1]).toMatch(/\<span class="base"\>.*\<\/span\>/);
			});

			it('DIFF_EQUAL operation', function() {
				var text = ['hello world', 'round two'].join('\n');
				var op = DIFF_EQUAL;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);

				var split = result.split('\n');
				expect(split.length).toBe(2);
				expect(split[0]).toMatch(/\<span class="matching"\>.*\<\/span\>/);
				expect(split[1]).toMatch(/\<span class="matching"\>.*\<\/span\>/);
			});

			it('DIFF_DELETE operation', function() {
				var text = ['hello world', 'round two'].join('\n');
				var op = DIFF_DELETE;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);

				var split = result.split('\n');
				expect(split.length).toBe(2);
				expect(split[0]).toMatch(/\<span class="del"\>.*\<\/span\>/);
				expect(split[1]).toMatch(/\<span class="del"\>.*\<\/span\>/);
			});

			it('DIFF_INSERT operation', function() {
				var text = ['hello world', 'round two'].join('\n');
				var op = DIFF_INSERT;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);

				var split = result.split('\n');
				expect(split.length).toBe(2);
				expect(split[0]).toMatch(/\<span class="ins"\>.*\<\/span\>/);
				expect(split[1]).toMatch(/\<span class="ins"\>.*\<\/span\>/);
			});
		});
	});

	describe('createHtmlFromDiffs works', function() {
		var data = [[DIFF_BASE, 'x'], [DIFF_EQUAL, 'a'], [DIFF_DELETE, 'b'], [DIFF_INSERT, 'c']];
		var result = NgDmpNamespace.helpers.createHtmlFromDiffs(data);

		expect(result).toMatch(/\<span class="base"\>.*\<\/span\>\<span class="matching"\>.*\<\/span\>\<span class="del"\>.*\<\/span\>\<span class="ins"\>.*\<\/span\>/);
	});
});
