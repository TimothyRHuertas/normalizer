"use strict";

(function (factory) {
  if (typeof exports !== 'undefined') {
    var React = require('react');
    var jsdom = require('jsdom').jsdom;
    var doc = jsdom('jsdom document');
    module.exports = factory(React, doc);
  } else {
    window.Normalizer = { Normalizer: factory(window.React, window.document) }; // jshint ignore:line
  }
})(function (React, doc) {
  var defaultStyles = ["display"];
  var defaultAttributes = ["style", "class"];

  function normalizeHTML(node, attributesToConsider, stylesToConsider, classNamesToConsider) {
    var html = "";

    if (node.nodeType === 1) {
      var tagName = node.tagName.toLowerCase();
      html += "<" + tagName;
      html += normalizeAttributes(node, attributesToConsider, stylesToConsider, classNamesToConsider);
      html += ">";

      if (node.hasChildNodes()) {
        Array.prototype.slice.call(node.childNodes, 0).forEach(function (node) {
          html += normalizeHTML(node, attributesToConsider, stylesToConsider, classNamesToConsider);
        });
      }
      html += "</" + tagName + ">";
    } else if (node.nodeType === 3 && node.nodeName !== "#comment") {
      var nodeValue = node.nodeValue.replace(/\s+/g, ' ');

      if (nodeValue.trim()) {
        html += nodeValue;
      }
    }

    return html;
  }

  function normalizeAttributes(node, attributesToConsider, stylesToConsider, classNamesToConsider) {
    var attributes = "";
    var attributeList = Array.prototype.slice.call(node.attributes, 0).reduce(function (map, attribute) {
      map[attribute.nodeName] = attribute.nodeValue;
      return map;
    }, {});

    Object.keys(attributeList).sort().forEach(function (attributeKey) {
      var value = attributeList[attributeKey];

      if (!attributesToConsider || //if null consider all attributes
      attributesToConsider[attributeKey.toLowerCase()]) {

        if (attributeKey === "style") {
          attributes += normalizeStyle(value, stylesToConsider);
        } else if (classNamesToConsider && attributeKey === "class") {
          attributes += normalizeClass(value, classNamesToConsider);
        } else if (attributeKey !== "data-reactid") {
          attributes += " ";
          attributes += attributeKey + "=\"" + value + "\"";
        }
      }
    });

    return attributes;
  }

  function normalizeClass(value, classNamesToConsider) {
    var retVal = "";

    if (value && value.trim()) {
      var classNames = value.replace(/\s+/g, " ").split(" ").sort();

      retVal = classNames.reduce(function (normalized, className) {

        //if classNamesToConsider is null use them all
        if (!classNamesToConsider || classNamesToConsider[className]) {
          if (!normalized) {
            normalized = "class=\"";
          }

          normalized += className + " ";
        }

        return normalized;
      }, "");

      if (retVal) {
        retVal = retVal.trim();
        retVal = " " + retVal + "\"";
      }
    }

    return retVal;
  }

  function normalizeStyle(style, stylesToConsider) {
    var normalized = "";
    var styleGroups = style.split(";");

    var styleMap = styleGroups.filter(function (group) {
      return !!group;
    }).reduce(function (map, group) {
      if (group.trim()) {
        var styleGroup = group.split(":");
        var key = styleGroup[0].trim();
        var value = styleGroup[1].trim();

        //if styles to consider is null consider them all
        if (!stylesToConsider || stylesToConsider[key.toLowerCase()]) {
          map[key] = value;
        }
      }

      return map;
    }, {});

    var keys = Object.keys(styleMap);
    var lastKeyIndex = keys.length - 1;

    keys.sort().forEach(function (key, i) {
      var value = styleMap[key];

      if (!i) {
        normalized += " style=\"";
      }

      normalized += key + ":";
      normalized += value;

      if (i !== lastKeyIndex) {
        normalized += "; ";
      } else {
        normalized += "\"";
      }
    });
    return normalized;
  }

  function normalizedHTMLFromReactComponent(reactComponent, attributesToConsider, stylesToConsider, classNamesToConsider) {
    var domString = React.renderToStaticMarkup(reactComponent);

    return normalizeHTMLString(domString, attributesToConsider, stylesToConsider, classNamesToConsider);
  }

  function normalizeHTMLString(domString, attributesToConsider, stylesToConsider, classNamesToConsider) {
    var holderNode = doc.createElement("div");
    holderNode.innerHTML = domString;
    var normalized = normalizeHTML(holderNode.children[0], attributesToConsider, stylesToConsider, classNamesToConsider);

    return normalized;
  }

  function normalizeHTMLFromReactView(reactView, attributesToConsider, stylesToConsider, classNamesToConsider) {
    var domNode;

    try {
      domNode = React.findDOMNode(reactView);
    } catch (e) {
      domNode = reactView.getDOMNode();
    }

    return normalizeHTML(domNode, attributesToConsider, stylesToConsider, classNamesToConsider);
  }

  function toLowerMap(array) {
    return array.reduce(function (map, item) {
      map[item.toLowerCase()] = true;
      return map;
    }, {});
  }

  function toMap(array) {
    return array.reduce(function (map, item) {
      map[item] = true;
      return map;
    }, {});
  }

  function isReactComponent(component) {
    return component && typeof component === "object" && component.key !== undefined && component.props !== undefined && component.ref !== undefined;
  }

  function isReactView(view) {
    return view && typeof view === "object" && view.state !== undefined && view.props !== undefined && view.refs !== undefined;
  }

  return function (options) {
    if (!options) {
      options = {};
    }

    if (!options.hasOwnProperty("attributes")) {
      options.attributes = defaultAttributes;
    }

    if (!options.hasOwnProperty("styles")) {
      options.styles = defaultStyles;
    }

    if (!options.hasOwnProperty("classNames")) {
      options.classNames = null; //consider all class names by default
    }

    var attributesToConsider = options.attributes ? toLowerMap(options.attributes) : null;
    var classNamesToConsider = options.classNames ? toMap(options.classNames) : null;
    var stylesToConsider = options.styles ? toLowerMap(options.styles) : null;

    return {
      reactView: function reactView(view) {
        if (isReactComponent(view)) {
          throw new Error("Looks like you passed in a react component.  Try using .reactComponent instead of .reactView.");
        } else if (!isReactView(view)) {
          throw new Error("This function takes one argument.  It must be a react view and can not be null.");
        }

        return normalizeHTMLFromReactView(view, attributesToConsider, stylesToConsider, classNamesToConsider);
      },
      reactComponent: function reactComponent(component) {
        if (isReactView(component)) {
          throw new Error("Looks like you passed in a react view.  Try using .reactView instead of .reactComponent.");
        } else if (!isReactComponent(component)) {
          throw new Error("This function takes one argument.  It must be a react component and can not be null.");
        }

        return normalizedHTMLFromReactComponent(component, attributesToConsider, stylesToConsider, classNamesToConsider);
      },
      domNode: function domNode(node) {
        if (!node || typeof node !== "object" || node.innerHTML === undefined) {
          throw new Error("This function takes one argument.  It must be a dom node and can not be null.");
        }

        return normalizeHTML(node, attributesToConsider, stylesToConsider, classNamesToConsider);
      },
      domString: function domString(string) {
        if (!string || typeof string !== "string") {
          throw new Error("This function takes one argument.  It must be a dom string and can not be empty.");
        }

        return normalizeHTMLString(string, attributesToConsider, stylesToConsider, classNamesToConsider);
      },
      normalize: function normalize(objectWithHTML) {
        if (objectWithHTML && typeof objectWithHTML === "string") {
          return this.domString(objectWithHTML);
        } else if (objectWithHTML && typeof objectWithHTML === "object" && objectWithHTML.innerHTML !== undefined) {
          return this.domNode(objectWithHTML);
        } else if (isReactComponent(objectWithHTML)) {
          return this.reactComponent(objectWithHTML);
        } else if (isReactView(objectWithHTML)) {
          return this.reactView(objectWithHTML);
        } else {
          throw new Error("This function takes one argument.  It must either be an HTML string, DOM node, react componenet or react element.");
        }
      }
    };
  };
});