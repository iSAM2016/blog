// # http 模块 核心模块

// express koa 基于http模块封装
// 用法 头的用法 状态码
// http常见功能

// 状态码 (206) 断点续传 (304缓存)
// 服务端 实现多语言功能
// 服务端压缩 gzip
// 虚拟主机 在同一个服务器上开多个项目使用同一个端口 (正向代理 反向代理)
// 图片防盗链
// 命令行工具 http-server 在当前目录下 打开一个静态服务
// 进程集群

// express koa

// 实现封装fetch

// 拖拽上传（兼容性） xhr.upload.on('progress') fileReader

// 实时获取当前最新价格 websocket

// RESTFul api

// get /user 获取用户
// post /user 增加用户
// http

// * 206 返回部分数据

//     * curl  -v  --header "Range:bytes=3-6" www.baidu.com

// 服务器 监听一个指定端口IP
// http 模块是基于net 模块的

let http = require("http");
let server = http.createServer();

// server.on('connection',function (socket) {
//   // 比希望你直接操作socket header
//   // 在内部会将请求来的结果进行处理 处理一个req.还会通过socket实现一个res
//   // this.emit('request',req,res);
// });

// req代表的是客户端（可读流 on('data')）  res.write end 可写流
server.on("request", (req, res) => {
  // req是代表的客户端的请求，当客户端发过来数据后(请求体) 才会触发on('data')事件
  console.log(req.method);
  console.log(req.url);
  console.log(req.httpVersion);
  console.log(req.headers);
  req.setEncoding("utf8");
  // 发送请求体 post
  req.on("data", data => {
    console.log("data", data);
  });

  req.on("end", data => {
    console.log("end");
    res.statusCode = 204;
    res.end();
  });
});

server.listen(3000, () => {
  console.log("server start");
});
