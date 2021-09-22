// const Koa = require('koa');
const Koa = require('./src/application');
const app = new Koa();
let log = function() {
    return new Promise(function(resolve, reject) {
        setTimeout(() => {
            console.log('log');
            resolve();
        }, 1000);
    });
};

app.use(async (ctx, next) => {
    console.log(1);
    /****
     * 对应的 app 处理代码是
     * function dispatch(index) {
            if (index === middlewares.length) {
                return () => {};
            }
            let fn = middlewares[index];
            return fn(ctx, () => dispatch(++index));
        }
        dispatch(0);
    }*/

    // await 是返回promised(实际就是promise 中等待着另一个promise) ，next处理的是下一个 中间件的函数,
    // 如果一个promise 中等待着另一个promise ，会等待这个promise 成功或者失败才继续执行
    // next 函数 如果没有return（return fn(ctx, () => dispatch(++index))） 其实是一()=>dispatch(index+1) => void(0) 则  1 3 2 logger 则 await void()0 ;await失效
    await next();
    console.log(2);
});
app.use(async (ctx, next) => {
    console.log(3);
    await log();
    console.log(4);
});
app.listen(3000);
