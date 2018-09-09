# 『EVENT』事件监听的三种方式
> 我可能需要再理解一遍事件……
## HTML 属性 
``` html
<button onclick="alert('Hello world!')">
```
方法中可以访问 this，event，return false 可以取消事件。

[The event handler processing algorithm](http://w3c.github.io/html/webappapis.html#the-event-handler-processing-algorithm)
## DOM 元素属性 
``` js
myButton.onclick = function(e){alert('Hello world');};
```
方法中可以访问 this，event，方法的第一个参数引用是 event，方法中 return false 可以取消事件。
## addEventListener
``` js
myButton.addEventListener('click', greet, false);
function greet(e){
    alert('hello world');     
}
```
方法中可以访问 this，event，方法的第一个参数引用是 event。

`EventTarget.addEventListener` 的第三个参数有两种已经标准化了的类型。
- useCapture: 表明是否在捕获阶段触发，默认为 false
- options 对象，`{capture: boolean, once: boolean, passive: boolean}`，once 表示执行一次后移除事件监听，passive 表示在事件监听方法中不会调用 event.preventDefault。

### passive
`判断是否支持 passive 属性`
``` js
var passiveSupported = false;

try {
  var options = Object.defineProperty({}, "passive", {
    get: function() {
      passiveSupported = true;
    }
  });

  window.addEventListener("test", options, options);
  window.removeEventListener("test", options, options);
} catch(err) {
  passiveSupported = false;
}
```
如果浏览器支持 passive，那么就会试图读取 options 中的 passive 值，get 时 passiveSupport 被置为 true。

`作用`

如果监听器中有 preventDefault，那么会影响事件的默认行为，因此浏览器需要等待监听器执行完才能判断下一步动作。因此在移动端下滑动页面时，会频繁触发 touch 相关事件并等待监听器执行，从而导致滑动的延迟，并可能阻塞浏览器主线程引发性能问题。

而 passive: fasle 可以告知浏览器无需等待，实现了移动端滚动性能优化。

注：现代浏览器（Chrome | Firefox）对于 window、document、document.body 上的 touchstart 和 touchmove 事件的 passive 默认值为 true。

[EventTarget.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
