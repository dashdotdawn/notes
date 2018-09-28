(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{173:function(t,s,a){"use strict";a.r(s);var n=a(0),e=Object(n.a)({},function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"content"},[t._m(0),t._v(" "),t._m(1),t._v(" "),a("p",[t._v("webp 一种图片格式，支持有损压缩、无损压缩、透明度，具有同等质量尺寸更小的特性，编码解码速度比 jpg 要慢。可以节省带宽，优化体验。")]),t._v(" "),a("p",[t._v("它的平均尺寸在无损压缩下比 png 减小了 26%，在有损压缩下较 jpg 减小了 25% - 34%。需要注意的是 webp 并不绝对比 jpg 更小，在高质量小尺寸时，webp 很可能更大。")]),t._v(" "),t._m(2),t._v(" "),a("p",[t._v("使用相邻像素点来预测中间像素点的值，只存储差异部分。\n"),a("a",{attrs:{href:"https://developers.google.com/speed/webp/docs/compression",target:"_blank",rel:"noopener noreferrer"}},[t._v("Compression Techniques"),a("OutboundLink")],1)]),t._v(" "),t._m(3),t._v(" "),t._m(4),t._v(" "),a("p",[t._v("check_webp_feature")]),t._v(" "),t._m(5),t._m(6),t._v(" "),t._m(7),t._v(" "),a("ul",[a("li",[t._v("编码 "),a("a",{attrs:{href:"https://developers.google.com/speed/webp/docs/cwebp",target:"_blank",rel:"noopener noreferrer"}},[t._v("cwebp"),a("OutboundLink")],1)]),t._v(" "),a("li",[t._v("解码 "),a("a",{attrs:{href:"https://developers.google.com/speed/webp/docs/dwebp",target:"_blank",rel:"noopener noreferrer"}},[t._v("dwebp"),a("OutboundLink")],1)])]),t._v(" "),t._m(8),t._v(" "),a("p",[t._v("使用 upyun 等服务商提供的相应功能。可以利用 HTTP 请求头中的 accept，返回对应的图片格式 content-type: image/webp，如")]),t._v(" "),t._m(9),t._m(10),t._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"https://developers.google.com/speed/webp/",target:"_blank",rel:"noopener noreferrer"}},[t._v("A new image format for the Web"),a("OutboundLink")],1)]),t._v(" "),a("li",[a("a",{attrs:{href:"https://aotu.io/notes/2016/06/23/explore-something-of-webp/index.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("探究WebP一些事儿"),a("OutboundLink")],1)])])])},[function(){var t=this.$createElement,s=this._self._c||t;return s("h1",{attrs:{id:"『图片优化』webp"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#『图片优化』webp","aria-hidden":"true"}},[this._v("#")]),this._v(" 『图片优化』webp")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"特性"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#特性","aria-hidden":"true"}},[this._v("#")]),this._v(" 特性")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"压缩原理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#压缩原理","aria-hidden":"true"}},[this._v("#")]),this._v(" 压缩原理")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"应用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#应用","aria-hidden":"true"}},[this._v("#")]),this._v(" 应用")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"判断浏览器兼容性"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#判断浏览器兼容性","aria-hidden":"true"}},[this._v("#")]),this._v(" 判断浏览器兼容性")])},function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("check_webp_feature")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("feature"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" callback"),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" kTestImages "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        lossy"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{attrs:{class:"token string"}},[t._v('"UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA"')]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        lossless"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{attrs:{class:"token string"}},[t._v('"UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=="')]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        alpha"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{attrs:{class:"token string"}},[t._v('"UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA=="')]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        animation"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{attrs:{class:"token string"}},[t._v('"UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"')]),t._v("\n    "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" img "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{attrs:{class:"token class-name"}},[t._v("Image")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    img"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function-variable function"}},[t._v("onload")]),t._v(" "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" result "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("img"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("width "),a("span",{attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),a("span",{attrs:{class:"token number"}},[t._v("0")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token operator"}},[t._v("&&")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("img"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("height "),a("span",{attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),a("span",{attrs:{class:"token number"}},[t._v("0")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),a("span",{attrs:{class:"token function"}},[t._v("callback")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("feature"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" result"),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    img"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function-variable function"}},[t._v("onerror")]),t._v(" "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{attrs:{class:"token function"}},[t._v("callback")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("feature"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token boolean"}},[t._v("false")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    img"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("src "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token string"}},[t._v('"data:image/webp;base64,"')]),t._v(" "),a("span",{attrs:{class:"token operator"}},[t._v("+")]),t._v(" kTestImages"),a("span",{attrs:{class:"token punctuation"}},[t._v("[")]),t._v("feature"),a("span",{attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"格式转换"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#格式转换","aria-hidden":"true"}},[this._v("#")]),this._v(" 格式转换")])},function(){var t=this.$createElement,s=this._self._c||t;return s("ol",[s("li",[this._v("命令行工具")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("ol",{attrs:{start:"2"}},[s("li",[this._v("配置 CDN")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[this._v("accept: image/webp,image/apng,image/*,*/*;q=0.8\n")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"参考"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参考","aria-hidden":"true"}},[this._v("#")]),this._v(" 参考")])}],!1,null,null,null);e.options.__file="webp.md";s.default=e.exports}}]);