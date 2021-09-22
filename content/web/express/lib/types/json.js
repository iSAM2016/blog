let url = require('url');

module.exports = json;

function json(options) {
    var opts = options || {};
    function parse(body) {
        try {
            return JSON.parse(body);
        } catch (e) {
            throw Error('error');
        }
    }

    return function jsonParser(req, res, next) {
        let { pathname, query } = url.parse(req.url, true);
        console.log('pathname' + pathname);
        req.body = req.body || {};

        // 存储数据的数组
        let buffers = [];

        req.on('data', function(data) {
            console.log(data);
            // 接收数据并存入数组中
            buffers.push(data);
        });

        req.on('end', function() {
            // 组合数据并转换成字符串
            let result = Buffer.concat(buffers).toString();

            req.body = JSON.parse(result);
            next(); // 向下执行
        });

        // 错误处理
        req.on('err', function(err) {
            next(err);
        });
        // read
        // read(
        //     req,
        //     res,
        //     next,
        //     parse,
        //     {},
        //     {
        //         encoding: charset,
        //         inflate: inflate,
        //         limit: limit,
        //         verify: verify
        //     }
        // );
    };
}
