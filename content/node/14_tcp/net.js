//  net 核心模块，tcp 服务
//  http 继承了net 模块
//  websocket net 模块

// 双工流就是同时实现了 Readable 和 Writable 的流，即可以作为上游生产数据，又可以作为下游消费数据，
// 这样可以处于数据流动管道的中间部分，即
let net = require('net');
//  一个完整的事物有请求和响应
let server = net.createServer();
//  socket 是一个双工流

server.on('connection', socket => {
    socket.setEncoding('utf8');
    socket.on('data', data => {
        console.log(data);
    });
    socket.write(
        `HTTP/1.1 200 OK
        Content-Type: text/html
        Content-Length: 2

        ok`
    );
});

server.listen(3000);

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        server.listen(3001);
    }
})