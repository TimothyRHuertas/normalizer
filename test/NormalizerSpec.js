var Normalizer = require("../index.js")
var chai = require('chai'),
assert = chai.assert;

describe("When using the normalier", (() => {
  var normalizer;
  var expected;

  beforeEach(() => {
    expected = "<div><div class=\"spin glow auto\" style=\"display:block\">some text</div></div>";
  });

  describe("and normalizing dom", (()=> {
    var testDiv;

    beforeEach(() => {
      testDiv = document.createElement("div");
      testDiv.innerHTML = "<div data-foo='bar' data-a='something' style='font-size: 12px; background: red; display: block' class='spin glow auto'>some text</div>";
    }); 

    describe("and it's configured with the default options", (()=> {
      beforeEach(() => {
        normalizer = new Normalizer();
        expected = "<div><div class=\"spin glow auto\" style=\"display:block\">some text</div></div>";
      });

      it('only retains the style and class attributes and removes all styles except display', (() => { 
        var normalized = normalizer.domNode(testDiv);
        assert.equal(normalized, expected); 
      }));
    })); 

    describe("and it's configured with whitelisted attributes", (()=> {
      beforeEach(() => {
        normalizer = new Normalizer(["data-a", "data-foo"]);
        expected = "<div><div data-a=\"something\" data-foo=\"bar\">some text</div></div>";
      });

      it('only retains the whitelisted attributes and sorts them in alphabetical order', (() => { 
        var normalized = normalizer.domNode(testDiv);
        assert.equal(normalized, expected); 
      }));
    })); 

    describe("and it's configured with whitelisted styles", (()=> {
      beforeEach(() => {
        normalizer = new Normalizer([], ["font-size", "background"]);
        expected = "<div><div style=\"background:red; font-size:12px\">some text</div></div>";
      });

      it('only retains the whitelisted styles and sorts them in alphabetical order', (() => { 
        var normalized = normalizer.domNode(testDiv);
        assert.equal(normalized, expected); 
      }));
    })); 

  }));
  
}));