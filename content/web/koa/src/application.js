//引入依赖
let http = require('http');
let EventEmitter = require('events');
let request = require('./request');
let response = require('./response');
let context = require('./context');
let Stream = require('stream');
class Koa extends EventEmitter {
    constructor() {
        super();
        this.middlewares = [];
        this.context = Object.create(context);
        this.response = Object.create(response);
        this.request = Object.create(request);
    }
    // 中间件
    use(fn) {
        this.middlewares.push(fn);
    }
    // 创建上下文
    createContext(req, res) {
        // 上下文就是一个对象而已
        let ctx = this.context;
        // ctx上拥有两个自定义的属性 request response
        ctx.request = this.request;
        ctx.response = this.response;
        // req和res是自己身上的
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }

    //  返回一个promise
    //  next 相当于 () => dispatch(++index)
    //  处理了promise 的逻辑
    compose(ctx, middlewares) {
        function dispatch(index) {
            //  当遍历达到上限，返回空 promise， 完整promise链条执行结束
            if (index === middlewares.length) {
                return Promise.resolve();
            }
            let fn = middlewares[index];
            //  1.把 上下文一路传送下去给中间件 ctx
            //  2。将 middleware 中的下一个中间件 fn  作为当前 next 的值
            //  我们有的中间件是写async，返回的promise.但也有可能是普通函数。 我们希望中间件执行完之后再，在取出ctx.body 把结果相应出去,需要考虑普通函数情况下，我们要嵌套promise.resolve
            return Promise.resolve(fn(ctx, () => dispatch(++index)));
        }
        return dispatch(0);
        // function dispatch(index) {
        //     if (index === middlewares.length) {
        //         return () => {};
        //     }
        //     let fn = middlewares[index];
        //     return fn(ctx, () => dispatch(++index));
        // }
        // dispatch(0);
    }
    //  对req 进行封装, createServer 监听函数
    handleRequest(req, res) {
        let ctx = this.createContext(req, res);
        // 把函数组合起来
        let p = this.compose(
            ctx,
            this.middlewares
        );
        p.then(() => {
            let body = ctx.body; // 当所有的函数都执行完后取出body的值，响应回去即可
            console.log(typeof body);
            if (body instanceof Stream) {
                body.pipe(res);
            } else if (typeof body === 'number') {
                res.setHeader('Content-Type', 'text/plain;charset=utf8');
                res.end(body.toString());
            } else if (typeof body === 'object') {
                res.setHeader('Content-type', 'application/json;charset=utf8');
                res.end(JSON.stringify(body));
            } else if (typeof body === 'string' || Buffer.isBuffer(body)) {
                res.setHeader('Content-Type', 'text/plain;charset=utf8');
                res.end(body);
            } else {
                res.end('not found');
            }
        }).catch(err => {
            this.emit('error', err);
        });
    }
    //  监听端口
    listen(...args) {
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
    }
}

module.exports = Koa;
