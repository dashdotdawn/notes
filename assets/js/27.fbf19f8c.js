(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{166:function(t,e,n){t.exports=n.p+"assets/img/reflow.9f6cb457.jpg"},179:function(t,e,n){"use strict";n.r(e);var s=[function(){var t=this.$createElement,e=this._self._c||t;return e("ol",[e("li",[this._v("遇到了坑，不写分号 codepen 一直报错，偷懒没有用 Array.prototype.forEach")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"2"}},[e("li",[this._v("leetcode 中犯的错误")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("提交代码时要去掉 console.log 否则输出会 "),e("code",[this._v("Output Limit Exceeded")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"3"}},[e("li",[this._v("执行上下文")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ul",[n("li",[t._v("创建阶段\n"),n("ul",[n("li",[t._v("arguments")]),t._v(" "),n("li",[t._v("函数声明，如果已存在则覆盖")]),t._v(" "),n("li",[t._v("变量声明，如果已存在则继续")])])]),t._v(" "),n("li",[t._v("激活阶段\n逐行执行，分配变量")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"4"}},[e("li",[this._v("document\ndocument\ndocument.body\ndocument.documentElement")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"5"}},[e("li",[this._v("HTML")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"node-类型"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#node-类型","aria-hidden":"true"}},[this._v("#")]),this._v(" Node 类型")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"node-属性"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#node-属性","aria-hidden":"true"}},[this._v("#")]),this._v(" Node 属性")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"element-属性"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#element-属性","aria-hidden":"true"}},[this._v("#")]),this._v(" Element 属性")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"6"}},[e("li",[e("p",[this._v("安全\ncookie\ndocument.cookie 无法访问 HttpOnly 标记的值 避免 xss\nSecure 只能通过 https 传输\nSameSite 跨站请求时不会被发送 避免 csrf(跨站请求伪造攻击)")])]),this._v(" "),e("li",[e("p",[this._v("存储\ncookie expires 设置过期事件 4kb 影响性能 由服务端生成\nlocalstorage 永久 5mb\nsessionstorage 会话 5mb\nindexDB 永久")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"8"}},[e("li",[e("p",[this._v("权限管理\n心跳\nbeforeRouteUpdate\n鉴权 meta")])]),this._v(" "),e("li",[e("p",[this._v("数据类型\n基本数据类型 null undefined string boolean number symbol 栈空间")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"10"}},[e("li",[this._v("回流重绘\nDOM tree + style strcut = render tree\nrender tree 只包括可视部分（不含 display:none, head)")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[t._v("offsetTop"),n("span",{attrs:{class:"token operator"}},[t._v("/")]),t._v("Left"),n("span",{attrs:{class:"token operator"}},[t._v("/")]),t._v("Width"),n("span",{attrs:{class:"token operator"}},[t._v("/")]),t._v("Height\nscrollTop"),n("span",{attrs:{class:"token operator"}},[t._v("/")]),t._v("Left"),n("span",{attrs:{class:"token operator"}},[t._v("/")]),t._v("Width"),n("span",{attrs:{class:"token operator"}},[t._v("/")]),t._v("Height\nclientTop"),n("span",{attrs:{class:"token operator"}},[t._v("/")]),t._v("Left"),n("span",{attrs:{class:"token operator"}},[t._v("/")]),t._v("Width"),n("span",{attrs:{class:"token operator"}},[t._v("/")]),t._v("Height\ngetComputedStyle "),n("span",{attrs:{class:"token operator"}},[t._v("/")]),t._v(" "),n("span",{attrs:{class:"token function"}},[t._v("currentStyle")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token constant"}},[t._v("IE")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nwidht"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" height\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("静态样式维护 class 而不是具体样式")]),this._v(" "),e("li",[this._v("动态样式作多次操作时应缓存局部变量，避免过度操作计算")]),this._v(" "),e("li",[this._v("离线处理多个 DOM 操作，例如 documentFragment；克隆节点上更新后替换；display: none 操作完毕后恢复显示")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("可以使用 devtool 中的 performance 来查看性能瓶颈，红色小三角一般是需要注意的 warning 部分。\n"),e("img",{attrs:{src:n(166),alt:""}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",[e("li",[this._v("减少回流，避免或减少强制回流")]),this._v(" "),e("li",[this._v("兼容性允许时使用 flex")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"11"}},[e("li",[this._v("async")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" a "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token number"}},[t._v("0")]),t._v("\n"),n("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" b "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  a "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token keyword"}},[t._v("await")]),t._v(" "),n("span",{attrs:{class:"token number"}},[t._v("10")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("+")]),t._v(" a "),n("span",{attrs:{class:"token comment"}},[t._v("// A")]),t._v("\n  "),n("span",{attrs:{class:"token comment"}},[t._v("// a = a + (await 10) // B")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{attrs:{class:"token function"}},[t._v("b")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\na"),n("span",{attrs:{class:"token operator"}},[t._v("++")]),t._v("\n"),n("span",{attrs:{class:"token function"}},[t._v("setTimeout")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" console"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("log")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("a"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{attrs:{class:"token number"}},[t._v("0")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),n("span",{attrs:{class:"token comment"}},[t._v("// A: 11")]),t._v("\n"),n("span",{attrs:{class:"token comment"}},[t._v("// B: 10")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"12"}},[e("li",[this._v("原型\nvar a = {}\na => Object.prototype => null")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("// Function."),e("strong",[this._v("proto")]),this._v(" === Object."),e("strong",[this._v("proto")]),this._v(" === Function.prototype\nFunction => Function.prototype\nObject => Function.prototype")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"13"}},[e("li")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"14"}},[e("li",[this._v("高程3\nif (NaN) => false\nif (null) => false")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"2"}},[e("li",[e("p",[this._v("parseInt: 后续遇到非数字则忽略\nparseInt('1234x') = 1234\nNumber('1234x') = NaN")])]),this._v(" "),e("li",[e("p",[this._v("Number 可以处理小数\nparseFloat 用来处理小数，只解析十进制\nparseFloat('0xA') = 0\nNumber('0xA') = 10")])]),this._v(" "),e("li",[e("p",[this._v("object 方法\nObject.defineProperty\nObject.defineProperties\nObject.getOwnPropertyDescriptor\nObject.getOwnPropertyDescriptors")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ol",{attrs:{start:"16"}},[e("li",[this._v("数字精度\n0.1+0.2\n1.1-1\n1.1+0.1")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("blockquote",[e("blockquote",[e("p",[this._v("右移 符号位填充")]),this._v(" "),e("blockquote",[e("p",[this._v("无符号右移 0 填充")])])])])}],a=n(0),r=Object(a.a)({},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"content"},[t._m(0),t._v(" "),n("p",[t._v("const links = document.querySelectorAll('a[data-to]');\n[].forEach.call(links, function(a) {")]),t._v(" "),t._m(1),t._v(" "),n("p",[t._v("数字排序不能直接用 sort")]),t._v(" "),t._m(2),t._v(" "),n("p",[t._v("经常不小心按到回车就取消了超烦")]),t._v(" "),n("p",[t._v("要注意 js 处理数字范围的问题，大数计算可以用链表数组字符串之类的实现")]),t._v(" "),t._m(3),t._v(" "),n("p",[t._v("函数每次被调用时会创建一个新的执行上下文")]),t._v(" "),t._m(4),t._v(" "),t._m(5),t._v(" "),n("p",[t._v("怎样做自适应\n配合媒体查询 和 rem\nhtml.style.fontSize 可以用 JS 来设置 / 设置 vw")]),t._v(" "),n("p",[t._v("长屏按需加载")]),t._v(" "),t._m(6),t._v(" "),t._m(7),t._v(" "),n("p",[t._v("Document 9\nElement 1\nText 3\nComment 8\nDocumentFragment 11")]),t._v(" "),t._m(8),t._v(" "),n("p",[t._v("parentNode\nchildNodes\nfirstChild\\lastChild\nnextSibling\\previousSibling\nnodeType\nnodeValue\nnodeName 大写标签名")]),t._v(" "),n("p",[t._v("可以忽略 文本、空白 只对 Element 处理")]),t._v(" "),t._m(9),t._v(" "),n("p",[t._v("children\nfirstElementCHild\\lastElementChild\nnextElementSibling\\previousElementSibling\nchildElementCount")]),t._v(" "),t._m(10),t._v(" "),n("p",[t._v("一般用 localstorage 401 了就清空\n其他用过 websql\n在后台的订单页面做了一个 自动刷新和自动打印的功能")]),t._v(" "),n("p",[t._v("自动刷新：定时获取")]),t._v(" "),n("p",[t._v("自动打印：在本地存储了一份已打印订单 id 的表，存在 websql 里面，每次 fetchData 后回去表里面查找一遍，查不到就加到即将打印的数据中，处理完之后调用打印。\n自动打印使用了 lodop 控件。")]),t._v(" "),n("p",[t._v("为什么选择这个：因为之前做婚姻系统的时候有许多需要打印的场景，需要考虑 windows 和 macOS 的系统差异，证件打印时候使用针式打印机、文件打印使用激光打印机，做的时候遇到的主要问题是chrome 直接打印时候针式打印机衬线字体和细表格经常出现没有着色的问题，而系统原生的打印没有这个问题，可能是对字体渲染做了特殊的处理。而 LODOP 是专做打印的一个控件，并且已经有了使用经验，商业版也已经买过了，所以继续选用了这个解决方案。")]),t._v(" "),t._m(11),t._v(" "),n("p",[t._v("object 堆空间")]),t._v(" "),t._m(12),t._v(" "),n("p",[t._v("reflow: 需要重新验证 render tree 的局部或全部，重新计算节点大小，至少发生一次（初始化页面布局时），也称作 Layout\nrepaint: 屏幕的部分去要需要进行更新，可能因为节点的几何结构、样式改变。指元素的样式改变不影响文档流整体结构，渲染树结构不变。")]),t._v(" "),n("p",[n("a",{attrs:{href:"https://csstriggers.com/",target:"_blank",rel:"noopener noreferrer"}},[t._v("触发 Layout/paint/composite 的 css 属性"),n("OutboundLink")],1)]),t._v(" "),n("p",[t._v("浏览器会将 reflow 动作放入队列延迟并合并执行，获取某些样式时，浏览器为了返回准确的值会导致强制回流，例如")]),t._v(" "),t._m(13),n("p",[t._v("频繁的强制回流会造成布局抖动，应该尽可能避免：")]),t._v(" "),t._m(14),t._v(" "),t._m(15),t._v(" "),n("p",[t._v("优化")]),t._v(" "),t._m(16),t._v(" "),n("p",[n("a",{attrs:{href:"https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing#avoid-forced-synchronous-layouts",target:"_blank",rel:"noopener noreferrer"}},[t._v("避免大型、复杂的布局和布局抖动"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://www.phpied.com/rendering-repaint-reflowrelayout-restyle/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Rendering: repaint, reflow/relayout, restyle"),n("OutboundLink")],1)]),t._v(" "),t._m(17),t._v(" "),t._m(18),n("p",[t._v("async 函数在遇到 await 时会暂停执行，await 内部由 generators 实现，因此会保存 await 之前的变量状态。")]),t._v(" "),t._m(19),t._v(" "),n("p",[t._v("var A = function (){}\nA => Funtion.prototype => Object.prototype => null")]),t._v(" "),t._m(20),t._v(" "),n("p",[t._v("继承")]),t._v(" "),n("p",[t._v("A.prototype = B.prototype")]),t._v(" "),n("p",[t._v("class A extends B {}")]),t._v(" "),t._m(21),t._v(" "),n("p",[t._v("Object 方法")]),t._v(" "),n("p",[t._v("Object.setPrototypeOf")]),t._v(" "),t._m(22),t._v(" "),n("p",[t._v("Number.MAX_VALUE\nNumber.MIN_VALUE\nisFinite, isNaN 先转换为数字 再判断\nNumber.isFinite, Number.isNaN 不作转换, 直接判断")]),t._v(" "),n("p",[t._v("+null = 0\n+undefined = NaN")]),t._v(" "),n("p",[t._v("parseInt 与 Number 区别\n1.\nparseInt: 第一个非空格字符，不是数组或者负号 => NaN\nparseInt('') = NaN\nNumber('') = 0")]),t._v(" "),t._m(23),t._v(" "),n("p",[t._v("Object.getPrototypeOf(instance)\nA.isPrototypeOf(a)\na.hasOwnProperty('xxx')\nObject.keys(a) // 实例属性\nObject.getOwnPropertyNames(a) // 包括不可枚举属性在内的实例属性\npropertyIsEnumberable")]),t._v(" "),t._m(24),t._v(" "),n("p",[t._v("位操作 ~x = -x -1\n<< 左移不影响符号位")]),t._v(" "),t._m(25),t._v(" "),n("p",[t._v("== 比较\nboolean 转换为数字再比较\nstring + number 将 string 转换为数字再比较\nobject + 非对象 object.valueOf\nundefined 和 null 不转换\nundefined == null")]),t._v(" "),n("p",[t._v("switch(true) // 好骚的写法")]),t._v(" "),n("p",[t._v("修改 arguments 值会同步到传入实参对应的形参，内存空间独立，严格模式下无效")])])},s,!1,null,null,null);r.options.__file="js.md";e.default=r.exports}}]);