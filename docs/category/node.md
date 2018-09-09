# nodejs 初体验
> 前端工程化是无法避开 nodejs 的

## [node-lessons](https://github.com/alsotang/node-lessons) 学习记录
新手向的实践教程，使我对 nodejs 可以做什么有了初步认识，感谢作者。
- express 作为 http 服务器，监听端口，生成响应
- superagent 抓取网页 .get().then()
- cheerio 分析网页元素 
- eventproxy 事件处理 api，可以用 emit 和 after 来模拟 promise.all 的行为
- async async.mapLimit 可以用来来控制并发数
- mocha 测试框架；should / chai 断言库；istanbul 测试覆盖率
  ``` js
  const module = require('../xx/module')
  const should = require('should')
   
  // test/module.test.js 测试脚本
  describe('描述一组测试功能', function() {
  it('描述测试用例', function() {
  module.method().should.equal(xxx)
  })
  })
  describe('...')

  // package.json
  scripts: {
  "test": "mocha",
  "test:cov": "istanbul cover _mocha"
  }
  ```
  - mocha 前端环境下测试
    + `mocha init directory` 生成前端测试环境文件
    + `mocha-chrome index.html` 在命令行下进行前端脚步测试 [mocha-chrome](https://github.com/shellscape/mocha-chrome)
- nodemon 监控 nodejs 文件变化，自动重启应用
- supertest 配合 express 等 web 框架进行集成测试
``` js
// module.test.js
const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)

describe('xxx', function() {
  it('xxx', function() {
    request
      .get(FIB_URL)
      .query({n})
      .expect(status)
      .end(function (err, res) {
        res.text.should.equal(expect)
        done(err)
      })
  })
})
```
- 正则表达式
  见 [正则表达式 常忘常记](regexp.md)
- benchmark 测试性能
``` js
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite
suite
  .add('test xxx, function () {
    ...
  })
  .add('test yyy', function () {
    ...
  })
  // 每跑完一个测试
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  // 完成测试
  .on('complete', function () {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`)
  })
  .run({'async': true})
```
- mongodb, mongoose

  mongodb 是 document database，记录类型为 BSON documents，是 JSON 的超集，可以存储二进制文件，表现为 fiels: value，value 可以是任意 BSON 值。

  层级结构：database -> collection -> document。

  1. 安装 mongodb [install-mongodb-on-os-x](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition)
  ``` bash
  brew install mongodb
  ```
  2. 启动
    - mkdir -p /data/db 
    - chown \`id -u\` /data/db: 需要读写权限，\`id -u\` 会返回 uid
    - mongod
    
    或者
    - 1. mongod --dbpath \<path to data directory\> 指定一个目录
  3. 连接并进行操作
  [mongo shell](https://docs.mongodb.com/manual/reference/method/)
  ``` bash
  ᐅ mongo // 连接至 mongodb
  MongoDB shell version v4.0.1
  connecting to: mongodb://127.0.0.1:27017
  MongoDB server version: 4.0.1
  > show dbs // 显示所有 database，不包括当前空 database 
  admin   0.000GB
  config  0.000GB
  local   0.000GB
  ttt     0.000GB
  > db // 显示当前 database 默认为 test
  test
  > use ttt // 切换 database，允许切换至不存在的 database
  switched to db ttt
  > db.newCollection.insertOne({x:1}) // 插入记录
  {
    "acknowledged" : true,
    "insertedId" : ObjectId("5b8c153c4608eb940b8b918d")
  }
  > db.getCollection('newCollection').find() // 读取记录
  { "_id" : ObjectId("5b8c153c4608eb940b8b918d"), "x" : 1 }
  > db.dropDatabase() // 删除当前 db
  > quit() // 退出
  ```
  显然这种操作过于繁琐，而 mongoose 可以将调用方法转换成 mongodb shell 与数据库进行交互。[mongoose docs](https://mongoosejs.com/docs/index.html) 

  下面是官网的一个简单例子。
  ``` js
  const mongoose = require('mongoose')

  mongoose.connect('mongodb://localhost/test')

  var db = mongoose.connection

  db.on('err', console.error.bind(console, 'connection error:'))

  db.on('open', function () {
    console.log('success open')
  })

  // 创建模式，数据格式集合
  var catSchema = new mongoose.Schema({
    name: String,
    friends: [String],
    age: Number
  })
  // method 需在 model compile 之前定义
  catSchema.methods.speak = function () {
    var greetings = this.name
      ? `${this.name} is meow meow`
      : 'I have no name'
    console.log(greetings)
  }

  // 根据 schema 编译 model，model 用来构造 documents，这里默认会将 Kitten.toLowerCase() + 's' 作为 collection 的名字
  var Kitten = mongoose.model('Kitten', catSchema)

  // 新建 document
  var mimi = new Kitten({name: 'mimi'})
  // mimi.speak()

  // 存入一条记录
  mimi.save(function (err, mimi) {
    if (err) return console.err(err)
    mimi.speak()
  })
  Kitten.find({name: /m/}, function (err, res) {
    console.log('--------------------')
    console.log(res)
    console.log('--------------------')
  })
  ```
  `node index.js` 运行上述文件后，在 mongo 中验证一下。
  ``` bash
  > db
  test
  > show collections
  kittens
  > db.kittens.find()
  { "_id" : ObjectId("5b8c1deaa7635199b7897417"), "friends" : [ ], "name" : "mimi", "__v" : 0 }
  ```
  验证成功。

## TODO
- events
- http    
- stream
- fs
- crypto
- 中间件
  
    
