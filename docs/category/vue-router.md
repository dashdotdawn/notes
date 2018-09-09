# vue-router 源码阅读

clone 了当前 dev 上的最新代码来读一下，最近一次 release 是 3.0.1，commit 1d2cc656a，更新于 Tue Aug 14 16:11:50 2018 +0800。

## 从 package.json 出发
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

## Vue.use 注册路由
### install
在 vue 中，Vue.use(myPlugin, options) 会调用 myPlugin.install(Vue, options) 方法。这也是给 vue 写插件的方式，可以在 install 方法中操作 Vue 对象，加一些全局变量与方法、在 vue 原型上定义实例方法、全局混入 mixin 之类的。

`src/install.js` 来看一下 VueRouter 的 install 方法。
``` js{23,25,47}
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
        // defineReactive 将 _route 定义为响应式属性，实现 _route 变化时更新视图，见下文
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
这里用到了 vue 的几个 api，`Vue.mixin` 用来给所有组件混入 options，`Vue.component` 用来注册全局组件。我们知道 mixin 在单个组件上是通过 options 中的 mixins: [mixinObj] 来注入的，data、methods、components、directives 的合并规则和 Object.assign 差不多，重复时以组件优先，created 这些勾子函数则会被合并到一起，mixin 先执行，组件自身的方法后执行。
### init
`src/index.js` 看一下 VueRouter 的 init 方法。
``` js
init (app: any /* Vue component instance */) {
  this.apps.push(app)
  if (this.app) {
    return
  }
  this.app = app

  // history.transitionTo... 这里判断了一下 history 类型，完成初始化时当前 url 跳转，处理了 hash 模式下的事件监听

  // 注册回调，会在每次 updateRoute 的时候执行，也就是每次路由更新的时候，同时更新 app._route，而 _route 又是响应式的，因此完成了视图的更新
  history.listen(route => {
    this.apps.forEach((app) => {
      app._route = route
    })
  })
}
```
### difineReactive 响应式原理
`Vue.util.difineReactive` 属于比较特殊的一个 api，在官方文档中并没有给出，如果了解过双向绑定的实现就很容易理解了，就是利用 Object.defineProperty，劫持了数据的 get 和 set。

来看看 vue 的源码中是在哪里、如何定义了 defineReactive 的。

``` js
// vue/src/core/index.js
import { initGlobalAPI } from './global-api/index'
initGlobalAPI(Vue) // 初始化全局 API
```

``` js
// vue/src/core/global-api/index.js
import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'
// exposed util methods.
// NOTE: these are not considered part of the public API - avoid relying on
// them unless you are aware of the risk.
Vue.util = {
  warn,
  extend,
  mergeOptions,
  defineReactive
} // 这里定义了 util API，非公有 API 可能随着版本更新变化
```

``` js
// vue/src/core/util/index.js 找到了定义 difineReactive 的出处 
export { defineReactive } from '../observer/index'
```
``` js{17,43}
// vue/src/core/observer/index.js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()
  // ...
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend() // 收集依赖
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify() // 通知 dep 中收集的订阅者进行更新
    }
  })
}
```
在 vue 中，首先会遍历 data 对数据进行 defineReactive 处理，到了 mountComponent 阶段，new Watcher 中会执行 updateComponent，也就是通过 _render 得到 vnode，通过 _update 将 vnode 更新为视图。在 _render 过程中会触发数据的 get，因此该数据的 dep 中就记录了一个订阅者，当修改数据时，触发 set，通知 dep 中的订阅者进行更新。

对于路由来说，_router 是数据，routerview 则是视图。routerview 在 render 阶段触发 _route 的 get 来收集依赖，当 _route 更新时触发 set 来通知 routerview 更新视图。

## VueRouter
### 构造函数
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
### createMatcher
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
### mode
说回 VueRouter，mode 可以指定为 'hash' | 'history' | 'abstract'，决定了路由间跳转的实现方式。这里有个 fallback 需要注意，原先是在设定了 'history' 但是浏览器不支持 pushState 方法时会赋值 fallback = true，并将 mode 回退到 hash。[文档](https://router.vuejs.org/api/#fallback) 中提到 IE9 使用 SSR 时回退到 hash 模式会遇到问题，需要设置参数 fallback: false 阻止回退使每页都自动刷新，源自 [pr](https://github.com/vuejs/vue-router/pull/1512)。不过文档中将 fallback 的默认值写成了 true，似乎写的不太准确，看了几遍也没找到默认值，只不过 undefined !== false 和 true 效果一样而已。

router.history 三种模式的类都是以同一个基类派生出来的，base.js 中定义了路由更新
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

## 路由更新
理解了乞丐版，那么来追溯一遍 vue 中的路由跳转过程。
### 普通链接
点击普通的 a 标签时，相当于重新加载了 a.href，这时是如何显示正确的页面的呢？

前文讲到，在路由注册时 install 全局 mixin 了 beforeCreate，所有组件的 this._routerRoot 指向向上查找时最近的传入了 router 的根组件。根组件在创建前会调用 router.init，而 init 中会执行 `history.transitionTo(history.getCurrentLocation())`，在 transitionTo 中完成了对 history.current 的赋值，执行完 init 回到 beforeCreate 时，再将 history.current 定义在了 _route 的 get 上。同时，在 Vue.prototype 上定义了 $route 的 get 指向 this._routerRoot._route。

#### history.transitionTo
`src/history/base.js`
``` js{3-4}
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
  })
}
```
history.transitionTo 调用了 history.confirmTransition，传递了要跳转的路由对象 route 和一个回调函数，confirmTransition 中按层级对比了跳转前后的 route，依次执行了 deactivated、updated、activated 等导航守卫后，再执行回调函数。
``` js{7}
confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
  // ...
  // queue 是导航守卫的一个队列，iterator 是一个执行 hook 和 next 的迭代器
  runQueue(queue, iterator, () => {
    // ...
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
``` js{4}
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
```
执行完 runQueue 中的任务队列后，开始执行每次传入回调函数。 在 transitionTo 向 confirmTransition 中传入的 onComplete 中调用了 updateRoute，完成了对 current 的赋值。需要注意的是这一次 transitionTo 是在 init 时被调用的，此时 history.cb 还没有被定义。
``` js
updateRoute (route: Route) {
  const prev = this.current
  this.current = route
  this.cb && this.cb(route)
  this.router.afterHooks.forEach(hook => {
    hook && hook(route, prev)
  })
}
```
第一步完成了每个组件都能获取到指向当前路由的 $route，第二步需要根据路由正确的渲染组件。
#### history.transitionTo
routerview 是自定义组件，它的 render 函数在 `src/components/view.js` 里，下文已做简化。
``` js
export default {
  name: 'RouterView',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render (_, { props, children, parent, data }) {
    // used by devtools to display a router-view badge
    data.routerView = true

    const h = parent.$createElement
    const name = props.name
    const route = parent.$route

    let depth = 0
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      parent = parent.$parent
    }
    data.routerViewDepth = depth

    const matched = route.matched[depth]
    // render empty node if no matched route
    if (!matched) {
      return h()
    }

    const component = cache[name] = matched.components[name]

    return h(component, data, children)
  }
}
```
Vue 在 mount 时，routerview 显然已经能够得到当前 parent.$route 值了。$route.matched 是一个形如定义嵌套路由时的路由数组，通过判断 parent._routerRoot !== parent 得到 routerview 距离根组件的深度，获取到 rotuerview 所匹配深度的 components 进行 render。

### routerlink
再来看一次 routerlink 的点击发生了什么。

从 `src/components/link.js` 组件出发。假定 routerlink.props.repalce 为 false，那么 click 事件将会执行 router.push(location)。这里的 location 是将 routerlink 上填的相对绝对 append 的各种参数标准化之后的路径对象，location.name 或 location.path 可以用来匹配并生成路由对象。
``` js{5,7,13}
export default {
  render (h: Function) {
    const router = this.$router
    const current = this.$route
    const { location, route, href } = router.resolve(this.to, current, this.append)

    const handler = e => {
      // guardEvent 中调用了 preventDefault 方法，用来阻止 a 元素的刷新
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
router.push 会调用 router.history.push，这里的具体调用与 mode 有关。
#### history
以 mode: 'history' 为例，push 定义在 `src/history/html5.js`。
``` js{2,3}
const { current: fromRoute } = this
this.transitionTo(location, route => {
  pushState(cleanPath(this.base + route.fullPath))
  handleScroll(this.router, route, fromRoute, false) // 根据配置处理跳转后的滚动条位置
  onComplete && onComplete(route)
}, onAbort)
```
transitionTo 的过程前文已经介绍过了，这里有一点不同。router.init 的最后调用了 history.listen，listen 中定义了 cb，也就是说 在 create 之后 history.cb 已经有值了。这时的 updateRoute 除了更新 current 值，同时会调用 cb 更新全部根组件 router.apps 的 _route 值。回顾 install 中已经将 _route 定义为响应式属性了，视图得以更新。

而在 history.push 向 transitionTo 中传入的 onComplete 中调用了 pushState，完成了 url 的切换。
``` js
export function pushState (url?: string, replace?: boolean) {
  saveScrollPosition() // 保存了跳转前的滚动条位置 window.pageXOffset、window.pageXOffset
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  const history = window.history
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url)
    } else {
      _key = genKey()
      history.pushState({ key: _key }, '', url)
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url)
  }
}
```
#### hash
mode: 'hash' 又与 'history' 模式有哪些不同之处呢?

`src/history/hash.js` 中同样调用了 transitionTo，区别在于传递的回调函数中调用了 pushHash 来完成 url 更新。
``` js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  this.transitionTo(location, route => {
    pushHash(route.fullPath)
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}
```
即使使用了 hash 模式，在浏览器支持 pushState 的情况下仍优先使用 pushState 来添加历史记录条目。
``` js
if (supportsPushState) {
  pushState(getUrl(path))
} else {
  window.location.hash = path
}
```
当页面进行前进、后退时，url 会发生改变，相应的页面更新逻辑则是监听 popState 或 hashChange 事件，然后 transitionTo 到 url 指向的 location。这里监听的时机有细微差异，popState 的监听定义在 HTML5History 的构造函数里，也就是 vuerouter 的构造阶段；而 hashChange 的监听方法则是在 router.init 中作为 onComplete 和 onAbort 回调传递给了 transitionTo，也就是在第一次渲染完成后才开始监听，避免过早触发。
## 总结
路由的跳转方式 push、replace、go 都大同小异。核心理念始终是维护一个当前的 route，初始化时根据 url 得到匹配的 route 进行首次渲染，当发生切换时获取目标 route，比对二者差异，执行导航守卫的函数队列，更新当前 route 为目标 route，更新渲染对应组件，更新 url，切换完成。
