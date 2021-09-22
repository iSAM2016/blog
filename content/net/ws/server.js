//  就是一个函数
let express = require('express');
let path = require('path');
let SseStream = require('ssestream');

let app = express(); // app 是监听函数
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../../../')));

app.get('/getinfor', function (req, res) {
    let trem = setInterval(() => {
        let data = new Date();
        let second = data.getSeconds();
        if (second % 5 === 0) {
            res.send({
                code: 0,
                message: 12
            });
            clearInterval(trem);
        }
    }, 1000);
});

app.get('/clock', function (req, res) {
    setInterval(function () {
        res.write(`
            <script> 
                parent.document.getElementById('clock').innerHTML = "${new Date().toLocaleTimeString()}"
            </script>
        `);
    }, 1000);
});
let sendCount = 1;

//  evetSource
//  不能跨域
app.get('/eventSource', function (req, res) {
    const sseStream = new SseStream(req);
    sseStream.pipe(res);
    const pusher = setInterval(() => {
        sseStream.write({
            id: sendCount++,
            event: 'message',
            retry: 20000, // 告诉客户端,如果断开连接后,20秒后再重试连接
            data: {
                ts: new Date().toTimeString()
            }
        });
    }, 2000);
    res.on('close', () => {
        clearInterval(pusher);
        sseStream.unpipe(res);
    });
});
// websocket

// let WebSockerServer = require('ws').Server;
// let server = new WebSockerServer({
//     port: 8888
// })
// server.on('connection', function (socket) {
//     console.log('2 服务端监听');
//     socket.on('message', function (message) {
//         console.log('4 客户端接过来的消息', message);
//         socket.send('5 服务器说' + message)
//     })
// })


app.listen(3000);