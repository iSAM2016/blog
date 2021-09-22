let net = require('net');
let server = net.createServer();
let client = [];
server.on('connection', (socket) => {
    client.push(socket)
    server.getConnections((err, count) => {
        socket.write(`当前的聊天室可以容纳${server.getMaxListeners()},你是当前的第${count}`)
    })
    socket.setEncoding('utf8');
    socket.on('data', (data) => {
        console.log(data)
        data = data.replace('\r\n', '');
        // server.close() // 不允许新进来的链接，只有调用close 时候才会触发
        client.forEach(s => {
            if (s == socket) return;
            s.write(data);
        });
    })
    socket.on('end', () => {
        client = client.filter(_ => _ != socket);
    })
})
//  最大连接数
server.on('close', () => {
    console.log('close')
})
server.maxConnections = 3
server.listen(3000)

// 服务器关闭
// server.close(); //不允许新进来的链接 只有调用close时才会触发关闭
// server.unref(); // 关闭 当饭店最后一个人离开了 就会关闭