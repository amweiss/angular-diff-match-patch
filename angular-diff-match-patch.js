var NgDmpNamespace = NgDmpNamespace || {};

var DIFF_BASE = 100;

NgDmpNamespace.helpers = {
	createHtmlLines: function(text, op) {
		var lines = text.split('\n');
		for (var y = 0; y < lines.length; y++) {
			if (lines[y].length === 0) continue;
			switch (op) {
				case DIFF_INSERT:
					lines[y] = '<span class="ins"><span class="noselect">+</span>' + lines[y] + '</span>';
					break;
				case DIFF_DELETE:
					lines[y] = '<span class="del"><span class="noselect">-</span>' + lines[y] + '</span>';
					break;
				case DIFF_EQUAL:
					lines[y] = '<span class="matching"><span class="noselect"> </span>' + lines[y] + '</span>';
					break;
				case DIFF_BASE:
					lines[y] = '<span class="base"><span class="noselect"> </span>' + lines[y] + '</span>';
					break;
			}
		}
		return lines.join('\n');
	},

	createHtmlFromDiffs: function(diffs) {
		var html = [];
		for (var x = 0; x < diffs.length; x++) {
			var op = diffs[x][0];
			var text = diffs[x][1];
			html[x] = NgDmpNamespace.helpers.createHtmlLines(text, op);
		}
		return html.join('');
	}
};

angular.module('diff-match-patch', [])
	.filter('linediff', function() {
		return function(left, right) {
			if (left && right) {
				var dmp = new diff_match_patch();
				var a = dmp.diff_linesToChars_(left, right);
				var diffs = dmp.diff_main(a.chars1, a.chars2, false);
				dmp.diff_charsToLines_(diffs, a.lineArray);
				dmp.diff_cleanupSemantic(diffs);
				return NgDmpNamespace.helpers.createHtmlFromDiffs(diffs);
			} else if (left) {
				return NgDmpNamespace.helpers.createHtmlLines(left, DIFF_BASE);
			} else {
				return '';
			}
		};
	});
