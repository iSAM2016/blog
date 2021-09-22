let express = require('express');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../../../')));

// create application/x-www-form-urlencoded parser
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

let userList = [{
        username: 'admin',
        password: 'admin',
        money: 10
    },
    {
        username: 'root',
        password: 'root',
        money: 50
    }
];

let SESSION_ID = 'connect.sid';
let session = {};

app.post('/api/login', function (req, res) {
    let {
        username,
        password
    } = req.body;
    let user = userList.find(
        user => user.username === username && user.password === password
    );
    if (user) {
        let cardId = Math.random() + Date.now();
        res.cookie(SESSION_ID, cardId);
        session[cardId] = user;
        res.json({
            code: 0
        });
    } else {
        res.json({
            code: 0,
            error: '用户不存在'
        });
    }
});
app.get('/welcome', function (req, res) {
    /****
     * 反射型 xss-form
     */
    // res.send(`${req.query.type}`);
    res.send(`${encodeURIComponent(req.query.type)}`);
});
let comment = [{
    username: 'isam2016',
    connect: 'content'
}];
app.get('/api/list', function (req, res) {
    res.json({
        code: 0,
        comment
    });
});

app.post('/api/addComment', function (req, res) {
    if (true) {
        //  登陆过
        comment.push({
            connect: req.body.content
        });
        res.json({
            code: 0
        });
    }
});

app.get('/api/userinfo', function (req, res) {
    let user = session[req.cookies[SESSION_ID]] || {};
    if (user) {
        res.json({
            code: 0,
            user: {
                username: user.username,
                money: user.money
            }
        });
    } else {
        res.json({
            code: 1,
            error: ' 用户未登录'
        });
    }
});


app.post('/api/transfer', function (req, res) {
    let user = session[req.cookies[SESSION_ID]] || {};
    console.log(user)
    console.log(req.body)
    if (user) {
        let {
            target,
            money
        } = req.body;
        money = Number(money);
        userList.forEach(u => {
            if (u.username === user.username) {
                u.money -= money;
            }
            if (u.username === target) {
                u.money += money;
            }
        })
        res.json({
            code: 1,
            error: '转账成功'
        });
    } else {
        res.json({
            code: 0,
            error: '用户不存在'
        });
    }
});
app.listen(3000);