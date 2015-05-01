require('core-js/es5');
var Normalizer = require("../index.js"),
React = require('react'),
ReactAddons = require("react/addons"),
TestUtils = ReactAddons.addons.TestUtils,
chai = require('chai'),
assert = chai.assert;

describe("When using the normalier", (() => {
  var normalizerDefalut, normalizerWitelistedAttributes, normalizerWhitelistedStyles, normalizerNulls;
  var expectedNormal, expectedWhitelistedAttributes, expectedWhitelistedStyles, expectedNulls;


  beforeEach(() => {
    expectedNormal = "<div><div class=\"spin glow auto\" style=\"display:block\">some text</div></div>";
    expectedWhitelistedAttributes = "<div><div data-a=\"something\" data-foo=\"bar\">some text</div></div>";
    expectedWhitelistedStyles = "<div><div style=\"background:red; font-size:12px\">some text</div></div>";
    expectedNulls = "<div><div class=\"spin glow auto\" data-a=\"something\" data-foo=\"bar\" data-never=\"whitelisted\" style=\"background:red; display:block; font-size:12px\">some text</div></div>";

    normalizerDefalut = new Normalizer();
    normalizerWitelistedAttributes = new Normalizer({attributes: ["data-a", "data-foo"]});
    normalizerWhitelistedStyles = new Normalizer({attributes: ["style"], styles: ["font-size", "background"]});

    normalizerNulls = new Normalizer({attributes: null, styles: null, classNames: null});
  });

  describe("and normalizing a dom string", (()=> {
    var domString;

    beforeEach(() => {
      domString = "<div><div data-never='whitelisted' data-foo='bar' data-a='something' style='font-size: 12px; background: red; display: block' class='spin glow auto'>some text</div></div>";
    }); 

    describe("and it's configured with the default options", (()=> {
      it('only retains the style and class attributes and removes all styles except display', (() => { 
        var normalized = normalizerDefalut.domString(domString);
        assert.equal(normalized, expectedNormal); 
      }));
    })); 

    describe("and it's configured with whitelisted attributes", (()=> {
      it('only retains the whitelisted attributes and sorts them in alphabetical order', (() => { 
        var normalized = normalizerWitelistedAttributes.domString(domString);
        assert.equal(normalized, expectedWhitelistedAttributes); 
      }));
    })); 

    describe("and it's configured with whitelisted styles", (()=> {
      it('only retains the whitelisted styles and sorts them in alphabetical order', (() => { 
        var normalized = normalizerWhitelistedStyles.domString(domString);
        assert.equal(normalized, expectedWhitelistedStyles); 
      }));
    })); 

    describe("and it's configured with null attributes and styles", (()=> {
      it('only retains the whitelisted styles and sorts them in alphabetical order', (() => { 
        var normalized = normalizerNulls.domString(domString);
        assert.equal(normalized, expectedNulls); 
      }));
    })); 
  }));

  describe("and normalizing a dom node", (()=> {
    var domNode;

    beforeEach(() => {
      domNode = document.createElement("div");
      domNode.innerHTML = "<div data-never='whitelisted' data-foo='bar' data-a='something' style='font-size: 12px; background: red; display: block' class='spin glow auto'>some text</div>";
    }); 

    describe("and it's configured with the default options", (()=> {
      it('only retains the style and class attributes and removes all styles except display', (() => { 
        var normalized = normalizerDefalut.domNode(domNode);
        assert.equal(normalized, expectedNormal); 
      }));
    })); 

    describe("and it's configured with whitelisted attributes", (()=> {
      it('only retains the whitelisted attributes and sorts them in alphabetical order', (() => { 
        var normalized = normalizerWitelistedAttributes.domNode(domNode);
        assert.equal(normalized, expectedWhitelistedAttributes); 
      }));
    })); 

    describe("and it's configured with whitelisted styles", (()=> {
      it('only retains the whitelisted styles and sorts them in alphabetical order', (() => { 
        var normalized = normalizerWhitelistedStyles.domNode(domNode);
        assert.equal(normalized, expectedWhitelistedStyles); 
      }));
    })); 

    describe("and it's configured with null attributes and styles", (()=> {
      it('only retains the whitelisted styles and sorts them in alphabetical order', (() => { 
        var normalized = normalizerNulls.domNode(domNode);
        assert.equal(normalized, expectedNulls); 
      }));
    })); 
  }));
 
  describe("and normalizing a component", (()=> {
    var component;

    beforeEach(() => {
      component = (
        <div>
          <div data-foo='bar' 
          data-a='something' 
          data-never='whitelisted'
          style={{fontSize: 12, background: 'red', display: 'block'}}
          className='spin glow auto'>some text</div>
        </div>
      );
    }); 

    describe("and it's configured with the default options", (()=> {
      it('only retains the style and class attributes and removes all styles except display', (() => { 
        var normalized = normalizerDefalut.reactComponent(component);
        assert.equal(normalized, expectedNormal); 
      }));
    })); 

    describe("and it's configured with whitelisted attributes", (()=> {
      it('only retains the whitelisted attributes and sorts them in alphabetical order', (() => { 
        var normalized = normalizerWitelistedAttributes.reactComponent(component);
        assert.equal(normalized, expectedWhitelistedAttributes); 
      }));
    })); 

    describe("and it's configured with whitelisted styles", (()=> {
      it('only retains the whitelisted styles and sorts them in alphabetical order', (() => { 
        var normalized = normalizerWhitelistedStyles.reactComponent(component);
        assert.equal(normalized, expectedWhitelistedStyles); 
      }));
    })); 

    describe("and it's configured with null attributes and styles", (()=> {
      it('only retains the whitelisted styles and sorts them in alphabetical order', (() => { 
        var normalized = normalizerNulls.reactComponent(component);
        assert.equal(normalized, expectedNulls); 
      }));
    })); 
  }));

  describe("and normalizing a react view", (()=> {
    var view;

    beforeEach(() => {
      var TestView = React.createClass({
                render(){
                  return (<div>
                    <div data-foo='bar' 
                    data-a='something' 
                    style={{fontSize: 12, background: 'red', display: 'block'}}
                    data-never='whitelisted'
                    className='spin glow auto'>some text</div>
                  </div>);
                }
             });

      view = TestUtils.renderIntoDocument(
          <TestView />
      );
    }); 

    describe("and it's configured with the default options", (()=> {
      it('only retains the style and class attributes and removes all styles except display', (() => { 
        var normalized = normalizerDefalut.reactView(view);
        assert.equal(normalized, expectedNormal); 
      }));
    })); 

    describe("and it's configured with whitelisted attributes", (()=> {
      it('only retains the whitelisted attributes and sorts them in alphabetical order', (() => { 
        var normalized = normalizerWitelistedAttributes.reactView(view);
        assert.equal(normalized, expectedWhitelistedAttributes); 
      }));
    })); 

    describe("and it's configured with whitelisted styles", (()=> {
      it('only retains the whitelisted styles and sorts them in alphabetical order', (() => { 
        var normalized = normalizerWhitelistedStyles.reactView(view);
        assert.equal(normalized, expectedWhitelistedStyles); 
      }));
    })); 

    describe("and it's configured with null attributes and styles", (()=> {
      it('only retains the whitelisted styles and sorts them in alphabetical order', (() => { 
        var normalized = normalizerNulls.reactView(view);
        assert.equal(normalized, expectedNulls); 
      }));
    })); 
  }));
}));