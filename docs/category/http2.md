# http/2

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
