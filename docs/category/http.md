# 网络
> 网络相关很弱..
## 互联网协议
1. application layer
    - DHCP 协议(建立在 UDP 上)：用来获取本机 IP、网关 IP、DNS IP、子网掩码 
    - 发出 port 68 -> 67; IP 0.0.0.0 -> 255.255.255.255
    - DHCP 服务器返回 67 ->68: IP -> 255.255.255.255 Data: 子网掩码 DNS IP 分配 IP
    - HTTP
2. transport：port (port + host = socket)
    - TCP 慢启动 ACK (期待 seq / 剩余容量）
3. network
    - IP 协议（网络部分+主机部分，分配 IP 子网掩码用来判断是否属于同一子网） 
    - ARP 协议（同一子网可以根据 IP 查询 Mac 地址）
4. link：确定分组方式，一组为一帧（HEAD+DATA)，在子网内广播，使用 MAC 地址判断接收方
5. physical： 物理连接 传输 0 1 电信号

以太网数据包，数据部分大小为 1500 bytes

以太网HEAD | IP | TCP | DATA
--- | --- | --- | ---
22 | 20+ | 20+ | <1460

[互联网协议入门（一） - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2012/05/internet_protocol_suite_part_i.html)

## TCP / UDP
> 这块儿理解略粗浅，买的书还没来得及看

`三次握手`：建立一个 TCP 连接，需要客户端和服务器一共发送 3 个包
1. SYN = 1, seq = x; 客户端发送后进入 SYN_SEND
2. SYN = 1, ACK = 1, seq = y, ACKnum = x + 1; 服务端发回后进入 SYN_RCVD
3. SYN = 0, ACK = 1, ACKnum = y + 1; 客户端发送后进入 EASTABLISHED，服务端接收后也为 ESTABLISHED

A: 嗨我有话和你说，能听到吗收到回复

B: 回复：我能听到，我说的你能听到吗收到回复

A: 回复：我也能听到

`四次挥手`：TCP 连接的拆除，任何一方都可以发起 close，以客户端发起为例
1. FIN = 1, seq = x; 客户端发送后进入 FIN_WAIT_1
2. ACK = 1, ACKnum = x + 1; 服务器发送后进入 CLOSE_WATI, 客户端收到后进入 FIN_WATI_2
3. FIN = 1, seq = y; 服务器发送后进入 LAST_ACK
4. ACK = 1, ACKnum = y + 1; 客户端发送后，进入 TIME_WAIT，等待可能出现要求重传的 ACK; 服务器收到后关闭连接，进入 CLOSED; 客户端等待两个最大段生命周期后，未收到 ACK，则关闭连接，进入 CLOSED

A: 我要关啦

B: 好的我知道了你等我一下

A: 好了我要关了，收到告诉我不然我烦死你

B: 好的我收到了，过会你不出声我就当你收到了

[TCP 协议](https://hit-alibaba.github.io/interview/basic/network/TCP.html)

UDP vs TCP
- UDP 支持广播和多播
- UDP 是无连接的
- UDP 缺乏可靠性，不保证数据到达、到达次数、不能确认数据顺序
- UDP 头部 8 字节 / TCP 20 字节


## HTTP
### 一些定义
结构组件
- proxy 位于客户端和服务器之间的 HTTP 中间实体
- cache
- gateway
- tunnel 盲转发
- agent 代表用户发起 HTTP 请求的客户端程序：浏览器 / 搜索引擎 spider

URI 和 URL
- URI 统一资源标识符：包括 URL(统一资源定位符) 和 URN（统一资源名）
- URL: scheme://服务器位置/路径
- 转义：% + 字符 ASCII 码的十六进制数
- 保留和受限字符：如 % 等

### HTTP 报文组成
- 起始行
- 首部
- 主体

起始行和首部分隔：行终止序列（CRLF: /r/n, 回车 + 换行)

### HTTP 方法
GET PUT HEAD POST DELETE TRACE OPTIONS

### 状态码
1XX: 信息性
- 100 continue 继续请求，用来回应 Expect: 100 Continue 的请求

2XX: 成功
- 200 OK 请求成功
- 204 no content 请求成功，不返回实体内容
- 205 reset content 请求成功，不返回实体内容，要求请求者重置文档视图
- 206 partial content 请求成功，主体包含请求的范围区间，（回应 Range)，可用来断点续传

3XX: 重定向
- 301 moved permanently 永久重定向，返回 location
- 302 found 临时重定向，一些旧的用户代理可能将请求转为 get
- 303 see other 响应在另一个 url 上，应采用 get 访问
- 304 not modified(回应带条件的 get 请求，如 if modified since)
- 307 temporary redirect 确保请求方法和消息主体不变

