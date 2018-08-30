# vue-router 源码阅读

clone 了当前 dev 上的最新代码来读一下，最近一次 release 是 3.0.1，commit 1d2cc656a，更新于 Tue Aug 14 16:11:50 2018 +0800。

## day 1
### 找入口
第一步，从 `package.json` 找进门的钥匙。
``` json{3}
"scripts": {
  "dev": "node examples/server.js",
  "dev:dist": "rollup -wm -c build/rollup.dev.config.js",
  "build": "node build/build.js",
},
```
这里 `dev` 是用来看看 exmaples 的，`dev:dist` 才是正确的打包入口。不过这个 examples 很有意义，是 vue-router 的实际应用场景，但是他把 vue-router `alias` 到了 src，调试非常方便，配合来看源码也很愉快。

vue-router 和 vue 一样使用了 rollup 来打包，毕竟 esm 还是非 rollup 不可。那么看一下相关参数，`rollup -wm -c xxx.config.js` 即 `--watch--sourcemap --config xxx` 开启监听、输出 sourcemap、指定配置文件。
build/rollup.dev.config.js 非常简单，结合 build/configs.js 翻译一下可以得到下面的结果，即从同一个入口文件打包出四个不同的版本。
``` js{1,4}
const resolve = _path => path.resolve(__dirname, '../', _path)

module.exports = [{
  input: resolve('src/index.js'), // 从入口文件接着看
  plugins: [
    flow(),
    node(),
    cjs(),
    replace({
      __VERSION__: version
    }),
    buble()
  ],
  output: {
    file: resolve('dist/vue-router.js'),
    format: 'umd',
    banner,
    name: 'VueRouter'
  }
}, {
  // output: umd vue-router.min.js
}, {
  // output: cjs dist/vue-router.common.js
}, {
  // output: es dist/vue-router.esm.js
}]  
```
ok，视线转到入口文件 `src/index.js`
``` js{1,6,9-11}
import { install } from './install'

export default class VueRouter {
  ...  
}
VueRouter.install = install
VueRouter.version = '__VERSION__'

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
```
看到当使用引入 js 暴露全局变量的方式（这个有没有专有名词？）使用 vue 和 vue-router 时，会自动执行 Vue.use(VueRouter)，这也是为什么此时不需要手动执行。

回忆一下 vue-router 的使用方式，的确是这样。
``` js
// 使用模块化开发时需要手动 Vue.use
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: 'xxx', component: A }, 
    ...
  ]
})

const app = new Vue({
  // 传了 router 给根组件，所以根组件也就是 app.$options.router = router 有值，涉及后文一个 isDef 的判断
  router: router
})
```
这里做了三件事，1. Vue.use 注册插件，2. new VueRouter 构造路由实例，3. 将路由实例传递给 Vue 的构造函数。

### install
在 vue 中，Vue.use(myPlugin, options) 会调用 myPlugin.install(Vue, options) 方法。这也是给 vue 写插件的方式，可以在 install 方法中操作 Vue 对象，加一些全局变量与方法、在 vue 原型上定义实例方法、全局混入 mixin 之类的。

`src/install.js` 来看一下 VueRouter 的 install 方法。
``` js{23,47}
import View from './components/view'
import Link from './components/link'

export let _Vue

export function install (Vue) {
  // 单例模式，避免重复注册
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue
  
  // ...registerInstance
  
  Vue.mixin({
    // 在每个组件的生命周期中执行
    beforeCreate () {
      // 这里把定义了 options.router 的组件称为根组件
      if (isDef(this.$options.router)) {
        // 在根组件上存储 _routerRoot（自身） 和 _router(路由实例)
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this) // 对路由初始化，_route 的由来，见下文
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 非根组件引用父级的值，最终所有组件的 _routerRoot 都指向了根组件
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {}
  })

  // 在每个组件上暴露出 $router 和 $route 变量
  // _router 即路由实例(vuerouter)，便于控制路由进行跳转
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  // _route 即路由对象，便于监听路由变化
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  // 注册全局组件 RouterView 和 RouterLink
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link) 
  // routerlink 就是一个绑定了 click（默认是 click）事件的元素（默认是 a 标签），click 时调用 router.replace 或 router.push

  // 为 router 相关的 hook 函数设定一致的合并策略
  const strats = Vue.config.optionMergeStrategies
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```
这里用到了 vue 的几个 api，Vue.mixin 用来给所有组件混入 options，Vue.component 用来注册全局组件。我们知道 mixin 在单个组件上是通过 options 中的 mixins: [mixinObj] 来注入的，data、methods、components、directives 的合并规则和 Object.assign 差不多，重复时以组件优先，created 这些勾子函数则会被合并到一起，mixin 先执行，组件自身的方法后执行。

