# 1. 控制台

在 Node.js 中，使用 console 对象代表控制台(在操作系统中表现为一个操作系统指定的字符界面，比如 Window 中的命令提示窗口)。

```js
console.log
console.info
console.error 重定向到文件
console.warn
console.dir
console.time
console.timeEnd
console.trace
console.assert
```

# 2. 全局作用域

- 全局作用域(global)可以定义一些不需要通过任何模块的加载即可使用的变量、函数或类
- 定义全局变量时变量会成为 global 的属性。
- 永远不要不使用 var 关键字定义变量，以免污染全局作用域
- setTimeout clearTimeout
- setInterval clearInterval
- unref 和 ref

```js
let test = function(){
console.log('callback');
}
let timer = setInterval(test,1000);
timer.unref();
setTimeout(function(){
timer.ref();
},3000)
```

# 3. 函数

- require
- 模块加载过程
- require.resolve
- 模板缓存(require.cache)
- require.main
- 模块导出

```
module.exports, require, module, filename, dirname
```

# 4. process

## 4.1 process 对象

在 node.js 里，process 对象代表 node.js 应用程序，可以获取应用程序的用户，运行环境等各种信息

```
//参数
process.argv.forEach(function(item){
    console.log(item);
});
process.on('exit',function(){
    console.log('clear');
});
//环境变量
if (process.env.NODE_ENV === 'development') {
    console.log('当前是开发环境 ')
} else {
    console.log('上线环境 ')
}

process.on('uncaughtException',function(err){
    console.log(err);
})

console.log(process.memoryUsage());
console.log(process.cwd());当前工作目录 读取文件默认从跟文件夹下读取 (注意的点)
console.log(**dirname);
process.chdir('..');
console.log(process.cwd());
console.log(**dirname);

function err(){
throw new Error('报错了');
}
err();
```

## 4.2 process.nextTick & setImmediate

- process.nextTick()方法将 callback 添加到"next tick 队列"。 一旦当前事件轮询队列的任务全部完成，在 next tick 队列中的所有 callbacks 会被依次调用。
- setImmediate 预定立即执行的 callback，它是在 I/O 事件的回调之后被触发

```
setImmediate(function(){
    console.log('4');
});
setImmediate(function(){
    console.log('5');
});
process.nextTick(function(){
    console.log('1');
    process.nextTick(function(){
        console.log('2');
        process.nextTick(function(){
            console.log('3');
        });
    });
});

console.log('next');
```

# 5. EventEmitter

在 Node.js 的用于实现各种事件处理的 event 模块中，定义了 EventEmitter 类，所以可能触发事件的对象都是一个继承自 EventEmitter 类的子类实例对象。

| 方法名和参数                    | 描述                                                                      |
| ------------------------------- | ------------------------------------------------------------------------- |
| addListener(event,listener)     | 对指定事件绑定事件处理函数                                                |
| on(event,listener)              | 对指定事件绑定事件处理函数                                                |
| once(event,listener)            | 对指定事件指定只执行一次的事件处理函数                                    |
| removeListener(event,listener)  | 对指定事件解除事件处理函数                                                |
| removeAllListeners([event])     | 对指定事件解除所有的事件处理函数                                          |
| setMaxListeners(n)              | 指定事件处理函数的最大数量.n 为整数值，代表最大的可指定事件处理函数的数量 |
| listeners(event)                | 获取指定事件的所有事件处理函数                                            |
| emit(event,[arg1],[arg2],[...]) | 手工触发指定事件                                                          |

