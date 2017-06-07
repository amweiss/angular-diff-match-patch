angular-diff-match-patch
========================
[![CircleCI](https://img.shields.io/circleci/project/github/amweiss/angular-diff-match-patch.svg)](https://circleci.com/gh/amweiss/angular-diff-match-patch/tree/master) [![Codecov](https://img.shields.io/codecov/c/github/amweiss/angular-diff-match-patch.svg?maxAge=2592000)](https://codecov.io/gh/amweiss/angular-diff-match-patch)

[![David](https://img.shields.io/david/amweiss/angular-diff-match-patch.svg?maxAge=2592000)](https://david-dm.org/amweiss/angular-diff-match-patch/#info=dependencies&view=table) [![David](https://img.shields.io/david/dev/amweiss/angular-diff-match-patch.svg?maxAge=2592000)](https://david-dm.org/amweiss/angular-diff-match-patch/#info=devDependencies&view=table)

This library is simply a wrapper around [google-diff-match-patch](https://code.google.com/p/google-diff-match-patch/).

![Simple](http://amweiss.github.io/angular-diff-match-patch/simple.png)

(Shown here with some custom styles)

Angular 2 Port
---------------

Should you wish to use this in an Angular 2+ project, take a look at this port: [elliotforbes/ng-diff-match-patch](https://github.com/elliotforbes/ng-diff-match-patch)

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

Another option is to skip angular processing the diff, it's useful when you want to show a diff of a code pre-compiled by angular. The attribute you need to add is called: `skipAngularCompilingOnDiff`. If set to `true`, would skip compiling, otherwise it would compile the diff.

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
