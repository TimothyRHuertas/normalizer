var Normalizer = require("../index.js")
var chai = require('chai'),
assert = chai.assert;

describe("When configured with default options", (() => {
  var normalizer;
  var testDiv;

  beforeEach(() => {
    normalizer = new Normalizer();
    testDiv = document.createElement("div");
    testDiv.innerHTML = "<div style='font-size: 12px; display: block' class='spin glow auto'>some text</div>";
  });

  it('only retains the style and class attributes', (() => { 
      var normalized = normalizer.domNode(testDiv);
      var expected = "";
      assert.equal(normalized, expected); 
  }));
}));