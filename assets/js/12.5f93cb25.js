(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{200:function(t,e,r){"use strict";r.r(e);var i=r(0),n=Object(i.a)({},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"content"},[t._m(0),t._v(" "),r("ul",[t._m(1),t._v(" "),t._m(2),t._v(" "),r("li",[t._m(3),t._v(" "),t._m(4),t._v(" "),r("p",[t._v("关系")]),t._v(" "),t._m(5),t._v(" "),r("p",[t._v("特性")]),t._v(" "),r("ol",[r("li",[t._v("二进制分帧层：将所有传输的消息分为更小的消息和帧，并采用二进制编码")]),t._v(" "),r("li",[t._v("多路复用：交错发送帧，另一段重新组装，实现同域名下一个连接并行处理请求与响应，并可以分配数据流优先级")]),t._v(" "),r("li",[t._v("服务器推送：一个请求发送多个响应，由 PUSH_PROMISE 帧发起")]),t._v(" "),r("li",[t._v("头部压缩："),r("a",{attrs:{href:"https://tools.ietf.org/html/draft-ietf-httpbis-header-compression-12",target:"_blank",rel:"noopener noreferrer"}},[t._v("HPACK"),r("OutboundLink")],1),t._v(" 压缩算法，使用静态 Huffman 编码减小传输大小；连接存续期内共同维护“首部表”")])])])]),t._v(" "),r("p",[r("a",{attrs:{href:"https://developers.google.com/web/fundamentals/performance/http2/?hl=zh-cn",target:"_blank",rel:"noopener noreferrer"}},[t._v("HTTP/2 简介"),r("OutboundLink")],1),t._v(" "),r("a",{attrs:{href:"http://support.upyun.com/hc/kb/article/1048799/",target:"_blank",rel:"noopener noreferrer"}},[t._v("一文读懂 HTTP/2"),r("OutboundLink")],1)])])},[function(){var t=this.$createElement,e=this._self._c||t;return e("h1",{attrs:{id:"http-2"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#http-2","aria-hidden":"true"}},[this._v("#")]),this._v(" http/2")])},function(){var t=this.$createElement,e=this._self._c||t;return e("li",[e("p",[this._v("http/1.0")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("li",[e("p",[this._v("http/1.1 一次连接可以处理多个请求，并行请求需求多个 TCP 连接")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("http/2"),e("br"),this._v("\n概念")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("数据流：已建立的连接内的双向字节流，可以承载一或多条消息")]),this._v(" "),e("li",[this._v("消息：与逻辑请求或响应消息对应的一系列帧")]),this._v(" "),e("li",[this._v("帧：HTTP/2 通信的最小单位，包含帧头，标识了所属数据流")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("一个 TCP 连接，任意数量双向数据流")]),this._v(" "),e("li",[this._v("数据流有标识符，可以有优先级，承载双向消息")]),this._v(" "),e("li",[this._v("消息对应一条逻辑 HTTP 消息（请求或响应），包含一个或多个帧")]),this._v(" "),e("li",[this._v("帧，不同数据流的帧可以交错发送，根据帧头数据流标识符组装")])])}],!1,null,null,null);n.options.__file="http2.md";e.default=n.exports}}]);