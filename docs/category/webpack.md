# webpack TL;DR

> 超长预警，不懂 webpack 时一点点扒文档并测试的总结
## 原理
### webpack 处理步骤
1. 初始化
2. 编译
3. 输出
### loader 原理
``` js
module.exports = function(content, map, meta) {
  // 返回单项结果
  return someSyncOperation(content)
  // 返回多项结果
  this.callback(null, someSyncOperation(content), map, meta)
  return // 使用 callback 时总是返回 undefined
}
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any // meta 可以用来传递 AST，便于在 loaders 之间相互传递加速 build
)
```
### plugin 原理
利用 webpack 编译过程中触发的各个事件(hook)，对 compiler 和 compilation 进行处理；也可以自定义事件
``` js
// 根据不同的 hook 类型，可能使用 tapAsync 或 tapPromise
compiler.hooks.someHook.tap(/* ... */)
// 如：compile 事件发生，执行函数
compiler.hooks.compile.tap('MyPlugin', params => {
  console.log('Synchronously tapping the compile hook.')
})
```
### 输出文件分析
得到 mode 为 none 下的输出文件，适当简化后如下
``` js{30}
/******/ (function(modules) {
/******/  // 已缓存模块
/******/  var installedModules = {};
/******/
/******/  // 加载模块的方法
/******/  function __webpack_require__(moduleId) {
/******/
/******/    // 判断模块是否在缓存中
/******/    if(installedModules[moduleId]) {
/******/      return installedModules[moduleId].exports;
/******/    }
/******/    // 创建新模块，并放入缓存
/******/    var module = installedModules[moduleId] = {
/******/      i: moduleId,
/******/      l: false,
/******/      exports: {}
/******/    };
/******/
/******/    // 执行新模块的方法
/******/    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/    // 将模块标记为已加载
/******/    module.l = true;
/******/
/******/    // 返回模块输出
/******/    return module.exports;
/******/  }
/******/
/******/
/******/  // 在 __webpack_require__ 上定义了一堆变量和方法，用来引用模块、缓存、判断是否 esm 等
/******/
/******/
/******/  // 加载 entry 模块并返回结果
/******/  return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

...code

devtool: 'eval' 时 eval(...code //# sourceURL=webpack:...)

/***/ })
/******/ ]);
```
即一个IIFE，其中定义了 __webpack_require__ 对象，执行载入 entry 模块，参数为所有 modules 的数组

当使用 NamedModulesPlugin 或 HashedModuleIdsPlugin 时，参数是一个 modules 对象，键值为模块的 path 或 hash 值
``` js
(function(modules) {
  ...
})([modules])
```

## 配置

### 基本配置
1. 提取 css 文件
    - webpack4: mini-css-extract-plugin, 目前有个 `bug`，options 中设置的 publickPath 无效，见[issue](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/222)
    - webpack3: extract-text-webpack-plugin
2. 压缩 css
    - webpack4:  css-loader 不再支持 cssnano，可以使用 optimize-css-assets-webpack-plugin , 或在 postcss 中加入 cssnano 的 plugin
    - webpack3: cssnano 是 css-loader 内置的，开启 minimize 选项即可
3. css 自动加前缀: postcss-loader autoprefixer plugin
    - postcss 配置文件：postcss.config.js / .postcssrc.json 
    - 配置文件位置：css所在目录 到 根目录之间的路径 / package.json 中加个 postcss 项
4. 压缩 JS 
    - uglifyjs-webpacl-plugin 建议开启 parallel 选项，多进程并行 build
    - mode: production 时自动启用 uglifyjs
5. es6 转码: babel-loader 做两件事
    - 处理语法 如 class: babel-loader 依赖 babel-core 需配套使用，用来处理语法
    - 处理 api 如 fetch: babel-plugin-transform-run-time 依赖 babel-rumtime 需配套使用，helper 函数不重复注入，通过 require 引用，减少代码冗余。详见 [babel](babel.md)
6. tree shaking
    - 使用 es6 的 import / export 语法，因为模块的依赖关系与运行时无关，因此可以静态分析出 dead code
    - package.json 中设置 sideEffects 
    - 开启 production mode（ModuleConcatenationPlugin 和 UglifyJsPlugin 起作用）
