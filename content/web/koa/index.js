/**
 * express 使用的es5
 * koa 是es6
 *
 * app 就是监听函数
 * use 实现中间件函数
 * ctx 是基于req 和 res  原生的
 * 并且扩展了两个属性(request,response) 扩展的
 *
 * koa 可以解决异步问题
 * await 是返回promised next处理的是下一个 中间件的函数
 *
 */
const fs = require('fs')
const path = require('path')
// const Koa = require('koa');
const Koa = require('./src/application');
const app = new Koa();
let log = function () {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log('log');
            resolve();
        }, 1000);
    });
};

//  一般情况下我么会在，回调和next 前边加 await，因为如果没有他们直接就是（Promise.resolve）执行完成，执行then
// app.use((ctx, next) => {
//     console.log(1);
//     next(); // 如果next 后边没有逻辑则写return
//     console.log(2);
// });
// app.use(async (ctx, next) => {
//     await log();
//     console.log(2);
//     next();
// });
app.use(async (ctx, next) => {
    // ctx.body = {
    //     name: 90
    // }
    ctx.body = fs.createReadStream(path.join(__dirname, 'index.html'));
});
// app.use((ctx) => {
//     console.log(ctx.req.url);
//     console.log(ctx.request.req.url);
//     console.log(ctx.request.url);
//     // ctx.path代理了 ctx.request.path;
//     console.log(ctx.path);
//     console.log(ctx.query);

//     ctx.response.body = 'hello'; // ctx.response.body = '123'
//     console.log(ctx.body)
// });
app.listen(3000);

/******************************************* reduc 解决中间件 */
//  fn 返回函数
//  next 是一个函数， 实际就是返回一个promise
// 数据从左往右扫描【a,b,c】
// let fns = app.middleware.reduce((a, b) => {
//     //  返回ab 合并的函数
//     return function (...args) {
//         // 扩展是这里
//         return a(() => b(...args));
//     };
// });

/*****
 * 最终结果 
 // let a = app.middleware[0]
 //let b = app.middleware[1]
 //let c = app.middleware[2]
 //let midd = (...args) => (a(() => b(...args)))
 //let fn = (...args) => (midd(() => c(...args)));
 */
/******************************************* 计数器 解决中间件 */
//
// function dispatch(index) {
//     let route = app.middleware.length;
//     if (index === app.middleware.length) {
//         return () => {}
//     }
//     route(() => {
//         dispatch(index + 1)
//     })
// }
// dispatch(0)