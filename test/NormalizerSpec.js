var Normalizer = require("../index.js"),
React = require('react'),
ReactAddons = require("react/addons"),
TestUtils = ReactAddons.addons.TestUtils,
chai = require('chai'),
spies = require('chai-spies'),
assert = chai.assert,
expect = chai.expect;
chai.use(spies);

function expectError(functionUnderTest, context, args) {
  var wrapped = function(){
    return functionUnderTest.apply(context,args);
  }  

  return expect(wrapped);
}

describe("Handling exceptions", (() => {
  var normalizer, expectedError;

  beforeEach(() => {
    normalizer = new Normalizer();
  });

  describe("normalizing a dom string", (() => {
    beforeEach(() => {
      expectedError = "This function takes one argument.  It must be a dom string and can not be empty.";
    });

    it('triggers an exception when passing in an empty string', (() => { 
        expectError(normalizer.domString, normalizer, [""]).to.throw(expectedError);
    })); 

    it('triggers an exception when passing in undefined', (() => { 
        expect(normalizer.domString, normalizer).to.throw(expectedError);
    }));

    it('triggers an exception when passing in an object', (() => { 
        expectError(normalizer.domString, normalizer, [{}]).to.throw(expectedError);
    }));
  }));

  describe("normalizing a dom node", (() => {
    beforeEach(() => {
      expectedError = "This function takes one argument.  It must be a dom node and can not be null.";
    });

    it('triggers an exception when passing in null', (() => { 
        expectError(normalizer.domNode, normalizer, [null]).to.throw(expectedError);
    })); 

    it('triggers an exception when passing in undefined', (() => { 
        expect(normalizer.domNode, normalizer).to.throw(expectedError);
    }));

    it('triggers an exception when passing in an object without an innerHTML property', (() => { 
        expectError(normalizer.domNode, normalizer, [{}]).to.throw(expectedError);
    }));
  }));

  describe("normalizing a react component", (() => {
    beforeEach(() => {
      expectedError = "This function takes one argument.  It must be a react component and can not be null.";
    });

    it('triggers an exception when passing in null', (() => { 
        expectError(normalizer.reactComponent, normalizer, [null]).to.throw(expectedError);
    })); 

    it('triggers an exception when passing in undefined', (() => { 
        expect(normalizer.reactComponent, normalizer).to.throw(expectedError);
    }));

    it('triggers an exception when passing in an object without a key property', (() => { 
        expectError(normalizer.reactComponent, normalizer, [{}]).to.throw(expectedError);
    }));

    it('triggers an exception when passing in an object without a prop property', (() => { 
        expectError(normalizer.reactComponent, normalizer, [{}]).to.throw(expectedError);
    }));

    it('triggers an exception when passing in an object without a ref property', (() => { 
        expectError(normalizer.reactComponent, normalizer, [{}]).to.throw(expectedError);
    }));

    it('triggers a hint exception when passing in a reactView', (() => { 
        var TestView = React.createClass({
                render(){
                  return (<h1>YO</h1>);
                }
             });

        var testView = TestUtils.renderIntoDocument(<TestView />);

        var hintException = "Looks like you passed in a react view.  Try using .reactView instead of .reactComponent.";
        expectError(normalizer.reactComponent, normalizer, [testView]).to.throw(hintException);
    }));
  }));

  describe("normalizing a react view", (() => {
    beforeEach(() => {
      expectedError = "This function takes one argument.  It must be a react view and can not be null.";
    });

    it('triggers an exception when passing in null', (() => { 
        expectError(normalizer.reactView, normalizer, [null]).to.throw(expectedError);
    })); 

    it('triggers an exception when passing in undefined', (() => { 
        expect(normalizer.reactView, normalizer).to.throw(expectedError);
    }));

    it('triggers an exception when passing in an object without a key property', (() => { 
        expectError(normalizer.reactView, normalizer, [{}]).to.throw(expectedError);
    }));

    it('triggers an exception when passing in an object without a prop property', (() => { 
        expectError(normalizer.reactView, normalizer, [{}]).to.throw(expectedError);
    }));

    it('triggers an exception when passing in an object without a ref property', (() => { 
        expectError(normalizer.reactView, normalizer, [{}]).to.throw(expectedError);
    }));

    it('triggers a hint exception when passing in a reactComponent', (() => { 
        var testComponent = <br />;

        var hintException = "Looks like you passed in a react component.  Try using .reactComponent instead of .reactView.";
        expectError(normalizer.reactView, normalizer, [testComponent]).to.throw(hintException);
    }));
  }));
}));

