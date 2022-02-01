# 性能优化

## 浏览器页面资源加载过程与优化

[网易](https://juejin.im/entry/5a43)

##### 浏览器加载资源的过程

- 浏览器如何知道应该加载那些资源?
- 浏览器是什么顺序加载这些资源的，当浏览器获取一个页面请求的时候，会按照顺序做如下图的四件事

  - 资源分类
  - 资源安全策略检查
  - 资源优先级计算
  - 根据优先级下载资源

1. 资源分类
   谷歌浏览器将资源分为 14 类，如图所示

2. 安全策略检查

## 前端优化方向

！！！！！查看一下博客和

- 页面的加载速度
- 页面使用起来流畅

#### 从浏览器打开到页面渲染完成，花费的时间

主要过程：

1. 浏览器解析
2. 缓存查询
3. dns 查询
4. 建立连接
5. 服务器处理请求
6. 服务器发送请求
7. 客户端收到页面
8. 解析 HTML
9. 构建渲染树
10. 开始显示内容（白屏时间）
11. 首屏内容加载完成（首屏时间）
12. 用户可以交互（DOMContentLoaded）
13. 加载完成

**页面加载时间控制**

我们需要知道加载的时间是多少，可以使用 Performance Timing ，可以获取很多页面加载相关的数据，

##### 文章

1. [_[转载]JavaScript 的性能优化：加载和执行_](http://caibaojian.com/jsload.html)

2. [_毫秒必争，前端网页性能最佳实践_](http://www.cnblogs.com/developersupport/p/3248695.html)

3. [JavaScript 启动性能瓶颈分析与解决方案](https://zhuanlan.zhihu.com/p/25221314)

4. [如何评价页面的性能](http://taobaofed.org/blog/2015/11/09/web-performance/)

5. [H5 性能优化方案](http://ddtalk.github.io/blog/2015/09/07/dingding-first/)
   ![](./static/img/youhua.jpg)

6. 页面生成的过程

7. [优化页面的打开速度，要不要了解一下~](https://juejin.im/post/5afd6a88f265da0b9127a879?utm_source=gold_browser_extension)
8. [Web性能的方方面面](https://github.com/laoqiren/web-performance)



### 调试

[Charles 从入门到精通](http://blog.devtang.com/2015/11/14/charles-introduction/)
[Charles 4.2.1 phone HTTPS抓包](https://juejin.im/post/5a30a52a6fb9a0451d4175ed)
[Mac OS 下Charles+Chrome Omega配置方法](https://blog.csdn.net/liu251/article/details/52096142)
[chrome-performance页面性能分析使用教程](https://www.cnblogs.com/zjjing/p/9106111.html)
[9102了，你还不会移动端真机调试？](https://segmentfault.com/a/1190000018613578)
[前端 WEBVIEW 指南之调试篇](https://imnerd.org/webview-debug.html)