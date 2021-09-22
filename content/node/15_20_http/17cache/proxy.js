// 正向代理 科学上网 反向代理 nginx
// 正向代理 我们客户端配置的
// 反向代理 cdn 实现
// 反向代理 webpack proxyTable 典型的反向代理
// ngix 典型的反向代理
// 虚拟主机 www.zf1.cn  localhost:3001
// 虚拟主机 www.zf2.cn  localhost:3002
// http-proxy http-proxy-middleware

// 反向的例子
let http = require('http');
let httpProxy = require('http-proxy');
let proxyServer = httpProxy.createProxy();
let map = {
    'www.zf1.cn': 'http://localhost:3001',
    'www.zf2.cn': 'http://localhost:3002'
};
http.createServer(function(req, res) {
    let target = req.headers['host'];
    proxyServer.web(req, res, {
        target: map[target]
    }); // 将代理的网站的结果 返回给我自己的服务
}).listen(80);
/********************************************正向代理 */
// 我们先访问自己的服务器 80
// 我们的服务器其实是想代理到3001的服务器上
// 80 不能直接访问3001
// 代理服务器可能需要加一个凭证才能访问3001

// 80 才能访问3000

let http = require('http');
let proxy = require('http-proxy');
let httpProxy = proxy.createProxyServer();
http.createServer(function(req, res) {
    httpProxy.on('proxyReq', function(proxyReq, req, res, options) {
        proxyReq.setHeader('key', 'zfpx');
    });
    httpProxy.web(req, res, {
        target: 'http://localhost:3001'
    });
}).listen(80);
// 这个是我们的服务
