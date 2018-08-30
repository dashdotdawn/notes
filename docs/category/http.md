# HTTP
> HTTP 相关很弱
## 网络
### 互联网协议
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

### TCP / UDP
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
- UDP 数据报有长度

### http/2

- http/1.0
- http/1.1 一次连接可以处理多个请求，并行请求需求多个 TCP 连接
- http/2    
    概念
    - 数据流：已建立的连接内的双向字节流，可以承载一或多条消息
    - 消息：与逻辑请求或响应消息对应的一系列帧
    - 帧：HTTP/2 通信的最小单位，包含帧头，标识了所属数据流

    关系
    - 一个 TCP 连接，任意数量双向数据流
    - 数据流有标识符，可以有优先级，承载双向消息
    - 消息对应一条逻辑 HTTP 消息（请求或响应），包含一个或多个帧
    - 帧，不同数据流的帧可以交错发送，根据帧头数据流标识符组装

    特性  
    1. 二进制分帧层：将所有传输的消息分为更小的消息和帧，并采用二进制编码
    2. 多路复用：交错发送帧，另一段重新组装，实现同域名下一个连接并行处理请求与响应，并可以分配数据流优先级
    3. 服务器推送：一个请求发送多个响应，由 PUSH_PROMISE 帧发起
    4. 头部压缩：[HPACK](https://tools.ietf.org/html/draft-ietf-httpbis-header-compression-12) 压缩算法，使用静态 Huffman 编码减小传输大小；连接存续期内共同维护“首部表”

[HTTP/2 简介](https://developers.google.com/web/fundamentals/performance/http2/?hl=zh-cn)
[一文读懂 HTTP/2](http://support.upyun.com/hc/kb/article/1048799/)

## https
HTTPS = HTTP + SSL/TLS，默认端口 443，TCP 三次握手 + SSL 四次握手

### ssl 过程
SSL(Secure Socket Layer) 是 TLS(Transport Layer Security) 的前身，SSL 从 3.1 开始被标准化并改名为 TLS

ssl / tls 握手的过程就是为了协商出一个安全的对称密钥，基本步骤如下
- client: hello
- server: hello 给你一个证书
- client: 查过了 ssl 是真的, 得到 pub_key
- client: pub_key 加密(对称加密算法 + 对称密钥)
- server: private_key 解密，得到(对称加密算法 + 对称密钥)，后续采用对称密钥加密通话

具体的实现涉及 tls 不同版本稍有出入，通过 `wireshark` 查看了访问 upyun 的过程
1. client: Client Hello(随机数 + 客户端支持的加密算法 + session ID)
2. server: Server Hello(随机数 + 确定使用的加密算法)
3. server: Certificate 证书
4. server: Server Key Exchange(EC Diffie-Hellman Server Params 中有 curve、pubkey 和 signature) + Server Hello Done
5. client: Client Key Exchange(根据给定的 DH 算法得出的 pubkey) + Change Cipher Spec(接下来只发加密消息) + Encrypted Handshake Message(发个加密消息你看能解吗)
5. server: New Session Ticket(给你一个 session ticket 来维持我们的友谊) + Change Cipher Spec(同上) + Encrypted Handshake Message(同上)
6. 之后都是加密后的 Application Data 通信

其中第一步的 session id 可以在中断后快速恢复连接，不需要再次握手进行密钥协商

### 验证 SSL 证书
证书内容
- CA
- 有效期
- 公钥
- 所有者
- 签名

浏览器验证证书首先会：判断有效期；比对内置的受信 CA；`[incomplete]`
<!-- 取出操作系统中 CA 的公钥对证书签名进行解密；比对证书的 hash 值 -->

浏览器验证证书链的方式

- CRL 维护并定时更新证书撤销名单
- OCSP 实时在线证书验证协议
- OCSP stapling 服务器模拟客户端验证，将 OCSP 响应和证书链一起下发给客户端，因此浏览器不需要再想 CA 站点查询证书状态

## TODO

### HTTP request
状态码
- 301 永久重定向
- 302 临时重定向
- 307 HSTS 

请求头

请求类型 get post options head del 

### localStorage sessionStorage cookie
