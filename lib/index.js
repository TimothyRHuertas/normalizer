"use strict";

var React = require("react");
var defaultStyles = ["display"];
var defaultAttributes = ["style", "class"];

function normalizeHTML(node, attributesToConsider, stylesToConsider) {
  var html = "";

  if (node.nodeType === 1) {
    var tagName = node.tagName.toLowerCase();
    html += "<" + tagName;
    html += normalizeAttributes(node, attributesToConsider, stylesToConsider);
    html += ">";

    if (node.hasChildNodes()) {
      Array.prototype.slice.call(node.childNodes, 0).forEach(function (node) {
        html += normalizeHTML(node, attributesToConsider, stylesToConsider);
      });
    }
    html += "</" + tagName + ">";
  } else if (node.nodeType === 3) {
    html += node.nodeValue.replace(/\s+/g, " ");
  }

  return html;
}

function normalizeAttributes(node, attributesToConsider, stylesToConsider) {
  var attributes = "";
  var attributeList = Array.prototype.slice.call(node.attributes, 0).reduce(function (map, attribute) {
    map[attribute.nodeName] = attribute.nodeValue;
    return map;
  }, {});

  Object.keys(attributeList).sort().forEach(function (attributeKey) {
    var value = attributeList[attributeKey];

    if (attributesToConsider[attributeKey.toLowerCase()]) {
      if (attributeKey === "style") {
        attributes += normalizeStyle(value, stylesToConsider);
      } else {
        attributes += " ";
        attributes += attributeKey + "=\"" + value + "\"";
      }
    }
  });

  return attributes;
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

      if (stylesToConsider[key.toLowerCase()]) {
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

function normalizedHTMLFromReactComponent(reactComponent, attributesToConsider, stylesToConsider) {
  var domString = React.renderToStaticMarkup(reactComponent);

  return normalizeHTMLString(domString, attributesToConsider, stylesToConsider);
}

function normalizeHTMLString(domString, attributesToConsider, stylesToConsider) {
  var holderNode = document.createElement("div");
  holderNode.innerHTML = domString;
  var normalized = normalizeHTML(holderNode.children[0], attributesToConsider, stylesToConsider);

  return normalized;
}

function normalizeHTMLFromReactView(reactView, attributesToConsider, stylesToConsider) {
  var domNode = React.findDOMNode(reactView, attributesToConsider, stylesToConsider);

  return normalizeHTML(domNode, attributesToConsider, stylesToConsider);
}

function toLowerMap(array) {
  return array.reduce(function (map, item) {
    map[item.toLowerCase()] = true;
    return map;
  }, {});
}

module.exports = function (attributes, styles) {
  var attributesToConsider = attributes ? toLowerMap(attributes) : toLowerMap(defaultAttributes);
  var stylesToConsider;

  if (styles && styles.length) {
    //they passed in styles to consider, but did not whitelist the attribute
    //lets do the intelligent default
    stylesToConsider = toLowerMap(styles);
    attributesToConsider.style = true;
  } else {
    stylesToConsider = toLowerMap(defaultStyles);
  }

  return {
    reactView: function reactView(view) {
      return normalizeHTMLFromReactView(view, attributesToConsider, stylesToConsider);
    },
    reactComponent: function reactComponent(component) {
      return normalizedHTMLFromReactComponent(component, attributesToConsider, stylesToConsider);
    },
    domNode: function domNode(node) {
      return normalizeHTML(node, attributesToConsider, stylesToConsider);
    },
    domString: function domString(string) {
      return normalizeHTMLString(string, attributesToConsider, stylesToConsider);
    }

  };
};