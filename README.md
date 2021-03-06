# Normalizer (html-normalizer)

** I no longer support this. Jest now ships with similar functionality; consider it as an alternative.

[![Version](http://img.shields.io/npm/v/html-normalizer.svg)](https://www.npmjs.org/package/html-normalizer)
[![Build Status](https://travis-ci.org/TimothyRHuertas/normalizer.svg?branch=master)](https://travis-ci.org/TimothyRHuertas/normalizer)

`npm install html-normalizer`

Normalizer is designed to help write DOM tests; specifically DOM assertions.  Here is an example of HTML requires test coverage.

```html
<div id="testElement" 
  class='some-class' 
  style='display: none; background: red'>
  <span>Bob</span>
</div>
```

There are several assertion libraries with matchers designed to inspect DOM elements.  Those assertions may look like this:

```javascript
var dom = document.getElementById("testElement"); 

expect(dom).toHaveClass("some-class");
expect(dom.children.length).toEqual(1);
expect(dom).toHaveText("Bob");
expect(dom).toBeHidden();
```

Overtime this becomes difficult to read.  Especially when testing large DOM trees.  Here is an alternate approach: 

```javascript
var dom = document.getElementById("testElement"); 
var expectedNode = document.createElement("div");
expectedHTML = "<div style='background: red; display: none' class='some-class'>";
expectedHTML += "<span>Bob</span>";
expectedHTML += "</div>";
expectedNode.innerHTML = expectedHTML;
expect(dom.isNodeEqual(expectedNode)).toBeTruthy(); 
```

The test works, but when it fails it's helpful to know how the nodes differ. Here is yet another approach:

```javascript
var dom = document.getElementById("testElement"); 
var expectedHTML = "<div style='background: red; display: none' class='some-class'>";
expectedHTML += "<span>Bob</span>";
expectedHTML += "</div>";

expect(dom.outerHTML).toEqual(expectedHTML); 
``` 

The HTML is equal, but the test still fails since the HTML strings differ.  The style and the class properties are in different order.  Changing `expectedHTML` to match `dom.outerHTML` fixes the test, but this solution seems brittle.  Furthermore it may be unnecessary to test certain properties and style attributes.  


### Normalizer prepares HTML for string equality testing by:

* alphabetizing properties.
* alphabetizing styles. 
* filtering out specified properties, class names and style attributes.

Here is the same test written with Normalizer:

```javascript
var Normalizer = require("html-normalizer");
var normalizer = new Normalizer();
var dom = document.getElementById("testElement"); 
var expectedHTML = "<div style='display: none' class='some-class'>";
expectedHTML += "<span>Bob</span>";
expectedHTML += "</div>";

var actual = normalizer.domNode(dom); //method to normalize a DOM node
var expected =  = normalizer.domString(expectedHTML); //method to normalize a DOM string
expect(actual).toEqual(expected); 
```

### But it's even cooler with React's JSX!

Concatenating HTML strings is no fun.  Normalizer works with JSX!  ***Non React projects can still leverage Normalizer for testing.***  

Behold the same test written with JSX and Normalizer:

```JSX
var Normalizer = require("html-normalizer");
var normalizer = new Normalizer();
var dom = document.getElementById("testElement"); 
var expectedHTML = (
  <div style={{display: 'none'}} className='some-class'>
    <span>Bob</span>
  </div>
);

var actual = normalizer.domNode(dom); //method to normalize a DOM node
var expected =  = normalizer.reactComponent(expectedHTML); //method to normalize a JSX component
expect(actual).toEqual(expected); 
```

### White listing styles and attributes.

Normalizer's constructor `Normalizer({})` takes an optional hash with the following optional properties:
* *attributes* Array of attribute names to keep when normalizing the HTML.  Defaults to `["style", "class"]`;
* *attributesExcluded* Array of attribute names to exclude when normalizing the HTML. Defaults to `[]`;
* *styles* Array of style names to keep when normalizing the HTML.  Defaults to `["display"]`;
* *classNames* Array of class names to keep when normalizing the HTML.  Defaults to `null`.

**NOTE:**  For all options use null to include all (except for *attributesExcluded*, for this case it will act like empty array); use an empty array to include none. For example the `Normalizer({attributes: null, attributesExcluded: null, styles: null, classNames: null})` will compare all attributes, styles and classes.  `Normalizer({attributes: [], styles: [], classNames: []})` will only compare the DOM nodes and ignore all attributes, styles and classes. `Normalizer({attributes: null, attributesExcluded: ['data-state'], styles: null, classNames: null})` will compare all styles, classes and all attributes except for *data-state*.



### Methods

Normalizer can return a normalized HTML string for 4 types of input (HTML string, DOM node, ReactView and ReactElement).  

* `normalizer.normalize(string|domNode|reactView|reactElement)` 

#### Disclaimer

The majority of tests written with this util will be functional in nature.  There is no substitute for unit tests.  Like doughnuts, please use Normalizer in moderation. 

**Normalizer is best used with a test runner that reports inline string diffs;** similar to what a good source control file diff viewer reports.  

#### Testing legacy code

This util is very useful for adding functional test coverage to legacy code.  To start:

1.  Load the module to test.
2.  Simulate events (click, hover, ajax response, ect).
3.  Copy the module's element's outer HTML.
4.  Use that HTML and Normalizer to write your assertions. 
5.  Refactor the code, make sure the tests pass, rinse and repeat.

#### Example

* [Testing Backbone Todos](https://github.com/TimothyRHuertas/normalizer/blob/master/examples/todos)







