

// 原始文件
var a = (x) => x

class X {
  constructor() {
    this.a = 1
  }
}

// built-ins: promise / set / map
new Promise()

// static method: Array.from
Object.assign({}, {c: 2})

// generator functions: regenerator

// instance method 
var b = [1,2,3]
b.includes(2)

import _Object$assign from "babel-runtime/core-js/object/assign";
import _Promise from "babel-runtime/core-js/promise";
var a = x => x;

class X {
  constructor() {
    this.a = 1;
  }
}

new _Promise();

_Object$assign({}, { c: 2 });

// generator functions: regenerator

var b = [1, 2, 3];
b.includes(2);


"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var a = function a(x) {
  return x;
};

var X = function X() {
  _classCallCheck(this, X);

  this.a = 1;
};

new Promise();

Object.assign({}, { c: 2 });

// generator functions: regenerator

var b = [1, 2, 3];
b.includes(2);


"use strict";

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var a = function a(x) {
  return x;
};

var X = function X() {
  (0, _classCallCheck3.default)(this, X);

  this.a = 1;
};

new _promise2.default();

(0, _assign2.default)({}, { c: 2 });

// generator functions: regenerator

var b = [1, 2, 3];
b.includes(2);