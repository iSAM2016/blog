// cookies
// 设置cookie
// 1. 浏览器设置
// 2. 服务器设置

//  不能跨域设置cookie
//  一级二级域名可以共用cookie

//  流
const querystring = require('querystring');
const http = require('http');
const crypto = require('crypto');

const client = http
    .createServer((req, res) => {
        // 设置cookie 和读取cookie
        req.cookies = querystring.parse(req.headers['cookie'], '; ', '='); // key-value
        // 防止篡改cookie
        req.signedCookie = (key) => {
            let [k, sign] = (key.cookies[key] || '').split('.');
            let newsign = crypto
                .createHmac('sha256', 'zfpx')
                .update(k)
                .digest('base64')
                .replace(/\+/g, '');
            if (newsign == sign) {
                return k;
            } else {
                return '';
            }
        };
        console.log(req.cookies);
        let arr = [];

        res.setCookie = (key, value, ops = {}) => {
            if (ops.sign) {
                // 签名
                value =
                    value +
                    '.' +
                    crypto
                        .createHmac('sha256', 'zfpx')
                        .update(value)
                        .digest('base64')
                        .replace(/\+/g, '');
            }
            let str = `${key}=${value}`;
            if (ops.maxAge) {
                str += `; max-age=${ops.maxAge}`;
            }
            if (ops.httpOnly) {
                str += `; httpOnly`;
            }
            arr.push(str);
            res.setHeader('Set-cookie', arr);
        };

        if (req.url === '/read') {
            // res.end(req.headers['cookie']);
            res.end(req.signedCookie('name'));
        }
        if (req.url === '/write') {
            //  前端是可以获取的
            // res.setHeader('Set-Cookie', ['name=isam; max-age=10', 'age=10']);
            // res.setHeader('Set-Cookie', ['name=zfpx; max-age=1000; domain=.zf1.cn', 'age=20'])
            //  前端不能获取
            // res.setHeader('Set-Cookie', 'name=isam2016; httpOnly')
            res.setCookie('name', 'isam2019', {
                // maxAge: 10,
                sign: true,
            });
            res.end();
        }
    })
    .listen(3000);