describe("When using the normalier", (() => {
  var normalizerDefalut, normalizerWitelistedAttributes, normalizerWhitelistedStyles, 
  normalizerWhitelistedClassNames, normalizerNulls, normalizerEmptyAttributes, normalizerEmptyStyles, normalizerEmptyClasses;
  var expectedNormal, expectedWhitelistedAttributes, expectedWhitelistedStyles, 
    expectedWhitelistedClassNames, expectedNulls, expectedEmptyAttributes, expectedEmptyStyles, expectedEmptyClasses;


  beforeEach(() => {
    expectedNormal = "<div><div class=\"spin glow auto\" style=\"display:block\">some text</div></div>";
    expectedWhitelistedAttributes = "<div><div data-a=\"something\" data-foo=\"bar\">some text</div></div>";
    expectedWhitelistedStyles = "<div><div style=\"background:red; font-size:12px\">some text</div></div>";
    expectedNulls = "<div><div class=\"spin glow auto\" data-a=\"something\" data-foo=\"bar\" data-never=\"whitelisted\" style=\"background:red; display:block; font-size:12px\">some text</div></div>";
    expectedWhitelistedClassNames = "<div><div class=\"auto spin\">some text</div></div>";
    expectedEmptyAttributes = "<div><div>some text</div></div>";
    expectedEmptyStyles = "<div><div class=\"spin glow auto\">some text</div></div>";
    expectedEmptyClasses = "<div><div style=\"display:block\">some text</div></div>";

    normalizerDefalut = new Normalizer();
    normalizerWitelistedAttributes = new Normalizer({attributes: ["data-a", "data-foo"]});
    normalizerWhitelistedStyles = new Normalizer({attributes: ["style"], styles: ["font-size", "background"]});
    normalizerWhitelistedClassNames = new Normalizer({attributes: ["class"], classNames: ["spin", "auto"]});
    normalizerNulls = new Normalizer({attributes: null, styles: null, classNames: null});
    normalizerEmptyAttributes = new Normalizer({attributes: []});
    normalizerEmptyStyles = new Normalizer({styles: []});
    normalizerEmptyClasses = new Normalizer({classNames: []});

  });
 

  describe("and normalizing a dom string", (()=> {
    var domString;

    beforeEach(() => {
      domString = "<div><div data-never='whitelisted' data-foo='bar' data-a='something' style='font-size: 12px; background: red; display: block' class='spin glow auto'>some text</div></div>";
    }); 

    describe("and calling the plymorphic method normalze", (() => {
      it('calls normalize string when passed a string', (() => {
        var spy = chai.spy.on(normalizerDefalut, 'domString');
        normalizerDefalut.normalize(domString);
        expect(spy).to.have.been.called.with(domString); 
      }));
    }));

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

    describe("and it's configured with whitelisted class names", (()=> {
      it('only retains the whitelisted classNames and sorts them', (() => { 
        var normalized = normalizerWhitelistedClassNames.domString(domString);
        assert.equal(normalized, expectedWhitelistedClassNames); 
      }));
    })); 

    describe("and it's configured with null attributes and styles", (()=> {
      it('only retains the whitelisted styles and sorts them in alphabetical order', (() => { 
        var normalized = normalizerNulls.domString(domString);
        assert.equal(normalized, expectedNulls); 
      }));
    })); 

    describe("and it's configured with empty attributes", (()=> {
      it('only renders markup with no attributes', (() => { 
        var normalized = normalizerEmptyAttributes.domString(domString);
        assert.equal(normalized, expectedEmptyAttributes); 
      }));
    })); 

    describe("and it's configured with empty styles", (()=> {
      it('only renders markup with no styles', (() => { 
        var normalized = normalizerEmptyStyles.domString(domString);
        assert.equal(normalized, expectedEmptyStyles); 
      }));
    })); 

    describe("and it's configured with empty classNames", (()=> {
      it('only renders markup with no classNames', (() => { 
        var normalized = normalizerEmptyClasses.domString(domString);
        assert.equal(normalized, expectedEmptyClasses); 
      }));
    })); 
  }));

  describe("and normalizing a dom node", (()=> {
    var domNode;

    beforeEach(() => {
      domNode = document.createElement("div");
      domNode.innerHTML = "<div data-never='whitelisted' data-foo='bar' data-a='something' style='font-size: 12px; background: red; display: block' class='spin glow auto'>some text</div>";
    }); 


    describe("and calling the plymorphic method normalze", (() => {
      it('calls normalize dom node when passed a string', (() => {
        var spy = chai.spy.on(normalizerDefalut, 'domNode');
        normalizerDefalut.normalize(domNode);
        expect(spy).to.have.been.called.with(domNode); 
      }));
    }));

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

    describe("and it's configured with empty attributes", (()=> {
      it('only renders markup with no attributes', (() => { 
        var normalized = normalizerEmptyAttributes.domNode(domNode);
        assert.equal(normalized, expectedEmptyAttributes); 
      }));
    })); 

    describe("and it's configured with empty styles", (()=> {
      it('only renders markup with no styles', (() => { 
        var normalized = normalizerEmptyStyles.domNode(domNode);
        assert.equal(normalized, expectedEmptyStyles); 
      }));
    })); 

    describe("and it's configured with empty classNames", (()=> {
      it('only renders markup with no classNames', (() => { 
        var normalized = normalizerEmptyClasses.domNode(domNode);
        assert.equal(normalized, expectedEmptyClasses); 
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

    describe("and calling the plymorphic method normalze", (() => {
      it('calls normalize react element when passed a string', (() => {
        var spy = chai.spy.on(normalizerDefalut, 'reactComponent');
        normalizerDefalut.normalize(component);
        expect(spy).to.have.been.called.with(component); 
      }));
    }));

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

    describe("and it's configured with empty attributes", (()=> {
      it('only renders markup with no attributes', (() => { 
        var normalized = normalizerEmptyAttributes.reactComponent(component);
        assert.equal(normalized, expectedEmptyAttributes); 
      }));
    })); 

    describe("and it's configured with empty styles", (()=> {
      it('only renders markup with no styles', (() => { 
        var normalized = normalizerEmptyStyles.reactComponent(component);
        assert.equal(normalized, expectedEmptyStyles); 
      }));
    })); 

    describe("and it's configured with empty classNames", (()=> {
      it('only renders markup with no classNames', (() => { 
        var normalized = normalizerEmptyClasses.reactComponent(component);
        assert.equal(normalized, expectedEmptyClasses); 
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

    describe("and calling the plymorphic method normalze", (() => {
      it('calls normalize react element when passed a react view', (() => {
        var spy = chai.spy.on(normalizerDefalut, 'reactView');
        normalizerDefalut.normalize(view);
        expect(spy).to.have.been.called.with(view); 
      }));
    }));

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

    describe("and it's configured with empty attributes", (()=> {
      it('only renders markup with no attributes', (() => { 
        var normalized = normalizerEmptyAttributes.reactView(view);
        assert.equal(normalized, expectedEmptyAttributes); 
      }));
    })); 

    describe("and it's configured with empty styles", (()=> {
      it('only renders markup with no styles', (() => { 
        var normalized = normalizerEmptyStyles.reactView(view);
        assert.equal(normalized, expectedEmptyStyles); 
      }));
    })); 

    describe("and it's configured with empty classNames", (()=> {
      it('only renders markup with no classNames', (() => { 
        var normalized = normalizerEmptyClasses.reactView(view);
        assert.equal(normalized, expectedEmptyClasses); 
      }));
    })); 
  }));
}));