`src/index.js` 看一下 VueRouter 的 init 方法。
``` js
init (app: any /* Vue component instance */) {
  this.apps.push(app)
  if (this.app) {
    return
  }
  this.app = app

  // 这里判断了一下 history 类型，跳转到当前 url

  // 注册回调，会在每次 updateRoute 的时候执行，也就是每次路由更新的时候，同时更新 app._route
  history.listen(route => {
    this.apps.forEach((app) => {
      app._route = route
    })
  })
}
```
## day2
### VueRouter constructor
`src/index.js` 接着看 VueRouter 的构造函数，讲下高亮部分。
``` js{9,22-36}
export default class VueRouter {
  constructor (options: RouterOptions = {}) {
    this.app = null
    this.apps = []
    this.options = options
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []
    this.matcher = createMatcher(options.routes || [], this)

    let mode = options.mode || 'hash' // 浏览器下默认使用 hash 模式
    // 设置 mode: history，客户端不支持 pushState，且未设置 fallback: false 不允许回退，才允许回退到 hash 模式
    this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract' // nodejs 只能使用 abstract 模式
    }
    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }
}
```
`src/create-matcher.js` 中 createMatcher 返回了一个包含 match 和 addRoutes 方法的对象，这两个方法都是供 router 调用的。addRoutes 用来动态增加 routes，match 可以根据 location 返回一个 route 对象。Route 对象和 RouteRecord 的区别在于 RouteRecord 是一种路由匹配规则，而 Route 则是匹配了某个规则的具体路由，记录了 params、matched(匹配的 RouteRecord 数组) 等信息。
``` js
export function createMatcher (
  routes: Array<RouteConfig>,
  router: VueRouter
): Matcher {
  // pathList 是一个包含了所有路径的数组
  // pathMap 是一个 { path: RouteRecord } 的对象，RouteRecord 中记录了 path\regex\name\components\redirect 等信息
  // nameMap 是一个 { name: RouteRecord } 的对象
  const { pathList, pathMap, nameMap } = createRouteMap(routes) // 根据传入的 routes 参数提取变量，并始终将通配符 * 的路由放在最后

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap)
  }

  function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
    // ...
  }
  
  // ...

  return {
    match,
    addRoutes
  }
}
```
说回 VueRouter，mode 可以指定为 'hash' | 'history' | 'abstract'，决定了路由间跳转的实现方式。这里有个 fallback 需要注意，原先是在设定了 'history' 但是浏览器不支持 pushState 方法时会赋值 fallback = true，并将 mode 回退到 hash。[文档](https://router.vuejs.org/api/#fallback) 中提到 IE9 使用 SSR 时回退到 hash 模式会遇到问题，需要设置参数 fallback: false 阻止回退使每页都自动刷新，源自 [pr](https://github.com/vuejs/vue-router/pull/1512)。不过文档中将 fallback 的默认值写成了 true，似乎写的不太准确，看了几遍也没找到默认值，只不过 undefined !== false 和 true 效果一样而已。

### 简单实现

看 vuerouter 的实现之前，不如先试试自己写：两种路由实现方式之乞丐版。

<<< @/docs/public/router.html
利用 a 标签跳转时的 # 触发 hashchange 事件，根据当前 location.hash 来确定渲染的内容

<<< @/docs/public/index.html
第二种方式利用了 HTML5 的 history 接口，本地测试的时候可以用 nginx 做静态文件服务器。在点击元素时绑定了事件，通过 pushState 来改变 url，并根据元素上的 url 更新视图；监听 popState 事件更新视图。这里还需要解决一个问题，点击普通 a 标签或直接访问 /xxx 路径时服务器会找不到文件，可以通过配置 `nginx` 的 rewrite 来解决。
``` 
server {
  listen 4321;
  root /Users/dawn/...directory;

  rewrite /* /index.html break;
}
```

## day 3
以 mode: 'history' 为例，来看一次 routerlink 的点击发生了什么。`[incomplete]`

<!-- 
`src/components/link.js` 假定 routerlink.props.repalce 为 false，那么 click 事件将会执行 router.push(location)。这里的 location 是将 routerlink 上填的相对绝对 append 的各种参数标准化之后的路径对象，location.name 或 location.path 可以用来匹配并生成路由对象。
``` js{5,7,12}
export default {
  render (h: Function) {
    const router = this.$router
    const current = this.$route
    const { location, route, href } = router.resolve(this.to, current, this.append)

    const handler = e => {
      if (guardEvent(e)) {
        if (this.replace) {
          router.replace(location)
        } else {
          router.push(location)
        }
      }
    }

    // ...大概是 data.on = { click: handler }

    return h(this.tag, data, this.$slots.default)
  }
}
```
router.push 会调用 router.history.push，这个方法在 `src/history/html5.js` 里
``` js{2}
const { current: fromRoute } = this
this.transitionTo(location, route => {
  pushState(cleanPath(this.base + route.fullPath))
  handleScroll(this.router, route, fromRoute, false)
  onComplete && onComplete(route)
}, onAbort)
```
### history
找到 `src/history/base.js`，看到了路由跳转的核心部分。

``` js
transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const route = this.router.match(location, this.current)
  this.confirmTransition(route, () => {
    this.updateRoute(route)
    onComplete && onComplete(route)

    this.ensureURL()

    // fire ready cbs once
    if (!this.ready) {
      this.ready = true
      this.readyCbs.forEach(cb => { cb(route) })
    }
  }, err => {
    if (onAbort) {
      onAbort(err)
    }
    if (err && !this.ready) {
      this.ready = true
      this.readyErrorCbs.forEach(cb => { cb(err) })
    }
  })
}
confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
  // ...
  // queue 是导航守卫的一个队列，
  runQueue(queue, iterator, () => {
    const postEnterCbs = []
    const isValid = () => this.current === route
    // wait until async components are resolved before
    // extracting in-component enter guards
    const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid)
    const queue = enterGuards.concat(this.router.resolveHooks)
    runQueue(queue, iterator, () => {
      if (this.pending !== route) {
        return abort()
      }
      this.pending = null
      onComplete(route)
      if (this.router.app) {
        this.router.app.$nextTick(() => {
          postEnterCbs.forEach(cb => { cb() })
        })
      }
    })
  })
}

```

`src/util/async.js`
``` js
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
``` -->