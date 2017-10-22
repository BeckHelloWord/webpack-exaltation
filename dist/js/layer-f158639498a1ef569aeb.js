/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(9);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(5);

var _layer = __webpack_require__(10);

var _layer2 = _interopRequireDefault(_layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var showLayer = function showLayer() {
    var name = 'webpack babel';
    console.log(name);
    console.log(_layer2.default);
};
new showLayer();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/_css-loader@0.28.7@css-loader/index.js?importLoaders=1!../../node_modules/_postcss-loader@2.0.8@postcss-loader/lib/index.js!./common.css", function() {
			var newContent = require("!!../../node_modules/_css-loader@0.28.7@css-loader/index.js?importLoaders=1!../../node_modules/_postcss-loader@2.0.8@postcss-loader/lib/index.js!./common.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.i(__webpack_require__(7), "body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td");

// module
exports.push([module.i, "body, button, input, select, textarea { font:12px/1.5tahoma, arial, \\5b8b\\4f53; } \r\nh1, h2, h3, h4, h5, h6{ font-size:100%; } \r\naddress, cite, dfn, em, var { font-style:normal; } \r\ncode, kbd, pre, samp { font-family:couriernew, courier, monospace; } \r\nsmall{ font-size:12px; } \r\nul, ol { list-style:none; } \r\na { text-decoration:none; } \r\na:hover { text-decoration:underline; } \r\nsup { vertical-align:text-top; } \r\nsub{ vertical-align:text-bottom; } \r\nlegend { color:#000; } \r\nfieldset, img { border:0; } \r\nbutton, input, select, textarea { font-size:100%; } \r\ntable { border-collapse:collapse; border-spacing:0; }\r\n\r\n\r\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "div {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    background-image: url(" + __webpack_require__(8) + ") no-repeat;\r\n}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),
/* 9 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

__webpack_require__(11);

var layer = function layer() {
    return {
        name: 'layer',
        tlp: telp
    };
}; // import telp from "./layer.html";
exports.default = layer;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/_css-loader@0.28.7@css-loader/index.js!../../node_modules/_postcss-loader@2.0.8@postcss-loader/lib/index.js!../../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./layer.scss", function() {
			var newContent = require("!!../../node_modules/_css-loader@0.28.7@css-loader/index.js!../../node_modules/_postcss-loader@2.0.8@postcss-loader/lib/index.js!../../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./layer.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".layer {\n  box-sizing: border-box;\n  width: 500px;\n  height: 300px;\n  background: greenyellow; }\n  .layer > div {\n    width: 300px;\n    height: 200px;\n    margin: 0 auto;\n    background: red; }\n", ""]);

// exports


/***/ })
/******/ ]);