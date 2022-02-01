---
title: 跨域
date: 2022-02-01
tags:
categories:
- 计算机网络
---
# 1 跨域

>[ajax跨域，这应该是最全的解决方案了](https://juejin.im/entry/5a379a7b5188252b145b269e)

>[详解js跨域问题](https://segmentfault.com/a/1190000000718840)

>[反向代理](https://juejin.im/post/58e8c932ac502e4957bde78b)

>[解决跨域](https://github.com/hijiangtao/hijiangtao.github.io/blob/master/_posts/2017-06-13-Cross-Origin-Resource-Sharing-Solutions.md)

|             URL             |             URL              | 说明                   | 是否通讯                               |
| :-------------------------: | :--------------------------: | ---------------------- | -------------------------------------- |
|    http://www.a.com/a.js    |    http://www.a.com/b.js     | 同一域名下             | 允许                                   |
|  http://www.a.com/lab/a.js  | http://www.a.com/script/b.js | 同一域名下不同文件夹   | 允许                                   |
| http://www.a.com:8000/a.js  |    http://www.a.com/b.js     | 同一域名，不同端口     | 不允许                                 |
|    http://www.a.com/a.js    |    https://www.a.com/b.js    | 同一域名，不同协议     | 不允许                                 |
|    http://www.a.com/a.js    |   http://70.32.92.74/b.js    | 域名和域名对应ip       | 不允许                                 |
|    http://www.a.com/a.js    |   http://script.a.com/b.js   | 主域相同，子域不同     | 不允许                                 |
|    http://www.a.com/a.js    |      http://a.com/b.js       | 同一域名，不同二级域名 | 不允许（cookie这种情况下也不允许访问） |
| http://www.cnblogs.com/a.js |    http://www.a.com/b.js     | 不同域名               | 不允许                                 |


对于端口和协议的不同，只能通过后台来解决.前台无能为力

### 1.2 跨域资源共享（CORS）


**CORS（Cross-Origin Resource Sharing）**

跨域资源共享，定义了必须在访问跨域资源时，浏览器与服务器应该如何沟通。CORS背后的基本思想就是使用自定义的HTTP头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功还是失败。
```
//express 设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Custom-Info");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

```

```
// 前台文件
var url = 'http://t.ibs-bj.com/';
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status == 200) {
            document.body.innerHTML = xhr.responseText;
        }
    }
}
xhr.open('GET', url, true);
xhr.send();
```


### 1.3 通过JSONP跨域

现在问题来了？什么是jsonp？维基百科的定义是：JSONP（JSON with Padding）是资料格式 JSON 的一种“使用模式”，可以让网页从别的网域要资料。

JSONP也叫填充式JSON，是应用JSON的一种新方法，只不过是被包含在函数调用中的JSON，例如：

```
<script type="text/javascript">
    function dosomething(jsondata){
        //处理获得的json数据
    }
</script>
<script src="http://example.com/data.php?callback=dosomething"></script>
```

具体实现

```
function addScriptTag(src) {
    var script = document.createElement('script');
    script.setAttribute("type","text/javascript");
    script.src = src;
    document.body.appendChild(script);
  }

  window.onload = function () {
    addScriptTag('http://example.com/ip?callback=foo');
  }
```

```
//GSONP 服务器
app.get('/gsonp', function(req, res) {
  var callback = req.query.callback; //得到回调函数名
  var data = ['a', 'b', 'c']; //要返回的数据
  res.end(callback + '(' + data + ')');
})
```

#### 1.3.1 JSONP由两部分组成：

* 回调函数: 回调函数是当响应到来时应该在页面中调用的函数，
* 数据: 数据就是传入回调函数中的JSON数据。

#### 1.3.2 JSONP的优缺点

* JSONP的优点是：它不像XMLHttpRequest对象实现的Ajax请求那样受到同源策略的限制；它的兼容性更好，在更加古老的浏览器中都可以运行，不需要XMLHttpRequest或ActiveX的支持；并且在请求完毕后可以通过调用callback的方式回传结果。

* JSONP的缺点则是：它只支持GET请求而不支持POST等其它类型的HTTP请求；它只支持跨域HTTP请求这种情况，不能解决不同域的两个页面之间如何进行JavaScript调用的问题。

#### 1.3.3 CORS和JSONP对比

CORS与JSONP相比，无疑更为先进、方便和可靠。

  * 1、 JSONP只能实现GET请求，而CORS支持所有类型的HTTP请求。

  * 2、 使用CORS，开发者可以使用普通的XMLHttpRequest发起请求和获得数据，比起JSONP有更好的错误处理。

  * 3、 JSONP主要被老的浏览器支持，它们往往不支持CORS，而绝大多数现代浏览器都已经支持了CORS）。



### 1.4 通过修改document.domain来跨子域

浏览器都有一个同源策略，其限制之一就是第一种方法中我们说的不能通过ajax的方法去请求不同源中的文档。 它的第二个限制是浏览器中不同域的框架之间是不能进行js的交互操作的。
不同的框架之间是可以获取window对象的，但却无法获取相应的属性和方法。比如，有一个页面，它的地址是http://www.example.com/a.html ， 在这个页面里面有一个iframe，它的src是http://example.com/b.html, 很显然，这个页面与它里面的iframe框架是不同域的，所以我们是无法通过在页面中书写js代码来获取iframe中的东西的：

```
<script type="text/javascript">
    function test(){
        var iframe = document.getElementById('￼ifame');
        var win = document.contentWindow;//可以获取到iframe里的window对象，但该window对象的属性和方法几乎是不可用的
        var doc = win.document;//这里获取不到iframe里的document对象
        var name = win.name;//这里同样获取不到window对象的name属性
    }
</script>
<iframe id = "iframe" src="http://example.com/b.html" onload = "test()"></iframe>
```

这个时候，document.domain就可以派上用场了，我们只要把http://www.example.com/a.html 和 http://example.com/b.html这两个页面的document.domain都设成相同的域名就可以了。但要注意的是，document.domain的设置是有限制的，我们只能把document.domain设置成自身或更高一级的父域，且主域必须相同。

* 1.在页面 http://www.example.com/a.html 中设置document.domain:
```
<iframe id = "iframe" src="http://example.com/b.html" onload = "test()"></iframe>
<script type="text/javascript">
    document.domain = 'example.com';//设置成主域
    function test(){
        alert(document.getElementById('￼iframe').contentWindow);//contentWindow 可取得子窗口的 window 对象
    }
</script>

```

* 2.在页面 http://example.com/b.html 中也设置document.domain:
```
<script type="text/javascript">
    document.domain = 'example.com';//在iframe载入这个页面也设置document.domain，使之与主页面的document.domain相同
</script>
```
修改document.domain的方法只适用于不同子域的框架间的交互。


### 1.5 携带cookie 跨域

* widthCredentials
    * ajax 请求，ajax默认是不带cookie,所以有以下两种方案：
        * 使用jsonp 格式发送
        * ajax 请求中加上xhrFields:{widthCredentials: true},这样就可以携带cookie这样后台配置就出现了限制，需要配置Access-Control-Allow-Origin 的值为*；
* 反向代理
    *  利用nginx的反向代理来解决cookie 跨域问题，其实通过欺骗浏览器来实现的。通过nginx,我们可以将不同工程的cookie 放到nginx 域下，通过nginx 反向代理就可以获取到不同工程写入cookie,。    

