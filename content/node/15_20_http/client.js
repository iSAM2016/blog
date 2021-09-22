let http = require('http');
let ops = {
    host: 'localhost',
    port: 3000,
    path: '/hello',
    headers: {
        a: 1,
        'Content-Type': 'x-www-form-urlencoded',
        'Content-Length': 3
    }
};
let client = http.request(ops, res => {
    res.on('data', data => {
        console.log(data);
    });
});

client.end('a=1');
