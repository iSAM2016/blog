//  展示内容 缓存 压缩 范围请求  提示用户  发包
let http = require('http');

let util = require('util');
let url = require('url');
let zlib = require('zlib');
let fs = require('fs');
let path = require('path');
//第三方
let ejs = require('ejs'); // 模板引擎
let template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
let stat = util.promisify(fs.stat);
let readdir = util.promisify(fs.readdir);
let chalk = require('chalk'); // 粉笔
let mime = require('mime'); // 类型模块
let config = require('./config')
let debug = require('debug')('hello'); // 调试模块
class Server {
    constructor(command) {
        this.config = { ...config,
            ...command
        }
        this.template = template
    }
    async handleRequest(req, res) {
        // localhost:3000/index.html
        // 当前目录
        let {
            dir
        } = this.config;
        let {
            pathname
        } = url.parse(req.url)
        if (pathname === '/favicon.ico') {
            return res.end()
        }
        let filepath = path.join(dir, pathname);

        try {
            // 判断是路基还是文件夹
            let statObj = await stat(filepath)
            if (statObj.isDirectory()) {
                // 文件夹 读取文件夹下所有的内容
                let dirs = await readdir(filepath)
                dirs = dirs.map(_ => ({
                    name: _,
                    herf: path.join(filepath, _)
                }))
                let str = ejs.render(this.template, {
                    name: `Index of ${pathname}`,
                    arr: dirs
                });
                res.end(str);
            } else {
                // 文件
                this.sentFile(req, res, statObj, filepath)
            }
        } catch (error) {
            this.sentError(req, res)
        }
        // res.end()
    }
    cache(req, res, statObj, p) {
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Expires', new Date(Date.now() + 10 * 1000).getTime())
        let etage = statObj.ctime.getTime() + '-' + statObj.size;
        let lastModified = statObj.ctime.getTime();
        console.log(etage)
        // 设置两个参数
        res.setHeader('Etag', etage)
        res.setHeader('Last-Modified', lastModified)

        let ifNoneMatch = req.headers['if-none-match'];
        let ifModifiedSince = req.headers['if-modified-since'];
        if (etage !== ifNoneMatch && lastModified !== ifModifiedSince) {
            return false
        }
        return true
    }
    // 范围请求
    range(req, res, statObj, p) {
        let range = req.headers['range'];
        if (range) {
            let [, start, end] = range.match(/bytes=(\d*)-(\d*)/);
            start = start ? Number(start) : 0;
            end = end ? Number(end) : statObj.size - 1;
            res.statusCode = 206;
            res.setHeader('Content-Range', `bytes ${start}-${end}/${statObj.size - 1}`);
            fs.createReadStream(p, {
                start,
                end
            }).pipe(res);
        } else {
            return false;
        }
    }
    gzip(req, res, statObj, p) {
        let encoding = req.headers['accept-encoding'];
        if (encoding) {
            if (encoding.match(/\bgzip\b/)) {
                res.setHeader('Content-Encoding', 'gzip')
                return zlib.createGzip();
            }
            if (encoding.match(/\bdeflate\b/)) {
                res.setHeader('Content-Encoding', 'deflate')
                return zlib.createDeflate();
            }
            return false;
        } else {
            return false
        }
    }
    sentFile(req, res, statObj, filepath) {
        //  比较缓存
        if (this.cache(req, res, statObj, filepath)) {
            res.statusCode = 304;
            return res.end();
        }
        if (this.range(req, res, statObj, p)) {
            return false
        }
        res.setHeader('Content-Type', mime.getType(p) + ';charset=utf8');
        let transform = this.gzip(req, res, statObj, p)
        if (transform) { // 返回一个压缩后的压缩流
            return fs.createReadStream(p).pipe(transform).pipe(res);
        }
        fs.createReadStream(p).pipe(res);
    }
    sentError(req, res) {
        res.statusCode = 404;
        res.end('not fount');
        // this.start
    }
    start() {
        let server = http.createServer(this.handleRequest.bind(this))
        server.listen(this.config.port, this.config.host, () => {
            console.log(`server start http://${this.config.host}:${chalk.green(this.config.port)}`)
        })
    }

}

module.exports = Server