7. 提取公共代码 Code Splitting 
    - webpack4: SplitChunksPlugin
    ``` js
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
    ```
    - webpack3: CommonsChunkPlugin
    ``` js
    new CommonsChunkPlugin({
      chunks: ['x', 'y'],
      name: 'base',
      minChunks: Number // 被提取文件出现的最少次数
    })
    ```
8. 其他
    - html-webpack-plugin 生成 html，inject files
    - clean-webpack-plugin build 前清空指定目录
### 高级配置
1. coding splitting 的几种方式
    - 默认：动态载入的 chunk import(/* webpackChunkName: "lodash" \*/ 'lodash').then; 支持 prefetch 和 preload，import(/* webpackPrefetch: true \*/ 'LoginModal');
    - 默认：动态载入的 chunk 中引入的`新的`共用 chunk 或`新的`第三方 modules (node_modules 中)，要求大于 30kb，符合并行请求数量
    - 自定义：按需对 splitchunks 进行配置，一般可以考虑将 all chunks 中的第三方模块合并为一个 vendor，长期缓存
2. 缓存策略
    - 不缓存 html
    - 缓存 基础库js、分割的公共js、业务代码js、静态文件
    - 利用文件名中的 hash 值来控制缓存命中，使用 contenthash、 NamedModulesPlugin（development 下适用，运行慢）或 HashedModuleIdsPlugin（production 适用）生成文件名，确保业务代码不影响基础库的 hash 值
    - 分别配置 js、css、css 中导入资源的 publicPath，以免单个域名下请求阻塞`[incomplete]`
2. tree shaking: ModuleConcatenationPlugin 中的 scope hoisting, 将所有模块放到同一个闭包中执行 `[incomplete]`


### 配置参数

一些概念

1. chunk: 从 entry 出发找到全部依赖 module 的代码块
2. entry 的类型 
   1. string  生成一个 chunk: main
   2. array（只导出最后一个）生成一个 chunk: main
   3. object 生成多个 chunk: 键名
   4. 以上三种组合
   5. function 动态 entry
3. module.exports 是数组时，每份配置都会执行一次 [看到有文章提过，文档中没有找到，还没有测过]
4. 命令行参数优先级高于配置文件
5. HMR 原理：子模块发生更新，事件向上传递，直到某一层接收，否则刷新网页，依赖于每个 chunk 中包含的代理客户端代码

<https://webpack.js.org/configuration/>

webpack.config.js
``` js
const path = require('path');

module.exports = {
  mode: "production", // "production" | "development" | "none"
  entry: "./app/entry", // string | object | array  // defaults to ./src
  output: {
    path: path.resolve(__dirname, "dist"), // string, absolute path
    filename: "bundle.js", // string    // entry 中 chunks 的文件名样板
    chunkFilename: '[name].bundle.js', // 非 entry 中 chunks 的文件名样板
    publicPath: "/assets/", // string    // the url to the output directory resolved relative to the HTML page
    library: "MyLibrary", // string, 导出库名称
    libraryTarget: "umd", // 导出库类型 amd | umd | umd2 | commonjs | commonjs2 | window | global | var...
  module: {
    rules: [
      {
        test: /\.jsx?$/, // 匹配文件名
        include: [
          path.resolve(__dirname, "app") // 匹配路径
        ],
        exclude: [
          path.resolve(__dirname, "app/demo-files") // exclude 优先级最高，
        ],
        // exclude / include 使用绝对路径的数组，尽量使用 include 而非 exclude 匹配

        enforce: "pre", // pre | inline | normal | post 处理顺序
        loader: "babel-loader",
      },
      {
        test: /\.html$/,
        use: [
          // 多个 loader
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              /* ... */
            }
          }
        ]
      }
    ],
    noParse: [
      /special-library\.js$/ // 不对未使用模块化的文件进行递归解析处理，如 jquery
    ],
  resolve: {
    // 模块化语法解析规则，就是优先从哪儿开始找模块
    modules: [
      "node_modules",
      path.resolve(__dirname, "app") // 文件路径
    ],
    extensions: [".js", ".json", ".jsx", ".css"], // 文件后缀
    alias: { // 起个别名
      "module": "new-module", // 例如 "module" -> "new-module", "module/path/file" -> "new-module/path/file"
      "only-module$": "new-module", // 使用 $ 只命中关键字结尾的导入语句
    },
    mainFields: ['browser', 'module', 'main'] // 根据 package.json 中的配置类型读取模块，默认配置
    enforceExtension: false, // 要求 import 语句必须带后缀
    enforceModuleExtension: false // 兼容第三方模块
  performance: {
    hints: "warning", // enum    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: function(assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  devtool: "source-map", // enum  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.
  context: __dirname, // string 绝对路径，配置项目根目录，即寻找 entry 与 module.rules.loader 中相对路径的基准
  target: "web", // enum  // 运行环境
  externals: ["react", /^@angular\//],  // 使用运行环境提供的全局变量，不需要打包
  serve: { //object
    port: 1337,
    content: './dist',
    // ...
  },
  // lets you provide options for webpack-serve
  stats: "errors-only",  // lets you precisely control what bundle information gets displayed
  devServer: { // 通过 DevServer 启动时有效
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // 开启 HMR
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    // ...
  },
  plugins: [
    // ...
  ],
  watch: true, // boolean 启用监听
  watchOptions: {
    aggregateTimeout: 1000, // 毫秒，监听到变化后延迟指定时间再 rebuild
    poll: true,
    poll: 500, // 毫秒，每隔多久查询一次
  }
}
```