```
let EventEmitter = require('./events');
let util = require('util');
util.inherits(Bell,EventEmitter);
function Bell(){
    EventEmitter.call(this);
}
let bell = new Bell();
bell.on('newListener',function(type,listener){
    console.log(`对 ${type} 事件增加${listener}`);
});
bell.on('removeListener',function(type,listener){
    console.log(`对${type} 事件删除${listener}`);
});
function teacherIn(thing){
    console.log(`老师带${thing}进教室`);
}
function studentIn(thing){
    console.log(`学生带${thing}进教室`);
}
function masterIn(thing){
    console.log(`校长带${thing}进教室`);
}
bell.on('响',teacherIn);
bell.on('响',studentIn);
bell.once('响',masterIn);
bell.emit('响','书');
console.log('==============');
bell.emit('响','书');
console.log('==============');
bell.removeAllListeners('响');
console.log('==============');
bell.emit('响','书');
```

```
function EventEmitter(){
    this.events = {};//会把所有的事件监听函数放在这个对象里保存
    //指定给一个事件类型增加的监听函数数量最多有多少个
    this._maxListeners = 10;
}
EventEmitter.prototype.setMaxListeners = function(maxListeners){
    this._maxListeners = maxListeners;
}
EventEmitter.prototype.listeners = function(event){
    return this.events[event];
}
//给指定的事件绑定事件处理函数，1 参数是事件类型 2 参数是事件监听函数
EventEmitter.prototype.on = EventEmitter.prototype.addListener = function(type,listener){
    if(this.events[type]){
        this.events[type].push(listener);
        if(this._maxListeners!=0&&this.events[type].length>this._maxListeners){
            console.error(`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${this.events[type].length} ${type} listeners added. Use emitter.setMaxListeners() to increase limit`);
        }
    }else{
    //如果以前没有添加到此事件的监听函数，则赋一个数组
    this.events[type] = [listener];
    }
}
EventEmitter.prototype.once = function(type,listener){
//用完即焚
let wrapper = (...rest)=>{
    listener.apply(this);//先让原始的监听函数执行
    this.removeListener(type,wrapper);
}
    this.on(type,wrapper);
}
EventEmitter.prototype.removeListener = function(type,listener){
    if(this.events[type]){
        this.events[type] = this.events[type].filter(l=>l!=listener)
    }
}
//移除某个事件的所有监听函数
EventEmitter.prototype.removeAllListeners = function(type){
    delete this.events[type];
}
EventEmitter.prototype.emit = function(type,...rest){
    this.events[type]&&this.events[type].forEach(listener=>listener.apply(this,rest));
}
module.exports = EventEmitter;
```

## util

```
var util = require('util');
//util.inherit();
console.log(util.inspect({name:'zfpx'}));
console.log(util.isArray([]));
console.log(util.isRegExp(/\d/));
console.log(util.isDate(new Date()));
console.log(util.isError(new Error));
```

### node 核心

node 在处理路径的时候一般是处理为绝对路径

/\_\_dirname 父路径 不是 global 的属性

```
let r = readFileSync(path.join(**dirname, "1ndex.js"), "utf8");
let exits = exitsSync(path.join(**dirname, "1ndex.js")); // 文件是否存在

// 模块
console.log(path.join(**dirname, "common.js", "a")); //获取文件路径
console.log(path.basename("common.js.jk", ".js.jk")); // 去除基本名字
console.log(path.extname("1.main.aas.js")); // 取后缀名字
console.log(path.dirname(\_\_dirname)); // 获取父路径
```

# 让字符串执行

```
// 1> 第一种
let a = 100;
evel("console.log(a)"); // 沙箱

// 2> 第二种
let str = "console.log(1)";
let fn = new Function("a", str);
fn(1);

// 3) node 执行字符串
let vm = require("vm");
let str = "console.log(a)";
vm.runInNewContext(str);
```

# process

global 是全局，可以赋值拿到东西

process.stdout.wirte('hellow')

process.argv; 运行的参数
eg: webpack --port 3000
process.env; 环境变量
porcess.cwd(); 获取当前目录
process.exit() 退出

# node 中 this 指向

1. 在浏览器中默认 this 指向 window
2. 在浏览器中 window 代理了 global
3. 在文件中默认这个 this 不是 global,在 node 环境中 this 是 global
4. 在文件中 this 指向是被更改的指向 module.exports



