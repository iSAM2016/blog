let http = require('http');
let path = require('path');
let fs = require('fs');
let {
    promisify
} = require('util');


let stat = promisify(fs.stat);
let url = require('url');
let crypto = require('crypto');

let server = http.createServer(async function (req, res) {
    let {
        pathname,
        query
    } = url.parse(req.url, true);
    let readPath = path.join(__dirname, 'public', pathname);
    try {
        let statObj = await stat(readPath);
        res.setHeader('Cache-Control', 'no-cache');
        // res.setHeader('Cache-Control', 'max-age=2000')

        if (statObj.isDirectory()) {
            let p = path.join(readPath, 'index.html');
            let statObj = await stat(p);

            // 我要根据文件内容 生成一个md5的摘要 最耗性能 ，给实体加一个标签
            let rs = fs.(p);
            let md5 = crypto.createHash('md5'); // 不能写完相应体在写头
            let arr = [];
            rs.on('data', function (data) {
                md5.update(data);
                arr.push(data);
            });
            rs.on('end', function () {
                let r = md5.digest('base64');
                res.setHeader('Etag', r);
                if (req.headers['if-none-match'] === r) {
                    res.statusCode = 304;
                    res.end();
                    return;
                }
                res.end(Buffer.concat(arr));
            })
        } else {
            let rs = fs.createReadStream(readPath);
            let md5 = crypto.createHash('md5'); // 不能写完相应体在写头
            let arr = [];
            rs.on('data', function (data) {
                md5.update(data);
                arr.push(data);
            });
            rs.on('end', function () {
                let r = md5.digest('base64');
                res.setHeader('Etag', r);
                if (req.headers['if-none-match'] === r) {
                    res.statusCode = 304;
                    res.end();
                    return;
                }
                res.end(Buffer.concat(arr));
            })
        }
    } catch (e) {
        res.statusCode = 404;
        res.end(`Not found`);
    }
}).listen(3000);

// 强制缓存 Cache-Control Expires
// Last-Modified if-modified-since
// Etag if-none-match