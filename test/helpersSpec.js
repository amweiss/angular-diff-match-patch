describe('namespace helpers', function() {
	describe('globals checks', function() {
		it('namespace exists', function() {
			expect(NgDmpNamespace).toBeDefined();
		});

		describe('helpers', function() {
			it('object exists', function() {
				expect(NgDmpNamespace.helpers).toBeDefined();
			});

			it('diffClass exists', function() {
				expect(NgDmpNamespace.helpers.diffClass).toBeDefined();
			});

			it('diffSymbol exists', function() {
				expect(NgDmpNamespace.helpers.diffSymbol).toBeDefined();
			});

			it('diffTag exists', function() {
				expect(NgDmpNamespace.helpers.diffTag).toBeDefined();
			});

			it('displayType exists', function() {
				expect(NgDmpNamespace.helpers.displayType).toBeDefined();
			});
		});

		it('constants exist', function() {
			expect(DIFF_EQUAL).toBeDefined();
			expect(DIFF_INSERT).toBeDefined();
			expect(DIFF_DELETE).toBeDefined();
		});
	});

	describe('getHtmlPrefix', function() {
		describe('LINEDIFF', function() {
			beforeEach(function() {
				display = NgDmpNamespace.helpers.displayType.LINEDIFF;
			});

			it('DIFF_EQUAL', function() {
				var op = DIFF_EQUAL;
				var tagClass = NgDmpNamespace.helpers.diffClass(op);
				var diffSymbol = NgDmpNamespace.helpers.diffSymbol(op);
				var result = NgDmpNamespace.helpers.getHtmlPrefix(op, display);
				var regex = '<div class="'+tagClass+'">.*'+diffSymbol;
				expect(result).toMatch(new RegExp(regex));
			});

			it('DIFF_INSERT', function() {
				var op = DIFF_INSERT;
				var tagClass = NgDmpNamespace.helpers.diffClass(op);
				var diffSymbol = NgDmpNamespace.helpers.diffSymbol(op);
				var result = NgDmpNamespace.helpers.getHtmlPrefix(op, display);
				var regex = '<div class="'+tagClass+'">.*'+'\\'+diffSymbol;
				expect(result).toMatch(new RegExp(regex));
			});

			it('DIFF_DELETE', function() {
				var op = DIFF_DELETE;
				var tagClass = NgDmpNamespace.helpers.diffClass(op);
				var diffSymbol = NgDmpNamespace.helpers.diffSymbol(op);
				var result = NgDmpNamespace.helpers.getHtmlPrefix(op, display);
				var regex = '<div class="'+tagClass+'">.*'+diffSymbol;
				expect(result).toMatch(new RegExp(regex));
			});
		});
	});

	describe('getHtmlSuffix', function() {
		describe('LINEDIFF', function() {
			beforeEach(function() {
				display = NgDmpNamespace.helpers.displayType.LINEDIFF;
				regex = '<\/div>';
			});

			it('DIFF_EQUAL', function() {
				var op = DIFF_EQUAL;
				var result = NgDmpNamespace.helpers.getHtmlSuffix(op, display);
				expect(result).toMatch(new RegExp(regex));
			});

			it('DIFF_INSERT', function() {
				var op = DIFF_INSERT;
				var result = NgDmpNamespace.helpers.getHtmlSuffix(op, display);
				expect(result).toMatch(new RegExp(regex));
			});

			it('DIFF_DELETE', function() {
				var op = DIFF_DELETE;
				var result = NgDmpNamespace.helpers.getHtmlSuffix(op, display);
				expect(result).toMatch(new RegExp(regex));
			});
		});
	});

	describe('createHtmlLines works', function() {
		describe('for one line', function() {
			beforeEach(function() {
				text = 'hello world';
			});

			it('DIFF_EQUAL operation', function() {
				var op = DIFF_EQUAL;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);
				var tagClass = NgDmpNamespace.helpers.diffClass(op);
				var regex = '<div class="'+tagClass+'">.*</div>';
				expect(result).toMatch(new RegExp(regex));
			});

			it('DIFF_DELETE operation', function() {
				var op = DIFF_DELETE;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);
				var tagClass = NgDmpNamespace.helpers.diffClass(op);
				var regex = '<div class="'+tagClass+'">.*</div>';
				expect(result).toMatch(new RegExp(regex));
			});

			it('DIFF_INSERT operation', function() {
				var op = DIFF_INSERT;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);
				var tagClass = NgDmpNamespace.helpers.diffClass(op);
				var regex = '<div class="'+tagClass+'">.*</div>';
				expect(result).toMatch(new RegExp(regex));
			});
		});

		describe('for multiple lines', function() {
			it('DIFF_EQUAL operation', function() {
				var text = ['hello world', 'round two'].join('\n');
				var op = DIFF_EQUAL;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);
				var tagClass = NgDmpNamespace.helpers.diffClass(op);
				var regex = '<div class="'+tagClass+'">.*?</div>';
				expect(result.match(new RegExp(regex, "g")).length).toBe(2);
			});

			it('DIFF_DELETE operation', function() {
				var text = ['hello world', 'round two'].join('\n');
				var op = DIFF_DELETE;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);
				var tagClass = NgDmpNamespace.helpers.diffClass(op);
				var regex = '<div class="'+tagClass+'">.*?</div>';
				expect(result.match(new RegExp(regex, "g")).length).toBe(2);
			});

			it('DIFF_INSERT operation', function() {
				var text = ['hello world', 'round two'].join('\n');
				var op = DIFF_INSERT;
				var result = NgDmpNamespace.helpers.createHtmlLines(text, op);
				var tagClass = NgDmpNamespace.helpers.diffClass(op);
				var regex = '<div class="'+tagClass+'">.*?</div>';
				expect(result.match(new RegExp(regex, "g")).length).toBe(2);
			});
		});
	});

	describe('createHtmlFromDiffs works', function() {
		it('INSDEL', function() {
			var data = [[DIFF_EQUAL, 'a'], [DIFF_DELETE, 'b'], [DIFF_INSERT, 'c']];
			var display = NgDmpNamespace.helpers.displayType.INSDEL;
			var result = NgDmpNamespace.helpers.createHtmlFromDiffs(data, display);
			var equalTag = NgDmpNamespace.helpers.diffTag(DIFF_EQUAL);
			var deleteTag = NgDmpNamespace.helpers.diffTag(DIFF_DELETE);
			var insertTag = NgDmpNamespace.helpers.diffTag(DIFF_INSERT);
			var regex = '<'+equalTag+'>a</'+equalTag+'><'+deleteTag+'>b</'+deleteTag+'><'+insertTag+'>c</'+insertTag+'>'
			expect(result).toMatch(new RegExp(regex));
		});
	});
});
