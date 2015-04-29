# Normalizer

[![Build Status](https://travis-ci.org/TimothyRHuertas/normalizer.svg?branch=master)](https://travis-ci.org/TimothyRHuertas/normalizer)

Normalizer is designed to help you write DOM tests; specifically DOM assertions.  Let's test the following HTML.

```html
<div id="testElement" class='some-class' style='display: none; background: red'>Hi <span>Bob</span></div>
```

There are several assertion libraries with matchers designed to let you inspect DOM elements for properties, classes and style attributes.  Those assertions typically look like this:

```javascript
var dom = document.getElementById("testElement"); 

expect(dom).toHaveClass("some-class");
expect(dom.children.length).toEqual(1);
expect(dom).toHaveText("Hi");
expect(dom).toBeHidden();
```

I find that hard to read.  Especially when testing large DOM trees.  So I tried the following: 

```javascript
var dom = document.getElementById("testElement"); 
var expectedNode = document.createElement("div");
expectedNode.innerHTML = "<span style='background: red; display: none' class='some-class'>Hi <span>Bob</span></span>";

expect(dom.isNodeEqual(expectedNode)).toBeTruthy(); 
```

That test works, but when it fails I want to know how nodes differ. 

I went on to try the following:

```javascript
var dom = document.getElementById("testElement"); 
var expectedHTML = "<span style='background: red; display: none' class='some-class'>Hi <span>Bob</span></span>";

expect(dom.outerHTML).toEqual(expectedHTML); 
``` 

The HTML is equal, but this test still fails because the HTML strings differ.  The style and the class properties are in different order.  I could rearrange them, but that would make for a brittle test.  Also I really don't care to test that the background is red.  **I need a library to normalize the HTML (alphabetize / properties and styles) and let me white list
the properties I want to test.  Normalizer is that library.**

Using normalizer I can write:

```javascript
var Normalizer = require("Normalizer");
var normalizer = new Normalizer();
var dom = document.getElementById("testElement"); 
var expectedHTML = "<span style='display: none' class='some-class'>Hi <span>Bob</span></span>";

var actual = normalizer.domNode(dom); //method to normalize a DOM node
var expected =  = normalizer.domString(dom); //method to normalize a DOM string
expect(actual).toEqual(expected); 
```
