#! /usr/bin/env node

let Server = require('../src/index.js')
let commander = require('commander');
let os = require('os');

let {
    version
} = require('../package.json');

commander
    .option('-p,--port <n>', 'config port')
    .option('-o,--host [value]', 'config hostname')
    .option('-d,--dir [value]', 'config directory')
    .version(version, '-v,--version').parse(process.argv);


let server = new Server(commander);
server.start() // 开启服务

let config = require('../src/config');
commander = { ...config,
    ...commander
}
// 操作系统不同 打开web服务的方式就不同
// 再我们的服务中 启动一个子进程 执行一条命令

let os = require('os');
let {
    exec
} = require('child_process')
if (os.platform() === 'win32') {
    exec(`start http://${commander.host}:${commander.port}`);
} else {
    exec(`open http://${commander.host}:${commander.port}`);
}