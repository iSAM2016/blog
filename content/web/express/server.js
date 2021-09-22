//  就是一个函数

let express = require('express');
var bodyParser = require('./body-parser')
let path = require('path')

//  express 内置了路由中间件件
// 中间件一般放在路由的上边

/**
 * body-parser 提供四种解析
 * JSON body parser
 * Raw body parser
 * Text body parser
 * URL-encoded form body parser
 */

let app = express(); // app 是监听函数
// console.log(bodyParser.json)
// create application/x-www-form-urlencoded parser
// app.use(bodyParser.urlencoded({
//     extended: false
// }))

// create application/json parser
var jsonParser = bodyParser.json()
// app.use(function (err, req, res, next) {
//     console.log(err);
//     // res.sendFile(path.resolve(__dirname, 'index.html'));
//     res.send({
//         name: 'isam'
//     });
// })

// POST /login gets urlencoded bodies
app.post('/urlencoded', function (req, res) {
    res.send(req.body)
})

app.post('/json', jsonParser, function (req, res) {
    res.send(req.body)
})
//  方法=》 路由 =》 handle
// app.get('/test', function (req, res) {
//     res.end('hom00e');
// });

// app.get('/user/:name/:id', function (req, res) {
//     res.end('post home');
// });
// //  路径参数路由， 在路径参数 /user/:name/:id  => /user/1/2 => {name:1,id:2} => req.params
// app.get('user/:name/:id', function (req, res) {
//     res.end(JSON.stringify(req.params));
// });
// app.all('*', function (req, res) {
//     res.end('post *');
// });


app.listen(3000);