-   [1. JS 模块化方面的不足](#1-js-%E6%A8%A1%E5%9D%97%E5%8C%96%E6%96%B9%E9%9D%A2%E7%9A%84%E4%B8%8D%E8%B6%B3)
-   [2. CommonJS 规范](#2-commonjs-%E8%A7%84%E8%8C%83)
-   [3 模块](#3-%E6%A8%A1%E5%9D%97)
    -   [3.1 commonjs 解析](#31-commonjs-%E8%A7%A3%E6%9E%90)
    -   [3.2 commonjs 实现](#32-commonjs-%E5%AE%9E%E7%8E%B0)
-   [4. 模块分类](#4-%E6%A8%A1%E5%9D%97%E5%88%86%E7%B1%BB)
    -   [4.1 原生模块](#41-%E5%8E%9F%E7%94%9F%E6%A8%A1%E5%9D%97)
    -   [4.2 文件模块](#42-%E6%96%87%E4%BB%B6%E6%A8%A1%E5%9D%97)
    -   [4.3 第三方模块](#43-%E7%AC%AC%E4%B8%89%E6%96%B9%E6%A8%A1%E5%9D%97)
        -   [4.3.1 全局目录](#431-%E5%85%A8%E5%B1%80%E7%9B%AE%E5%BD%95)
    -   [4.4 模块的加载策略](#44-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%8A%A0%E8%BD%BD%E7%AD%96%E7%95%A5)
    -   [4.5 文件模块查找规则](#45-%E6%96%87%E4%BB%B6%E6%A8%A1%E5%9D%97%E6%9F%A5%E6%89%BE%E8%A7%84%E5%88%99)
-   [5. 从模块外部访问模块内的成员](#5-%E4%BB%8E%E6%A8%A1%E5%9D%97%E5%A4%96%E9%83%A8%E8%AE%BF%E9%97%AE%E6%A8%A1%E5%9D%97%E5%86%85%E7%9A%84%E6%88%90%E5%91%98)
-   [6. 模块对象的属性](#6-%E6%A8%A1%E5%9D%97%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%B1%9E%E6%80%A7)
-   [7. 包](#7-%E5%8C%85)
    -   [8.3 包的安装模式](#83-%E5%8C%85%E7%9A%84%E5%AE%89%E8%A3%85%E6%A8%A1%E5%BC%8F)
        -   [8.3.1 本地安装](#831-%E6%9C%AC%E5%9C%B0%E5%AE%89%E8%A3%85)
    -   [8.4 全局安装](#84-%E5%85%A8%E5%B1%80%E5%AE%89%E8%A3%85)
-

# 1. JS 模块化方面的不足

JS 没有模块系统，不支持封闭的作用域和依赖管理
没有标准库，没有文件系统和 IO 流 API
也没有包管理系统

# 2. CommonJS 规范

-   封装功能
-   封闭作用域
-   可能解决依赖问题
-   工作效率更高，重构方便

3. Node 中的 CommonJS

-   在 node.js 里，模块划分所有的功能，每个 JS 都是一个模块
-   实现 require 方法,NPM 实现了模块的自动加载和安装依赖

```js
(function(exports, require, module, __filename, __dirname) {
    exports = module.exports = {};
    exports.name = 'zfpx';
    exports = { name: 'zfpx' };
    return module.exports;
});
```

# 3 模块

-   方便维护，仿版管理 代理统一
-   cmd seajs amd requiresjs umd
-   自己实现模块化 let obj= {}单例
-   闭包 let fn= (function(){return {}})
-   esModule es6 的模块化
-   commonjs 规范 node (原理闭包的形式)
    -   把文件读出来,套一个函数，安装规范来写，把需要导出的结果放到指定的地方
    -   别人可以拿到这个函数执行，拿到你导出的东西而已
    -   引用的过程是同步的
-   ndoe 模块分类 核心模块/内置模块， 第三方模块 blebird 文件模块，自己写的模块

```js
let a = require('./xxx');
(function() {
    var a = 1;
    module.exports = a;
    return module.exports;
})();
```

## 3.1 commonjs 解析

node 在模块编译中会对模块进行包装，返回类似的代码

```
(function (exports, require, module, __filename, __dirname) {
    // module code...
});
```

其中，

-   module 就是这个模块本身，
-   require 是对 Node.js 实现查找模块的模块
-   Module.\_load 实例的引用，
-   \_\_filename 和\_\_dirname 是 Node.js 在查找该模块后找到的模块名称和模块绝对路径，

关于 module.exports 与 exorts 的区别，了解了下面几点之后应该就完全明白：

模块内部大概是这样：

exports 是 module.exports 的一个引用

```
exports = module.exports = {};
```

-   require 引用模块后，返回给调用者的是 module.exports 而不是 exports

-   exports.xxx，相当于在导出对象上挂属性，该属性对调用模块直接可见

-   exports =相当于给 exports 对象重新赋值，调用模块不能访问 exports 对象及其属性

-   如果此模块是一个类，就应该直接赋值 module.exports，这样调用者就是一个类构造器，可以直接 new 实例

-   exports 和 module.exports 基本是一个东西，如果导出一个就用 module.exports,如果多个属性就用 exports

```
exports = module.exports = {};

exports.a = 123 //可以
exports = 123;//不可以

//我们最终返回的是 exports
let a=b=123
b=12
console.log(a)
```

## 3.2 commonjs 实现

`./node/module.js`

# 4. 模块分类

## 4.1 原生模块

`http` `path` `fs` `util` `events` 编译成二进制,加载速度最快，原来模块通过名称来加载

## 4.2 文件模块

在硬盘的某个位置，加载速度非常慢，文件模块通过名称或路径来加载 文件模块的后缀有三种

-   后缀名为.js 的 JavaScript 脚本文件,需要先读入内存再运行
-   后缀名为.json 的 JSON 文件,fs 读入内存 转化成 JSON 对象
-   后缀名为.node 的经过编译后的二进制 C/C++扩展模块文件,可以直接使用

一般自己写的通过路径来加载,别人写的通过名称去当前目录或全局的 node_modules 下面去找

## 4.3 第三方模块

-   如果 require 函数只指定名称则视为从 node_modules 下面加载文件，这样的话你可以移动模块而不需要修改引用的模块路径
-   第三方模块的查询路径包括 module.paths 和全局目录

### 4.3.1 全局目录

window 如果在环境变量中设置了 NODE_PATH 变量，并将变量设置为一个有效的磁盘目录，require 在本地找不到此模块时向在此目录下找这个模块。 UNIX 操作系统中会从 $HOME/.node_modules$HOME/.node_libraries 目录下寻找

## 4.4 模块的加载策略

![lookmodule](../../img/lookmodule.png)

## 4.5 文件模块查找规则

![](../../img/lookfile.png)

# 5. 从模块外部访问模块内的成员

-   使用 exports 对象
-   使用 module.exports 导出引用类型

# 6. 模块对象的属性

-   module.id
-   module.filename
-   module.loaded
-   module.parent
-   module.children
-   module.paths

# 7. 包

在 Node.js 中，可以通过包来对一组具有相互依赖关系的模块进行统一管理是，通过包可以把某个独立功能封装起来 每个项目的根目录下面，一般都有一个 package.json 文件，定义了这个项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）。npm install 命令根据这个配置文件，自动下载所需的模块，也就是配置项目所需的运行和开发环境

| 项目                | 描述                             |
| ------------------- | -------------------------------- |
| name                | 项目名称                         |
| version             | 版本号                           |
| description         | 项目描述                         |
| keywords: {Array}   | 关键词，便于用户搜索到我们的项目 |
| homepage            | 项目 url 主页                    |
| bugs                | 项目问题反馈的 Url 或 email 配置 |
| license             | 项目许可证                       |
| author,contributors | 作者和贡献者                     |
| main                | 主文件                           |
| bin                 | 项目用到的可执行文件配置         |
| repository          | 项目代码存放地方                 |
| scripts             | 声明一系列 npm 脚本指令          |
| dependencies        | 项目在生产环境中依赖的包         |
| devDependencies     | 项目在生产环境中依赖的包         |
| peerDependencies    | 应用运行依赖的宿主包             |
| package.json        | packagejson                      |

## 8.3 包的安装模式

### 8.3.1 本地安装

默认情况下安装命令会把对应的包安装到当前目录下，这叫本地安装，如果包里有可执行的文件 NPM 会把可执行文件安装到./node_modules/.bin 目录下。 本地安装的模块只能在当前目录和当前目录的子目录里面使用。

## 8.4 全局安装

如果希望安装的包能够在计算机机的所有目录下面都能使用就需要全局安装。

```
npm install <package-name> -g
```

在全局安装的模式下，npm 会把包安装到全局目录，通过此命令可以查看当前全局目录的位置

```
npm root -g
C:\Users\Administrator\AppData\Roaming\npm\node_modules
```

如果要修改全局安装目录，可以使用

```
npm config set prefix “D:\node.js\node_global”
```

如果包里有可执行文件，会把可执行文件安装到此 node_modules 的上一级目录中。

```
C:\Users\Administrator\AppData\Roaming\npm\
```

全局安装的一般是需要在任意目录下面执行的命令，比如 babel

```
npm install babel-cli -g
```

如果全局安装的命令不能用则可能是没有正确配置用户变量 PATH,需要在系统变量中为 PATH 变量添加全局安装目录

默认情况下在全局安装目录下面的模块是不能在任意文件夹下直接加载的，如果想要在任意目录下面直接加载，需要在系统变量中新建一个名为 NODE_PATH 的变量，它的值为全局安装目录下的 node_modules 所在位置。
