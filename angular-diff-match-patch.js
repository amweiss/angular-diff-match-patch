var NgDmpNamespace = NgDmpNamespace || {};

NgDmpNamespace.helpers = {
	diffClass: function(op) {
		switch(op) {
			case DIFF_INSERT: return 'ins';
			case DIFF_DELETE: return 'del';
			case DIFF_EQUAL: return 'match';
		}
	},

	diffSymbol: function(op) {
		switch(op) {
			case DIFF_EQUAL: return ' ';
			case DIFF_INSERT: return '+';
			case DIFF_DELETE: return '-';
		}
	},

	diffTag: function(op) {
		switch(op) {
			case DIFF_EQUAL: return 'span';
			case DIFF_INSERT: return 'ins';
			case DIFF_DELETE: return 'del';
		}
	},

	displayType: {
		INSDEL: 0,
		LINEDIFF: 1
	},

	getHtmlPrefix: function(op, display) {
		var retVal = '';
		switch(display) {
			case this.displayType.LINEDIFF:
				retVal = '<div class="'+this.diffClass(op)+'"><span class="noselect">'+this.diffSymbol(op)+'</span>';
				break;
			case this.displayType.INSDEL:
				retVal = '<'+this.diffTag(op)+'>';
				break;
		}
		return retVal;
	},

	getHtmlSuffix: function(op, display) {
		var retVal = '';
		switch(display) {
			case this.displayType.LINEDIFF:
				retVal = '</div>';
				break;
			case this.displayType.INSDEL:
				retVal = '</'+this.diffTag(op)+'>';
				break;
		}
		return retVal;
	},

	createHtmlLines: function(text, op) {
		var lines = text.split('\n');
		for (var y = 0; y < lines.length; y++) {
			if (lines[y].length === 0) continue;
			lines[y] = this.getHtmlPrefix(op, this.displayType.LINEDIFF) + lines[y] + this.getHtmlSuffix(op, this.displayType.LINEDIFF);
		}
		return lines.join('');
	},

	createHtmlFromDiffs: function(diffs, display) {
		var html = [];
		for (var x = 0; x < diffs.length; x++) {
			var op = diffs[x][0];
			var text = diffs[x][1];
			if (display === this.displayType.LINEDIFF) {
				html[x] = this.createHtmlLines(text, op);
			} else {
				html[x] = this.getHtmlPrefix(op, display) + text + this.getHtmlSuffix(op, display);
			}
		}
		return html.join('');
	}
};

angular.module('diff-match-patch', [])
	.filter('diff', function() {
		return function(left, right) {
			if (left && right) {
				var dmp = new diff_match_patch();
				var diffs = dmp.diff_main(left, right);
				return NgDmpNamespace.helpers.createHtmlFromDiffs(diffs, NgDmpNamespace.helpers.displayType.INSDEL);
			} else {
				return '';
			}
		};
	})
	.filter('processingDiff', function() {
		return function(left, right) {
			if (left && right) {
				var dmp = new diff_match_patch();
				var diffs = dmp.diff_main(left, right);
				//dmp.Diff_EditCost = 4;
				dmp.diff_cleanupEfficiency(diffs);
				return NgDmpNamespace.helpers.createHtmlFromDiffs(diffs, NgDmpNamespace.helpers.displayType.INSDEL);
			} else {
				return '';
			}
		};
	})
	.filter('semanticDiff', function() {
		return function(left, right) {
			if (left && right) {
				var dmp = new diff_match_patch();
				var diffs = dmp.diff_main(left, right);
				dmp.diff_cleanupSemantic(diffs);
				return NgDmpNamespace.helpers.createHtmlFromDiffs(diffs, NgDmpNamespace.helpers.displayType.INSDEL);
			} else {
				return '';
			}
		};
	})
	.filter('lineDiff', function() {
		return function(left, right) {
			if (left && right) {
				var dmp = new diff_match_patch();
				var a = dmp.diff_linesToChars_(left, right);
				var diffs = dmp.diff_main(a.chars1, a.chars2, false);
				dmp.diff_charsToLines_(diffs, a.lineArray);
				return NgDmpNamespace.helpers.createHtmlFromDiffs(diffs, NgDmpNamespace.helpers.displayType.LINEDIFF);
			} else {
				return '';
			}
		};
	});
