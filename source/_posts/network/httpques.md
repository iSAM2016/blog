- [1 跨域](#1-%E8%B7%A8%E5%9F%9F)
    - [1.2 跨域资源共享（CORS）](#12-%E8%B7%A8%E5%9F%9F%E8%B5%84%E6%BA%90%E5%85%B1%E4%BA%ABcors)
    - [1.3 通过JSONP跨域](#13-%E9%80%9A%E8%BF%87jsonp%E8%B7%A8%E5%9F%9F)
      - [1.3.1 JSONP由两部分组成：](#131-jsonp%E7%94%B1%E4%B8%A4%E9%83%A8%E5%88%86%E7%BB%84%E6%88%90)
      - [1.3.2 JSONP的优缺点](#132-jsonp%E7%9A%84%E4%BC%98%E7%BC%BA%E7%82%B9)
      - [1.3.3 CORS和JSONP对比](#133-cors%E5%92%8Cjsonp%E5%AF%B9%E6%AF%94)
    - [1.4 通过修改document.domain来跨子域](#14-%E9%80%9A%E8%BF%87%E4%BF%AE%E6%94%B9documentdomain%E6%9D%A5%E8%B7%A8%E5%AD%90%E5%9F%9F)
    - [1.5 携带cookie 跨域](#15-%E6%90%BA%E5%B8%A6cookie-%E8%B7%A8%E5%9F%9F)
- [2 https](#2-https)
  - [2.1 http和https的基本概念](#21-http%E5%92%8Chttps%E7%9A%84%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)
  - [2.2 http和https的区别？](#22-http%E5%92%8Chttps%E7%9A%84%E5%8C%BA%E5%88%AB)
  - [2.3 https协议的工作原理](#23-https%E5%8D%8F%E8%AE%AE%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86)
  - [2.4 https协议的优点](#24-https%E5%8D%8F%E8%AE%AE%E7%9A%84%E4%BC%98%E7%82%B9)
  - [2.5 https协议的缺点](#25-https%E5%8D%8F%E8%AE%AE%E7%9A%84%E7%BC%BA%E7%82%B9)
  - [2.5 https 加密原理（对称加密，非对称加密）](#25-https-%E5%8A%A0%E5%AF%86%E5%8E%9F%E7%90%86%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86)
- [3 WebSocket 的实现和应用](#3-websocket-%E7%9A%84%E5%AE%9E%E7%8E%B0%E5%92%8C%E5%BA%94%E7%94%A8)
- [4 一个图片url访问后直接下载怎样实现？](#4-%E4%B8%80%E4%B8%AA%E5%9B%BE%E7%89%87url%E8%AE%BF%E9%97%AE%E5%90%8E%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E6%80%8E%E6%A0%B7%E5%AE%9E%E7%8E%B0)

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

# 2 https 

>https的ssl 加密是在传输层实现的

## 2.1 http和https的基本概念

http: 超文本传输协议，是互联网上应用最为广泛的一种网络协议，是一个客户端和服务器端请求和应答的标准（TCP），用于从WWW服务器传输超文本到本地浏览器的传输协议，它可以使浏览器更加高效，使网络传输减少。

https: 是以安全为目标的HTTP通道，简单讲是HTTP的安全版，即HTTP下加入SSL层，HTTPS的安全基础是SSL，因此加密的详细内容就需要SSL。

https协议的主要作用是：建立一个信息安全通道，来确保数组的传输，确保网站的真实性。

## 2.2 http和https的区别？

http传输的数据都是未加密的，也就是明文的，网景公司设置了SSL协议来对http协议传输的数据进行加密处理，简单来说https协议是由http和ssl协议构建的可进行加密传输和身份认证的网络协议，比http协议的安全性更高。

主要的区别如下：

* Https协议需要ca证书，费用较高。
* http是超文本传输协议，信息是明文传输，https则是具有安全性的ssl加密传输协议。
* 使用不同的链接方式，端口也不同，一般而言，http协议的端口为80，https的端口为443
* http的连接很简单，是无状态的；HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，比http协议安全。

## 2.3 https协议的工作原理

客户端在使用HTTPS方式与Web服务器通信时有以下几个步骤，如图所示。

* 客户使用https url访问服务器，则要求web 服务器建立ssl链接。
* web服务器接收到客户端的请求之后，会将网站的证书（证书中包含了公钥），返回或者说传输给客户端。
* 客户端和web服务器端开始协商SSL链接的安全等级，也就是加密等级。
* 客户端浏览器通过双方协商一致的安全等级，建立会话密钥，然后通过网站的公钥来加密会话密钥，并传送给网站。
* web服务器通过自己的私钥解密出会话密钥。
* web服务器通过会话密钥加密与客户端之间的通信。

## 2.4 https协议的优点

* 使用HTTPS协议可认证用户和服务器，确保数据发送到正确的客户机和服务器；
* HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，要比http协议安全，可防止数据在传输过程中不被窃取、改变，确保数据的完整性。
* HTTPS是现行架构下最安全的解决方案，虽然不是绝对安全，但它大幅增加了中间人攻击的成本。
* 谷歌曾在2014年8月份调整搜索引擎算法，并称“比起同等HTTP网站，采用HTTPS加密的网站在搜索结果中的排名将会更高”。

## 2.5 https协议的缺点

* https握手阶段比较费时，会使页面加载时间延长50%，增加10%~20%的耗电。
* https缓存不如http高效，会增加数据开销。
* SSL证书也需要钱，功能越强大的证书费用越高。
* SSL证书需要绑定IP，不能再同一个ip上绑定多个域名，ipv4资源支持不了这种消耗。

## 2.5 https 加密原理（对称加密，非对称加密）

# 3 WebSocket 的实现和应用

1. 什么是 WebSocket?

WebSocket 是 HTML5 中的协议，支持持久连续，http 协议不支持持久性连接。Http1.0 和 HTTP1.1 都不支持持久性的链接，HTTP1.1 中的 keep-alive，将多个 http 请求合并为 1 个

2. WebSocket 是什么样的协议，具体有什么优点？

HTTP 的生命周期通过 Request 来界定，也就是 Request 一个 Response，那么在 Http1.0 协议中，这次 Http 请求就结束了。在 Http1.1 中进行了改进，是的有一个 connection：Keep-alive，也就是说，在一个 Http 连接中，可以发送多个 Request，接收多个 Response。但是必须记住，在 Http 中一个 Request 只能对应有一个 Response，而且这个 Response 是被动的，不能主动发起。

WebSocket 是基于 Http 协议的，或者说借用了 Http 协议来完成一部分握手，在握手阶段与 Http 是相同的。我们来看一个 websocket 握手协议的实现，基本是 2 个属性，upgrade，connection。

基本请求如下：

```
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

多了下面 2 个属性：

```
Upgrade:webSocket
Connection:Upgrade
告诉服务器发送的是websocket
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```

# 4 一个图片url访问后直接下载怎样实现？

请求的返回头里面，用于浏览器解析的重要参数就是OSS的API文档里面的返回http头，决定用户下载行为的参数。
下载的情况下：
```
  1. x-oss-object-type:
         Normal
  2. x-oss-request-id:
         598D5ED34F29D01FE2925F41
  3. x-oss-storage-class:
         Standard
```


