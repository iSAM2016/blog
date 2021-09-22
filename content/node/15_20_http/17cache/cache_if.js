/**
 * html 是不被缓存的，200 ，会出现304 缓存
 */
let http = require("http");
let url = require("url");
const path = require('path');
let fs = require('fs')
const {
    promisify
} = require("util");
let stat = promisify(fs.stat);
let server = http.createServer(async (req, res) => {
    try {
        let {
            pathname,
            query
        } = url.parse(req.url, true);
        //  强制缓存
        // res.setHeader('Cache-Control', 'max-age=4') // 相对时间 秒
        // res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString()); // 绝对时间 毫秒
        // 协商缓存 是查看文件修改的时间,但是文件属性变动了，但是文件内容没有变动，可以使用摘要
        //  Last-modified  if-modified-since
        // Etag  if-none-match
        res.setHeader('Cache-Control', 'no-cache');

        let realPath = path.join(__dirname, "public", pathname);
        console.log(realPath)
        let statObj = await stat(realPath);
        if (statObj.isDirectory()) {
            //   文件夹
            let p = path.join(realPath, "index.html");
            let stateObj = await stat(p);
            res.setHeader('Last-Modified', stateObj.ctime.toGMTString()) // 
            if (req.headers['if-modified-since'] === stateObj.ctime.toGMTString()) {
                res.statusCode = 304;
                res.end();
                return;
            }
            fs.createReadStream(p).pipe(res);
        } else {
            console.log('fle')
            res.setHeader('Last-Modified', statObj.ctime.toGMTString()) // 
            if (req.headers['if-modified-since'] === statObj.ctime.toGMTString()) {
                res.statusCode = 304;
                res.end();
                return;
            }
            // 文件，读取对应的文件直接返回即可
            fs.createReadStream(realPath).pipe(res);
        }
    } catch (error) {
        //  没有找到文件
        res.statusCode = 404;
        res.end("not foud");
    }
});

server.listen(3000);