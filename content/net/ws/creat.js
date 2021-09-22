//  实现 http  请求
let net = require('net');
//  一个完整的事物有请求和响应
let server = net.createServer();
const crypto = require('crypto');
const CODE = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
//  socket 是一个双工流
server.on('connection', socket => {
    socket.setEncoding('utf8');
    socket.on('data', data => {
        //  match 为字符串的方法
        //  exec 为正则表达式的方法
        data = data.toString();
        //  需要将字符串转换化为 对象存储, 每一行 有/r/n
        if (data.match(/Connection: Upgrade/)) {
            // 是升级协议
            let rows = data.split('\r\n');
            let header = {};
            rows.reduce((mome, _) => {
                let [key, value] = _.split(': ');
                return mome[key] = value, mome;
            }, header)
            //  获取请求头版本，判断是否升级版本
            if (header['Sec-WebSocket-Version'] == 13) {
                let wskey = header['Sec-WebSocket-Key'];
                let acceptKey = crypto.createHash('sha1').update(wskey + CODE).digest('base64')
                let response = [
                    'HTTP/1.1 101 Switching Protocols',
                    'Upgrade: websocket',
                    `Sec-WebSocket-Accept: ${acceptKey}`,
                    'Connection: Upgrade',
                    '\r\n'
                ].join('\r\n');
                console.log(response)
                socket.write(response);
            }
        }


    });
    // socket.write(
    //     `HTTP/1.1 200 OK
    //     Content-Type: text/html
    //     Content-Length: 2

    //     ok`
    // );
});
server.listen(8888);

/*****
 * 请求体
 GET / HTTP/1.1
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: fWlMAnRUFIJAxQpwMNMpxQ==
\r\n
\r\n(固定格式)
 */