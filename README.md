angular-diff-match-patch
========================
[![Circle CI](https://circleci.com/gh/amweiss/angular-diff-match-patch.svg?style=svg)](https://circleci.com/gh/amweiss/angular-diff-match-patch) [![Coverage Status](https://coveralls.io/repos/github/amweiss/angular-diff-match-patch/badge.svg?branch=master)](https://coveralls.io/github/amweiss/angular-diff-match-patch?branch=master)

[![Dependencies](https://david-dm.org/amweiss/angular-diff-match-patch.svg)](https://david-dm.org/amweiss/angular-diff-match-patch/#info=dependencies&view=table) [![DevDependencies](https://david-dm.org/amweiss/angular-diff-match-patch/dev-status.svg)](https://david-dm.org/amweiss/angular-diff-match-patch/#info=devDependencies&view=table) [![PeerDependencies](https://david-dm.org/amweiss/angular-diff-match-patch/peer-status.svg)](https://david-dm.org/amweiss/angular-diff-match-patch/#info=peerDependencies&view=table)

This library is simply a wrapper around [google-diff-match-patch](https://code.google.com/p/google-diff-match-patch/).

<iframe height='1493' scrolling='no' src='//codepen.io/amweiss/embed/grXNPm/?height=1493&theme-id=0&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/amweiss/pen/grXNPm/'>angular-diff-match-patch</a> by Adam Weiss (<a href='http://codepen.io/amweiss'>@amweiss</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

(Shown here with some custom styles)

Setup
-----

Install from [NPM](http://npmjs.com)

`npm install amweiss/angular-diff-match-patch`

Install from [Bower](http://bower.io/)

`bower install angular-diff-match-patch`

Usage
-----

See [the included demo](http://amweiss.github.io/angular-diff-match-patch/) for reference or view a sample on [Codepen](http://codepen.io/amweiss/pen/grXNPm).

```html
<pre line-diff left-obj="left" right-obj="right"></pre>
```

Where `left` and `right` are defined on your scope.  The `options` attribute can be used as well, but it's optional.

```javascript
$scope.options = {
  editCost: 4,
  attrs: {
    insert: {
      'data-attr': 'insert',
      'class': 'insertion'
    },
    delete: {
      'data-attr': 'delete'
    },
    equal: {
      'data-attr': 'equal'
    }
  }
};
```

`editCost` is specific to `processingDiff` and controls the tolerence for hunk separation.  `attrs` can contain any/all/none of the following: `insert`, `delete`, and `equal` where the properties in those objects represent attributes that get added to the tags.

Add some style
```css
.match{
  color: gray;
}

.ins{
  color: black;
  background: #bbffbb;
}

.del{
  color: black;
  background: #ffbbbb;
}
```

Development
-----

Development work requires npm from [Node.js](http://nodejs.org/)

Begin with:

`npm install`

Then you can use:

`npm start` To host the directory so you can see the demo

`npm test` To run the Jasmine tests once

`npm test-watch` To run the Jasmine tests with change detection
