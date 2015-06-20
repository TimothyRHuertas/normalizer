var Normalizer = require("../index.js"),
React = require('react'),
ReactAddons = require("react/addons"),
TestUtils = ReactAddons.addons.TestUtils,
shallowRenderer = TestUtils.createRenderer(),
chai = require('chai'),
assert = chai.assert;

describe("Using normalizer to test shallow rendered JSX", (() => {
    var renderedOutput,
    normalizer;

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

        shallowRenderer.render(React.createElement(TestView));
        renderedOutput = shallowRenderer.getRenderOutput();
        normalizer = new Normalizer({attributes: ["style"], styles: ["display"]});

    });

    it('take the rendered string and compare it to a JSX component', (() => { 
        var actual = normalizer.reactComponent(renderedOutput);
        var expected = normalizer.reactComponent(
        <div>
            <div style={{display: 'block'}}>some text</div>
        </div>);

        assert.equal(actual, expected); 
    })); 
}));