### 优化总结

提高构建速度
1. 减少文件处理 include / exclude / module.noParse
2. 加快模块寻找过程 resolve.modules / resolve.alias / resolve.extensions
3. HappyPack 多进程处理 loader，uglifyjs 启用 parallel 多进程处理

减小输出文件
1. 压缩js、css、html
2. tree shaking
3. code splitting

首屏优化
1. 按需加载
2. 合理缓存
## 从配置项来看 webpack 4 的不同之处
### mode 做了什么

``` js
// webpack.development.config.js
module.exports = {
+ mode: 'development'
- devtool: 'eval',
- plugins: [
-   new webpack.NamedModulesPlugin(), // 使用路径而不是数字作为 module 的索引 
-   new webpack.NamedChunksPlugin(),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
}
// webpack.production.config.js
module.exports = {
+  mode: 'production',
-  plugins: [
-    new UglifyJsPlugin(/* ... */),
-    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-    new webpack.optimize.ModuleConcatenationPlugin(),
-    new webpack.NoEmitOnErrorsPlugin()
-  ]
}
// webpack.custom.config.js
module.exports = {
+  mode: 'none',
-  plugins: [
-  ]
}
```
补充：production 应该还启用了 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, OccurrenceOrderPlugin 和 SideEffectsFlagPlugin，见 [github.com/webpack](https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsDefaulter.js)

### optimization 可以做什么
``` js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  optimization: {
    // 压缩
    minimizer: [
      new UglifyJsPlugin({ /* your config */ })
    ],
    // 不生成，内嵌 | 对每个 entry 分别生成 | 对所有 entry 生成一个共用的运行时框架
    runtimeChunk: 'single', // false | true or mutiple | single
    // 默认配置
    splitChunks: {
      // 对异步加载 | entry | 包括前面两种的 chunks 进行分割
      chunks: 'async', // async | initial | all 
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        // 将符合条件的 chunks 合并到一个 group
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 分割第三方 module，可以设置 chunks: all 并指定 name 来合并全部 vendor
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

## TODO

### dllplugin
### devtool 实测
<https://webpack.js.org/configuration/devtool/>
速度和输出文件的区别
### webpack vs rollup
如果作为工具库，需要提供 esm 版本的代码，依然需要 rollup 的，并且二者的 tree shaking 分析存在差异。

## 参考资料
- [Webpack guide](https://webpack.js.org/guides/)
- [深入浅出 Webpack](http://webpack.wuhaolin.cn/)
- [Webpack 4 配置最佳实践](https://zhuanlan.zhihu.com/p/38456425)