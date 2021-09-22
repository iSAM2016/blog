-   [问题](#%E9%97%AE%E9%A2%98)
    -   [mysql 的缺点、 mongoos 的 缺钱](#mysql-%E7%9A%84%E7%BC%BA%E7%82%B9-mongoos-%E7%9A%84-%E7%BC%BA%E9%92%B1)
    -   [webworker 工作线程](#webworker-%E5%B7%A5%E4%BD%9C%E7%BA%BF%E7%A8%8B)
-   [0.Async](#0async)
    -   [1.异步](#1%E5%BC%82%E6%AD%A5)
    -   [2 高阶函数](#2-%E9%AB%98%E9%98%B6%E5%87%BD%E6%95%B0)
    -   [异步编程的语法目标，就是怎样让它更像同步编程,有以下几种](#%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B%E7%9A%84%E8%AF%AD%E6%B3%95%E7%9B%AE%E6%A0%87%E5%B0%B1%E6%98%AF%E6%80%8E%E6%A0%B7%E8%AE%A9%E5%AE%83%E6%9B%B4%E5%83%8F%E5%90%8C%E6%AD%A5%E7%BC%96%E7%A8%8B%E6%9C%89%E4%BB%A5%E4%B8%8B%E5%87%A0%E7%A7%8D)
    -   [5 回调的问题](#5-%E5%9B%9E%E8%B0%83%E7%9A%84%E9%97%AE%E9%A2%98)
        -   [5.1 异常处理](#51-%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86)
        -   [5.2 回调地狱 异步多级依赖的情况下嵌套非常深，代码难以阅读的维护](#52-%E5%9B%9E%E8%B0%83%E5%9C%B0%E7%8B%B1-%E5%BC%82%E6%AD%A5%E5%A4%9A%E7%BA%A7%E4%BE%9D%E8%B5%96%E7%9A%84%E6%83%85%E5%86%B5%E4%B8%8B%E5%B5%8C%E5%A5%97%E9%9D%9E%E5%B8%B8%E6%B7%B1%E4%BB%A3%E7%A0%81%E9%9A%BE%E4%BB%A5%E9%98%85%E8%AF%BB%E7%9A%84%E7%BB%B4%E6%8A%A4)
    -   [6. 异步流程解决方案](#6-%E5%BC%82%E6%AD%A5%E6%B5%81%E7%A8%8B%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88)
        -   [6.1 事件发布/订阅模型](#61-%E4%BA%8B%E4%BB%B6%E5%8F%91%E5%B8%83%E8%AE%A2%E9%98%85%E6%A8%A1%E5%9E%8B)
        -   [6.2 哨兵变量](#62-%E5%93%A8%E5%85%B5%E5%8F%98%E9%87%8F)
        -   [6.3 Promise/Deferred 模式](#63-promisedeferred-%E6%A8%A1%E5%BC%8F)
        -   [6.4 生成器 Generators/ yield](#64-%E7%94%9F%E6%88%90%E5%99%A8-generators-yield)
            -   [6.4.1 生成器的使用](#641-%E7%94%9F%E6%88%90%E5%99%A8%E7%9A%84%E4%BD%BF%E7%94%A8)
            -   [6.4.2 co](#642-co)
    -   [async/await](#asyncawait)
        -   [6.5.1 Async 的优点](#651-async-%E7%9A%84%E4%BC%98%E7%82%B9)
        -   [6.5.2 async 函数的实现](#652-async-%E5%87%BD%E6%95%B0%E7%9A%84%E5%AE%9E%E7%8E%B0)
-   [vscode 调试](#vscode-%E8%B0%83%E8%AF%95)

# 问题

## 0.Async

### 1.异步

-   所谓"异步"，简单说就是一个任务分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段,比如，有一个任务是读取文件进行处理，异步的执行过程就是下面这样。

    ![]('../../img/asyncfunc1.png')

*   这种不连续的执行，就叫做异步。相应地，连续的执行，就叫做同步。

### 2 高阶函数

> 高阶函数作为一等公民，可以作为参数和返回值

-   2.1 可以用于生成批量函数

```js
let toString = Object.prototype.toString;
let isString = function(obj) {
    return toString.call(obj) == `[object String]`;
};
let isFunction = function(obj) {
    return toString.call(obj) == `[object Function]`;
};
let isType = function(type) {
    return function(obj) {
        return toString.call(obj) == `[object ${type}]`;
    };
};
```

-   2.2 可以用于需要调用多次才执行的函数

```js
let after = function(times, task) {
    return function() {
        if (times-- == 1) {
            return task.apply(this, arguments);
        }
    };
};
let fn = after(3, function() {
    console.log(3);
});
fn();
```

### 异步编程的语法目标，就是怎样让它更像同步编程,有以下几种

-   回调函数实现
-   事件监听
-   发布订阅
-   promise/A+ 和生成器函数
-   async/await

### 5 回调的问题

#### 5.1 异常处理

```js
try {
} catch (e) {}
```

异步代码中`try cache` 不在生效

```js
let async = function(callback) {
    try {
        setTimeout(function() {
            callback();
        }, 1000);
    } catch (e) {
        console.log('捕获错误', e);
    }
};

async(function() {
    console.log(t);
});
```

因为这个回调函数被存放了起来，直到下一个事件环的时候才会取出,try 只能捕获当前循环内的异常，对 callback 异步无能为力。

Node 在处理异常有一个约定，将异常作为回调的第一个实参传回，如果为空表示没有出错。

```js
async(function(err, callback) {
    if (err) {
        console.log(err);
    }
});
```

异步方法也要遵循两个原则

-   必须在异步之后调用传入的回调函数
-   如果出错了要向回调函数传入异常供调用者判断

```js
let async = function(callback) {
    try {
        setTimeout(function() {
            if (success) callback(null);
            else callback('错误');
        }, 1000);
    } catch (e) {
        console.log('捕获错误', e);
    }
};
```

#### 5.2 回调地狱 异步多级依赖的情况下嵌套非常深，代码难以阅读的维护

```js
let fs = require('fs');
fs.readFile('template.txt', 'utf8', function(err, template) {
    fs.readFile('data.txt', 'utf8', function(err, data) {
        console.log(template + ' ' + data);
    });
});
```

### 6. 异步流程解决方案

#### 6.1 事件发布/订阅模型

```js
let fs = require('fs');
let EventEmitter = require('events');
let eve = new EventEmitter();
let html = {};

eve.on('ready', function(key, value) {
    html[key] = value;
    if (Object.keys(html).length === 1) {
        console.log(html);
    }
});

function render() {
    fs.readFile('info.md', 'utf8', function(err, template) {
        eve.emit('ready', 'template', template);
    });
}

render();
```

#### 6.2 哨兵变量

```js
let after = function(times, callback) {
    let result = {};
    return function(key, value) {
        result[key] = value;
        if (Object.keys(result).length == times) {
            callback(result);
        }
    };
};

let done = after(1, function(result) {
    console.log(result);
});

function render() {
    fs.readFile('info.md', 'utf8', function(err, template) {
        done('ready', template);
    });
}

render();
```

#### 6.3 Promise/Deferred 模式

#### 6.4 生成器 Generators/ yield

-   当你执行一个函数到时候，你可在某个点暂停执行，并且做一些其他工作，然后在返回这个函数接续执行,甚至带一些新的参数。然后继续执行
-   上面描述的场景正是 JavaScript 生成器函数所致力于解决的问题。当我们调用一个生成器函数的时候，它并不会立即执行， 而是需要我们手动的去执行迭代操作（next 方法）。也就是说，你调用生成器函数，它会返回给你一个迭代器。迭代器会遍历每个中断点。
-   next 方法返回值的 value 属性，是 Generator 函数向外输出数据；next 方法还可以接受参数，这是向 Generator 函数体内输入数据

##### 6.4.1 生成器的使用

```js
function* foo() {
    var index = 0;
    while (index < 2) {
        yield index++; //暂停函数执行，并执行yield后的操作
    }
}
var bar = foo(); // 返回的其实是一个迭代器

console.log(bar.next()); // { value: 0, done: false }
console.log(bar.next()); // { value: 1, done: false }
console.log(bar.next()); // { value: undefined, done: true }
```

##### 6.4.2 co

`co`是一个为`Node.js`和浏览器打造的基于生成器的流程控制工具，借助于 Promise，你可以使用更加优雅的方式编写非阻塞代码。

```js
let fs = require('fs');
function readFile(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
}
function* read() {
    let template = yield readFile('./template.txt');
    let data = yield readFile('./data.txt');
    return template + '+' + data;
}
co(read).then(
    function(data) {
        console.log(data);
    },
    function(err) {
        console.log(err);
    }
);
```

```js
function co(gen) {
    let it = gen();
    return new Promise(function(resolve, reject) {
        !(function next(lastVal) {
            let { value, done } = it.next(lastVal);
            if (done) {
                resolve(value);
            } else {
                value.then(next, reason => reject(reason));
            }
        })();
    });
}
```

### async/await

使用 async 关键字，你可以轻松地达成之前使用生成器和 co 函数所做到的工作

#### 6.5.1 Async 的优点

-   内置执行器
-   更好的语义
-   更广的适用性

```js
let fs = require('fs');
function readFile(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

async function read() {
    let template = await readFile('./template.txt');
    let data = await readFile('./data.txt');
    return template + '+' + data;
}
let result = read();
result.then(data => console.log(data));
```

#### 6.5.2 async 函数的实现

async 函数的实现，就是将 Generator 函数和自动执行器，包装在一个函数里。

```js
async function read() {
    let template = await readFile('./template.txt');
    let data = await readFile('./data.txt');
    return template + '+' + data;
}

// 等同于
function read() {
    return co(function*() {
        let template = yield readFile('./template.txt');
        let data = yield readFile('./data.txt');
        return template + '+' + data;
    });
}
```

## vscode 调试

# promise 实现

[](https://juejin.im/post/5affc3976fb9a07aab2a1dc6)

```js
function Promise(callback) {
    var self = this;
    self.status = 'PENDING'; // 开始状态
    self.data = undefined;
    self.onResolvedCallback = []; //resolve 回调的结果
    self.onRejectedCallback = []; //reject 回调
    callback(resolve, reject); //执行executor 病传入想想的参数

    function resolve(value) {
        if (self.status === 'PENDING') {
            self.status == 'FULFILLED'; // 成功转态
            self.data = value;
            // 依次执行成功之后的函数栈
            for (var i = 0; i < self.onResolvedCallback.length; i++) {
                self.onResolvedCallback[i](value);
            }
        }
    }
    function reject(error) {
        if (self.status === 'PENDING') {
            self.status == 'REJECTED', (self.data = error);
            // 依次执行失败之后的函数栈
            for (var i = 0; i < self.onRejectedCallback.length; i++) {
                self.onRejectedCallback[i](error);
            }
        }
    }
}

// then
Promise.prototype.then = function() {};

new Promise((res, rej) => {
    res(s);
}).then(data => {
    console.log(data);
});
```

https://juejin.im/post/5afe6d3bf265da0b9e654c4b?utm_source=gold_browser_extension

## 记忆点

##### async/await

1. 处理其中的错误

```
async function getData() {
    try{
        const url = '/index.php?m=home&c=login';
        const res = await axios.get('/index.php?m=home&c=login');
        console.log(res.data);
    } catch(err){
        console.log(err);
    }

}
getData();
```

2. 处理 await 中的并行串行

```
const sleep = (timeout = 2000) => new Promise(resolve => {
  setTimeout(resolve, timeout);
})

async function getData() {
  await sleep(2000);
  const url = '/index.php?m=home&c=login';
  const res = await axios.get('/index.php?m=home&c=login');
  console.log(res.data);
}

const show = async() => {
  console.log('begin');
  const feweekly = await getData();
  const tool = await getData();
}
show();
```

3. promise.all 和 await 的使用
   实现多个异步操作的并行，适合多个请求的

```
const sleep = (timeout = 2000) => new Promise(resolve => {
  setTimeout(resolve, timeout);
})

async function getData() {
  const url = '/index.php?m=home&c=login';
  const res = await axios.get('/index.php?m=home&c=login');
  return res.data.message;
}
async function getDatas() {
  const url = '/index.php?m=home&c=logi';
  const res = await axios.get('/index.php?m=home&c=login');
  return res.data.message;
}

const show = async() => {
  console.log('begin');
  const [feweekly, tool] = await Promise.all([getData(), getDatas()])
  console.log(feweekly);
  console.log(tool);
}
show();

```

4. await 和 for

```
const fetch = require('node-fetch');
const bluebird = require('bluebird');

async function getZhihuColumn(id) {
  await bluebird.delay(1000);
  const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
  const response = await fetch(url);
  return await response.json();
}

const showColumnInfo = async () => {
  console.time('showColumnInfo');

  const names = ['feweekly', 'toolingtips'];
  const promises = names.map(x => getZhihuColumn(x));
  for (const promise of promises) {
    const column = await promise;
    console.log(`Name: ${column.name}`);
    console.log(`Intro: ${column.intro}`);
  }

  console.timeEnd('showColumnInfo');
};

showColumnInfo();
```
