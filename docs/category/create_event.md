# 事件创建与分发
通过程序进行创建与分发的事件称作合成事件 `synthetic events`，区别于浏览器自身触发的事件。

event 上有一个属性 isTrusted，true 表示由用户行为触发；false 表示由程序生成。

## 事件创建
1. 自定义事件
``` js
var ev1 = new Event(type[, eventInitDict]) // 自定义事件

var ev2 = new CustomEvent(type[, eventInitDict]) // 自定义事件传入自定义数据

var ev3 = document.createEvent(interface) // 曾经的做法
ev3.initEvent(type, bubbles, cancelable)
```
- type 是 [DOMString](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString) 类型，表示事件名称；

- new Event 的第二个参数是 [EventInit](https://dom.spec.whatwg.org/#dictdef-eventinit) 类型，接受 bubbles、cancelabel、composed 三个字段，均为 boolean 类型，默认 false。
- new CustomEvent 的第二个参数是 [CustomEventInit](https://dom.spec.whatwg.org/#dictdef-customeventinit) 类型，可以使用 detail 字段来传递自定义数据。
- document.createEvent 是在 Event 接口标准化之前广泛使用的事件创建方式，不建议再使用。interface 接受一个参数列表 [createevent](https://dom.spec.whatwg.org/#dom-document-createevent)，例如 Event、TextEvent、KeyboardEvent 等。
使用 createEvent 创建的事件必须被初始化后才能使用。

[interface-event](https://dom.spec.whatwg.org/#interface-event)

2. 内置事件
``` js
var ev4 = new MouseEvent(type[, mouseEventInit])
```
mouseEventInit 参数包括了继承自 Event 和 UIEvent 的字段，同时还拥有自身相关的 screenX、screenY、pageX、pageY、clientX、clientY、x、y、offsetX、offsetY 等字段。
## 事件分发
`elem.dispatchEvent(event)` 可以用来触发事件。
### 模拟 click 事件
如果是一个 click 事件，是不是就真的这么简单呢？
``` html
<input type="checkbox" id="check">
<script>
  const ev1 = new Event('click') // 自定义事件

  const ev2 = new CustomEvent('click') // 自定义事件传入自定义数据

  const ev3 = document.createEvent('Event') // 曾经的做法
  ev3.initEvent('click')

  const ev4 = new MouseEvent('click') // 内置事件

  const ev5 = document.createEvent('MouseEvent')
  ev5.initEvent('click')

  document.getElementById('check').addEventListener('click', (e) => {
    console.log(e)
  })
  // document.getElementById('check').dispatchEvent(ev1)
  // document.getElementById('check').click()
</script>
```
上文的五种事件定义方式在 dispatchEvent 时都会触发 click 事件，但是只有 ev4、ev5、HTMLElement.click() 能够修改 chechbox.checked 值。

我是这样理解的，勾选一个 checkbox input 的动作是用户动作产生的，浏览器通过监听这个动作产生的事件来完成默认行为。而在处理 click 事件时做了除 event.type 以外的判断，因此仅仅使用自定义事件并不能完全模拟浏览器的默认行为。

不仅仅是 input 元素，还有 a、button、设置了 controls 属性的 video 和 audio 等元素都属于 [interactive-content](https://www.w3.org/TR/html50/dom.html#interactive-content-0)。这些可交互元素都有自身预设的激活行为，比如 a 会跳转到指定的链接、checkbox input 会改变 checked 值等。

用户对元素的激活可能触发一系列事件，通常最后会是 click 事件，如果用户使用了 click 以外的方式触发了元素的激活行为，那么该交互事件应当在元素上 `run synthetic click activation steps`，也就是执行合成的点击激活步骤。在这个模拟过程中，如果 click event 在 dispatch 后没有被取消，那么接着就会 `run post-click activation steps`，此时才完成交互元素的默认激活行为。

HTMLElement.click 是一个通过程序调用完成 `run synthetic click activation steps` 的方法，因此可以用来模拟点击行为。

> 综上
>
> 问：用程序模拟点击一个链接作跳转
>
> 答：a.click 或 a.dispatchEvent(new MouseEvent('click')) 实现

## 阻止默认行为
阻止默认行为，例如阻止跳转到 a.href 地址。
``` js
ele.onclick = function (e) {
  return false
}
ele.addEventListener('click', function (e) {
  e.preventDefault()
})
```
阻止事件默认行为原本没什么好说的，但是遇到了一个困惑的地方。

使用了 preventDefault 后，用户行为和 ele.click 引起的默认行为确实被阻止了。click 方法在执行 synthetic click activation 的 dispatch 步骤时由于事件被取消，因此不再继续 post-click activation steps。

但是 dispatchEvent(new MouseEvent('click')) 无视了这一条，还是该怎么样就怎么样？百思不得其解...

[DEMO](https://codepen.io/dashdotdawn/pen/gdoxBp)
## TODO
composed 不太理解