# ndoe 面试

1. CommonJS 中 require/exports 和 ES6 中 import/export 区别

CommonJS 模块的重要特性是加载时执行，及脚本代码在 require 的时候，就会全部执行。一旦出现某个模块被“循环加载”就只输出已经执行的部分，还没有执行的部分是不输出的

ES6 模块是动态引用，如果使用 import 从一个模块加载变量，那些变量不会缓存，而是成为一个指向被加载模块的引用,impor/export 最终都是编译为 require/exports 来执行的

2. 内存泄露

[内存泄露](https://mp.weixin.qq.com/s/yjztD6FEcpFr2zSzjxkUQA)
