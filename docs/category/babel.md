# babel
> 写完这篇没几天 babel7 就 stable 了……写完手头的任务再来更新吧……
>
> 下文仅针对 babel6 环境。

## 最佳实践
1. 中大型应用类项目：babel-polyfill + babel-preset-env, 指定 env.targets + useBuiltIns:true / 或者 polyfill.io 根据 ua 返回 polyfill，同时根据实际情况考虑生成 helpers 减少代码冗余
2. 工具库：transform-runtime + 单独兼容需要的静态方法
3. 小型项目：啥也不管；克制用新特性的冲动，lodash 将就下；单独兼容个别方法 


## 实践过程

### 一些定义
- babel-core 包括 transform 方法，不支持 
  -  build-ints（Eg: promise，Set，Map）
  -  prototype function（Eg: array.reduce,string.trim）
  -  class static function （Eg：Array.form，Object.assgin）
  -  regenerator （Eg：generator，async)
- babel-cli
  - command: babel-external-helpers 生成包含所有 helper 函数的js ，减少重复引用造成代码冗余；helper 函数如 toArray jsx转换函数等 是 transform 时用的
  - command: babel-node 内置 polyfill 依赖 babel-register 编译
- babel-runtime 包括三个部分
  - core-js: 包含 es5 （e.g: object.freeze）, es6的 promise，symbols, collections, iterators, typed arrays， es7+提案等等的 polyfills 实现
  - regenerator: 实现了 generator/yeild， async/await
  - helpers: 引用了 babel-helper-plugin-test-runner，和 babel-external-helpers 的功能相同
- babel-polyfill: core-js + regenerator, 不处理 es6 语法

### 测试报告
测试环境使用 mode: development
``` json
{
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.7.0",
    "webpack": "^4.16.2",
    "webpack-cli": "^3.1.0",
    "webpack-dev-server": "^3.1.5"
  },
  "dependencies": {
    "babel-runtime": "^6.26.0"
  }
}
```
测试文件包括各种特性
``` js
// import 'babel-polyfill'

var a = (x) => x

class X {
  constructor() {
    this.a = 1
  }
}

new Promise()

Object.assign({}, {c: 2})

function* x() {
  yield 1
  console.log(2)
}
async function foo() {
  await 1
}

var b = [1,2,3]
b.includes(2)
```
结果如下
.babelrc | size | output
--- | --- | ---
{} | 4.83 KiB | origin
presets.env | 5.45 KiB | A. 转换了 es6 语法(arrow function\class)，头部定义了 helper 函数，将 async \ generator 转换为依赖 regeneratorRuntime 的写法，见`注1`
presets.transform-runtime | 194 KiB | B. 按需引入，处理了 built-ins \ static method \ regenerator(重写 regeneratorRuntime 部分，没有就不引入) \ 不处理 includes 等静态方法
presets.transform-runtime + env | 267 KiB | D: B + A, 头部引用了 babel-runtime/helpers/xxx
babel-polyfill | 950 KiB | C. 引入并运行了了整个 polyfill 污染全局环境
babel-polyfill + env | 951 KiB | C + A
babel-polyfill + env.useBuiltIns | 657 KiB | 最优选择，根据环境单独引入了部分 polyfill
babel-polyfill + transform-runtime | 1.11 MiB | runtime 按需重复 require 并重命名为本地名称 _promise2 等，polyfill 重写了全局方法但是实际没有用到，没有意义这么做

<!-- uglify 情况下，modules true/ false 为什么大小不变啊.. | | -->

`注1` <https://babeljs.io/docs/en/babel-plugin-transform-regenerator>

其实总结下来，还是需要根据项目需要兼容的目标，以及了解项目中所使用的新特性属于哪一个模块的处理范围，最终确定 babel 配置。

### TODO
测试 builtins 的兼容情况，就是分析一下究竟舍掉了什么

## 参考资料

### 摘抄 transform-runtime vs babel-polyfill
- babel-polyfill: 一次引入，不必担心兼容；体积大，可能会污染全局环境
- transform-runtime: 按需替换，体积小，不对其他polyfill 产生影响；检测替换过程编译效率低，includes/filter/fill 等实例方法没有做处理

``` json
{
  "presets": [
    [
      "env",
      {
        "targets": { // 配支持的环境
          "browsers": [ // 浏览器
            "last 2 versions",
            "safari >= 7"
          ],
          "node": "current"
        },
        "modules": true,  //设置ES6 模块转译的模块格式 默认是 commonjs
        "debug": true, // debug，编译的时候 console
        "useBuiltIns": false, // 是否开启自动支持 polyfill
        "include": [], // 总是启用哪些 plugins
        "exclude": []  // 强制不启用哪些 plugins，用来防止某些插件被启用
      }
    ]
  ],
  plugins: [
    "transform-react-jsx" //如果是需要支持 jsx 这个东西要单独装一下。
  ]
}
```

``` json
// 默认值
{
  "plugins": [
    ["transform-runtime", {
      "helpers": true,
      "polyfill": true,
      "regenerator": true,
      "moduleName": "babel-runtime"
    }]
  ]
}
```


- [你真的会用 babel 吗？](https://github.com/sunyongjian/blog/issues/30)
- [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env#options)