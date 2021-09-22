let http = require('http');
let methods = ['get', 'post', 'all'];
let url = require('url');
let util = require('util');
let fs = require('fs');

//  可以使用express 中间件来处理相同的逻辑
//  中间件特点：next 1. 决定是否向下执行， 2.req,res进行扩展（的属性） 3.常见的权限校验
function Application() {
    //  express 最常用的是向 req res 添加东西
    function app(req, res) {
        let method = req.method.toLowerCase();
        let { pathname, query } = url.parse(req.url, true);

        req.path = pathname;
        req.reqry = query;
        req.hostname = req.headers.host.split(':')[0];
        // 计数器
        index = 0;

        function next(error) {
            let layer = app.routes[index++];
            console.log('path' + req.path);
            //  没有路由错误
            if (layer) {
                if (error) {
                    //  如果有错误，需要走错误接口
                    if (
                        layer.method === 'middle' &&
                        layer.handler.length === 4
                    ) {
                        return layer.handler(error, req, res, next);
                    } else {
                        next(error);
                    }
                } else {
                    //  中间件 把控制权交给用户
                    if (layer.method === 'middle') {
                        // 中间件要匹配路径   1. /user  /user  2./user /  3. /user/b  /user
                        if (
                            layer.pathname === '/' ||
                            req.path === layer.pathname + '/' ||
                            req.path === layer.pathname
                        ) {
                            //  把控制交给了用户（实际上是吧next 给了用户）
                            return layer.handler(req, res, next);
                        } else {
                            next();
                        }
                    } else {
                        // 非中间件
                        //  如果有参数的
                        if (layer.params) {
                            if (
                                layer.method === method &&
                                layer.reg.test(req.path)
                            ) {
                                // 匹配路径
                                // 提取参数，传给req
                                let [, ...args] = pathname.match(layer.reg);
                                req.params = layer.params.reduce(
                                    (momeo, key, index) => (
                                        (momeo[key] = args[index]), momeo
                                    ),
                                    {}
                                );
                                return layer.handler(req, res);
                            }
                        }
                        if (
                            (layer.pathname === req.path ||
                                layer.pathname === '*') &&
                            (layer.method === method || layer.method === 'all')
                        ) {
                            return layer.handler(req, res);
                        }
                        next();
                    }
                }
            } else {
                // 当都没有匹配到方法
                res.end(`cannot ${pathname} ${method}`);
            }
        }
        //  首次执行
        next();
    }
    app.routes = [];
    // 批量生产各种方法
    methods.forEach(method => {
        app[method] = function(pathname, handler) {
            let layer = {
                method,
                pathname,
                handler
            };
            let key = [];
            //  如果包含是多参数路由
            if (pathname.includes(':')) {
                layer.reg = new RegExp(
                    // [^/]匹配是一个非/的字符
                    pathname.replace(/:([^/]*)/g, function() {
                        key.push(arguments[1]);
                        return '([^/]*)';
                    })
                );
                layer.params = key;
            }
            app.routes.push(layer);
        };
    });
    // 中间件
    app.use = (pathname, handler) => {
        // 如果 handler 为void  说明 pathname 为 函数
        if (typeof handler !== 'function') {
            handler = pathname;
            pathname = '/';
        }
        let layer = {
            method: 'middle',
            pathname,
            handler
        };
        app.routes.push(layer);
    };
    app.all = function(pathname, handler) {
        let layer = {
            method: 'all', // 匹配所有的方法
            pathname,
            handler
        };
        app.routes.push(layer);
    };
    // express  内置了一个扩展， req 和res 中间间
    app.use(function(req, res, next) {
        res.send = function(params) {
            res.setHeader('Content-Type', 'text/html;charset=utf8');
            if (typeof params === 'object') {
                res.setHeader('Content-Type', 'application/json;charset=utf8');
                res.end(util.inspect(params));
            } else if (typeof params === 'number') {
                res.statusCode = params;
                res.end(require('_http_server').STATUS_CODES[params]);
            } else {
                res.end(params);
            }
        };
        res.sendFile = function(pathname) {
            res.setHeader(
                'Content-Type',
                require('mime').getType(pathname) + ';charset=utf8'
            );
            fs.createReadStream(pathname).pipe(res);
        };

        next();
    });
    app.listen = function(...args) {
        let client = http.createServer(app);
        client.listen(...args);
    };
    return app;
}

Application.static = function(pathname) {
    return function(req, res, next) {
        let realPath = path.join(pathname, req.path);
        fs.stat(realPath, function(err, statObj) {
            if (err) {
                next();
            } else {
                if (statObj.isDirectory) {
                } else {
                    res.sendFile(realPath);
                }
            }
        });
    };
};

module.exports = Application;
