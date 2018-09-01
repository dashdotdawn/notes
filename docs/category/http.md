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
通用 | 定义
--- | ---
Date |
Cache-Control |
Connection | keep-alive / close
Pragma |


请求 | 定义
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


响应 | 定义
--- | ---
Age |
ETag |
Location |

实体 | 定义
--- | ---
Allow |
Content-Lenght |
Expires |
Last Modified |
Content-Type | 指示服务器文档的MIME 类型
Content-Length | 
Content-Type | 指示服务器文档的MIME 类型
Content-Type | 指示服务器文档的MIME 类型
Content-Type | 指示服务器文档的MIME 类型

## TODO

### 缓存
### localStorage sessionStorage cookie
