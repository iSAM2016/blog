// l: 显示所有用户
// b: 我爱你 广播
// s:zs:我爱你
// r:zs
// xxx: 命令不存在

let net = require('net');
let clients = {
    //'唯一的值':{name:'匿名',socket:soclet}
};
let server = net.createServer(function(socket) {
    let key = socket.remoteAddress + socket.remotePort;
    clients[key] = {
        name: '匿名',
        socket
    };
    server.getConnections(() => {
        socket.write('欢迎来到聊天室:\r\n');
    });
    socket.setEncoding('utf8');
    socket.on('data', function(data) {
        data = data.replace('\r\n', '');
        let char = data.split(':');
        switch (char[0]) {
            case 'l':
                list(socket); // 把列表显示给当前的用户
                break;
            case 'b': // b:我爱你
                broadCast(key, char[1]);
                break;
            case 's': // s:zs:你好
                private(char[1], char[2], key);
                break;
            case 'r': // r:zs
                rname(socket, char[1], key);
                break;
            default:
                break;
        }
    });
});
// let c = { 'xxx': { name: 'zfpx',socket }, 'qqq': { name: 'zs' }}
function private(username, content, key) {
    let user = Object.values(clients).find(item => item.name == username);
    user.socket.write(`${clients[key].name}:${content}\r\n`);
}
function broadCast(key, content) {
    for (let k in clients) {
        if (k != key) {
            clients[k].socket.write(`${clients[key].name}:${content}\r\n`);
        }
    }
}
function rname(socket, newName, key) {
    clients[key].name = newName;
    socket.write(`恭喜:新的名字${newName}\r\n`);
}
function list(socket) {
    let userList = Object.values(clients)
        .map(item => item.name)
        .join('\r\n');
    socket.write(`当前用户列表\r\n${userList}\r\n`);
}
server.listen(3000);
