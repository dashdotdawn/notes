# 『EVENT』touch | mouse | click 的触发顺序
> 当你点击页面时，会触发哪些事件？他们的顺序如何？有什么关联性？

## DEMO
 一个栗子，理清一次点击的相关事件。
``` html
<div id="t">t</div>
<script>
  const TYPES = 'touchstart touchend mousedown mouseup click'
  const ele = document.getElementById('t')
  var timer
  TYPES.split(' ').forEach((type, index) => {
    ele.addEventListener(type, function (e) {
      console.log(type)
      if (!timer) console.time()
      console.timeEnd(timer)
      timer = type
      console.time(timer)
    })
  })
</script>
```
## PC
在 pc 下执行，看到依次触发了 mousedown、mouseup、click。
``` js
mousedown
default: 0.00390625ms
mouseup
mousedown: 1.126220703125ms
click
mouseup: 0.195068359375ms
```
## 移动端
在移动端下，依次触发了 touchstart、touchend、mousedown、mouseup、click。
``` js
touchstart
default: 0.001708984375ms
touchend
touchstart: 3.2998046875ms
mousedown
touchend: 295.8798828125ms
mouseup
mousedown: 0.93701171875ms
click
mouseup: 0.243896484375ms
```
两个有趣的事实
- 如果任一 touch 相关事件被取消，那么 mouse 事件也不再发生。

- touchend 到 mousedown 之间存在约 300ms 的延迟，这是因为在移动端下需要判断触点是否移动、是否多点触控来决定是否分发 mouse 事件。这段时间的延迟可以通过 fastclick 来解决。

  fastclick 在 touchend 上分发了一个自定义事件来模拟点击行为。`[incomplete]`

[Interaction with Mouse Events and click](https://w3c.github.io/touch-events/#mouse-events)