4XX: 客户端错误
- 400 bad request 语义有误，参数有误
- 401 unauthorized 需用户验证
- 403 forbidden 拒绝执行
- 404 not found 没有找到请求的资源

5XX: 服务器错误
- 500 internal server error 服务器错误，遇到意外被阻止了执行
- 501 not implemented 服务器不支持请求方法（GET HEAD 必须支持）
- 503 service unavailable 服务器没有准备好处理请求，如停机维护、超载

### 首部
`incomplete`
general header | 定义
--- | ---
Date | 消息生成时间 GMT
Cache-Control |
Connection | keep-alive / close
Pragma |


request header | 定义
--- | ---
Accept | 用户代理期望的MIME 类型列表
Accept-Charset | 列出用户代理支持的字符集
Accept-Language | 列出用户代理期望的页面语言
Accept-Encoding | 列出用户代支持的压缩方法
Expect |
Range |
Referer |
Host |
User-Agent |
If-Match |
Authorization |


response header | 定义
--- | ---
Age |
ETag |
Location |

entity header | 定义
--- | ---
Allow |
Content-Lenght |
Expires |
Last Modified |
Content-Type | 指示服务器文档的MIME 类型
Content-Length | 

## HTTP 缓存
### 一些概念
相关首部：Pragma | Cache-Control | Expires | ETag | Last-Modified | If-None-Match | Last-Modified-Since

优先级: Pragma > Cache-Control > Expires; ETag > Last-Modified

缓存目标：一般只缓存 GET 请求

分类：强缓存、协商缓存 / 私有缓存、共享缓存

缓存命中过程：
1. 本地判断强缓存（expires / cache-control)，命中则直接使用
2. 强缓存未命中时，发出 HTTP 请求，判断协商缓存(etag / last-modified)
3. 304 表示命中则直接使用，200 表示未命中则更新缓存

### Cache-Control
response directive | request directive
--- | ---
no-cache | no-cache  
no-store | no-store 
no-transform |  no-transform 
max-age=\< seconds\> | max-age=\<seconds\> 
s-maxage=\<seconds\> | max-stale[=\<seconds\>] 
proxy-revalidate | min-fresh=\<seconds\> 
must-revalidate | only-if-cached 
public | 
private |

- Cache-Control: no-store 禁止缓存
- Cache-Control: no-cache 强制向源服务器确认缓存(max-age=0)
- Cache-Control: must-revalidate 过期后，进行缓存验证
- Cache-Control: private 中间人不能缓存此响应，该响应只能应用于浏览器私有缓存
- Cache-Control: public 中间人可以缓存此响应
- Cache-Control: max-age=31536000 资源能够被缓存的最大时间，距离请求发起的时间的秒数
- Cache-Control: s-maxage=31536000 仅应用于共享缓存，优先级最高

### tips
用户操作对缓存的影响
- 首次访问，得到响应 200，得到 ETag / Last-Modified
- 二次访问
    1. 输入地址回车：判断本地缓存，命中则直接访问，不重新发起 HTTP 请求，否则触发缓存验证
    2. 普通刷新(cmd + r)：触发缓存验证，发送 cache-control: max-age=0 / if-modified-since / if-none-match，得到 304 / 200
    3. 强制刷新(cmd + shif + r 或 devtool 中勾选 disable cache 的情况下普通刷新)：发送 cache-control: no-cache，得到 200

区分
- max-age=0 vs expires: expires 是绝对时间，根据浏览器时间判断，兼容 HTTP/1.0；max-age 是时间间隔，根据 date 判断，优先级更高
- max-age=0 vs no-cache: `[incomplete]` 
- must-revalidate vs no-cache: must-revalidate 在过期后才进行缓存验证
- ETag vs Last-Modified
    1. Last-Modified 只精确到秒，文件内容不变时间改变时无法命中
    2. ETag 是一种文件指纹
    3. ETag 更消耗服务端资源


### 缓存策略
1. HTML 文件，不缓存 no-cache
2. 可缓存资源，需配合使用强缓存和协商缓存
3. 强缓存：使用 Expires 兼容 HTTP/1.0，同时使用Cache-Control
4. 协商缓存：没有特殊需求优先使用 last-modified，无法满足则使用 etag
5. 在文件名中标识版本号，长期缓存 max-age=31536000，以减少 304 响应

- [web性能优化之：no-cache与must-revalidate深入探究](http://www.cnblogs.com/chyingp/p/no-cache-vs-must-revalidate.html)
- [HTTP_1.1_ Header Field Definitions](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9)

## TODO
preload
prefetch

### localStorage sessionStorage cookie
