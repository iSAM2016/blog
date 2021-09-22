# underscore 源码学习

> 参考[亚里士朱德的博](http://yalishizhude.github.io/2015/09/22/underscore-source/)

> 参考[源码解析](https://yoyoyohamapi.gitbooks.io/undersercore-analysis/content/base/%E7%BB%93%E6%9E%84.html)

> 参考[JavaScript 深入系列 15 篇](https://juejin.im/post/59278e312f301e006c2e1510)

> 参考[淘金](https://github.com/jawil/blog/issues/4)

> 8 张思维导图

> [前端基础进阶系列](http://www.jianshu.com/p/fe5f173276bd)

## 目录

-   [栈和堆](https://www.cnblogs.com/heioray/p/9487093.html)
-   [undefined](#undefined)
-   [原型](#prototype)
    -   [原型赋值](#assignment)
    -   [Object 在理解](#understanding)
-   [作用域](#bindroot)
    -   [作用域类型](#scopeType)
        -   [函数作用域](#functionscope)
-   [执行上下文](#context)
    -   [关于 Hoisting（变量提升）](#Variable)
-   [作用域链（scope chain）](#scopeChain)
-   [闭包](#closure)
-   [this](#this)
-   [类型转换](#conversion)
-   [事件循环机制](#Event)
    -   [定时器的面试题](#settimeout)
-   [判断数据](#isElement)
-   [Array.prototype.slice 新发现](#clone)
-   [对象相等性判断](#isEqual)
-   [数据判断](#isElement)
-   [对象相等性判断](#isEqual)
-   [函数节流和防抖](#debounceThrottle)

<h2 id="undefined">undefined</h2>
 在js中undefined是不靠谱的，他能被赋值，如果要获取到正宗的undefined使用void 0
 在一些框架中这样使用
 
 ```
    (function(window,undefined) {
    // ...
    })(window)
```
  将其他没有用的参数赋值给undefined,防止破坏函数内部逻辑
 
 
 注意： 和null 比较
 
 null表示"没有对象"，即该处不应该有值。典型用法是：

（1） 作为函数的参数，表示该函数的参数不是对象。

（2） 作为对象原型链的终点。

```
Object.getPrototypeOf(Object.prototype)
// null
```

undefined 表示"缺少值"，就是此处应该有一个值，但是还没有定义。典型用法是：

1. 变量被声明了，但没有赋值时，就等于 undefined。

2. 调用函数时，应该提供的参数没有提供，该参数等于 undefined。

3. 对象没有赋值的属性，该属性的值为 undefined。

4. 函数没有返回值时，默认返回 undefined。

<h2 id="prototype">原型</h2>
<h5 id="assignment">原型赋值</h5>

-   `var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;`
-   `Array,Object,Function` 本质上都是函数，获取函数原型属性 prototype(type is object) 也是为了便于压缩，如果代码中药扩展属性，

注意`Object.prototype.xxx = ....` 这种代码是不可压缩，Object prototype 这些名字修改了浏览器不认识( 一段代码使用两次都应该定义成变量)

<h5 id="understanding">Object 在理解</h5>
1. 高程（p148）

-   无论什么时候只要创建一个新函数，就会根据一组特定的规则为该函数创建一个 prototype（属性值是个对象）属性，这个属性指向函数的原型对象。
-   在默认情况下，所有的原型对象都会自动获取一个 constructor 属性，这个属性包含指向 protorype 属性所在函数的指针。

2. 原型和原型链
    > [参考王福朋博客](http://www.cnblogs.com/wangfupeng1988/tag/%E5%8E%9F%E5%9E%8B/)
1. 略
1. 函数和对象的关系
   函数是对象的一种，对象都是函数创建的。eg:

    ```
      function Employee(name,job,born)
      {
      this.name=name;
      this.job=job;
      this.born=born;
      }

      var bill=new Employee("Bill Gates","Engineer",1985);
    ```

1. [prototype 原型](https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=js%20%E5%8E%9F%E5%9E%8B%E9%93%BE%E5%9B%BE&hs=2&pn=1&spn=0&di=16720&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=1572224787%2C1235906205&os=798363273%2C1767038466&simid=3134473788%2C3038480252&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=js%20%E5%8E%9F%E5%9E%8B%E9%93%BE%E5%9B%BE&objurl=http%3A%2F%2Fstatic.oschina.net%2Fuploads%2Fimg%2F201602%2F26093246_3oHb.png&fromurl=ippr_z2C%24qAzdH3FAzdH3F4y_z%26e3B5fvitgw_z%26e3BgjpAzdH3F7AzdH3FddcbcccAzdH3Fks52AzdH3Fmd9c9l&gsm=2&islist=&querylist=)
    - 原型和函数的关系已经在开篇已经交代了.每个函数都有 prototype,每个对象(函数也是对象)都有**\_\_proto\_\_**
1. **\_\_proto\_\_** 隐式原型

    - 每个对象都有一个隐式的属性，但是有些浏览器是不会让你发现的

    - 文字版： 每个对象都有一个**proto**属性，指向创建该对象的函数的 `prototype`:This is another regular paragraph.

    ```
      eg: bill.__proto__ === Employee.protitype  //true
      eg: var obj={}
          obj.__proto__ === Object.prototype  //true
          Object.prototype.__proto__ === null //true
    ```

    最终的**proto** 都要指向 Object.prototype
    (考虑 Object.prototype.**proto**,而 Object.prototype.**proto** 是个特例是 null 固定的)
    函数是特殊的对象，他当然也是有**proto**Object.**proto** === Functon.prototype

1. instanceof 运算
    - Instanceof 运算符的第一个变量是一个对象，暂时称为 A；第二个变量一般是一个函数，暂时称为 B。
    - 运算规则：沿着 A 的**proto** 这条线来找，同时沿着 B 的 prototype 这条线来找，如果两条线能同
      时找到同一个对象，那么就返回 true，如果找到终点还没有找到，则返回 false

```
  console.log(Object instanceof Function) //true
  console.log(Function instanceof Object) //true
  console.log(Function instanceof Function) //true
  console.log(Object instanceof Object) //true
```

instanceof 表示的就是一种继承关系，或者原型链的结构。

6.  继承

    -   javescript 中的继承是通过原型链来体现的：
        -   访问一个对象的属性时，先在基本属性中查找，如果没有，再沿着 prototype 这条链向上找，这就是原型链。由于所有的对象的原型链都会找到 Object.prototype，因此所有的对象都会有 Object.prototype 的方法。这就是所谓的“继承”。

7.  原型的灵活性
    可以灵活的添加属性

8.  扩展
    new 形式创建对象的过程实际上可以分为三步：

        1. 第一步是建立一个新对象（叫 A 吧）；

        2. 第二步将该对象（A）内置的原型对象设置为构造函数(就是 Person)prototype 属性引用的那个原型对象；

        3. 第三步就是将该对象（A）作为 this 参数调用构造函数(就是 Person)，完成成员设置等初始化工作。

```js
var obj = {};
obj.__proto__ = Base.prototype;
Base.call(obj);
```

```js
 function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
    ...
  }
  // 中(_.isFunction(constructor) && constructor.prototype) || ObjProto ？？？
  //  这是访问实例原型的一种方法：
        // constructor.prototype ==> window(obj)
        // ObjProto              ==> object(obj)

        // 没有发现_.isFunction(constructor)
```

```js
var A = function () {};
var a = new A();
console.log(a.__proto__); //Object {}（即构造器function A 的原型对象）
console.log(a.__proto__.__proto__); //Object {}（即构造器function Object 的原型对象）
console.log(a.__proto__.__proto__.__proto__); //null
```

9. 例子

```
    function Personal(){};
    var p = new Personal();
    ①从p 画出 完成的__proto__链
    p-> Personal.prototype-> Object.prototype->null

    ②Personal() 的原型链
    Personal()-> Function.prototype->Object.prototype->null

    ③console.log(Personal.constructor)
    分析： Personal.__proto__ 指向的是Function.prototype.函数是没有constructor 属性的，所以会沿着__proto__ 向上一级寻找，是     Function.prototype，他的constructor 是function Function(){}

    ④console.log(Personal.prototype)
```

<h2 id="bindroot">作用域</h2>

2017 年 05 月 28 日 17:39:23 this 和作用域 的误解
因为 js 采用的是词法作用域，函数的作用域在函数定义的时候就决定好了

作用域： 根据名称查找变量的一套规则,作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突
当一个块或者一个函数嵌套在另外一个块或者函数的时候，就发生了作用域的嵌套
![作用域嵌套](../../img/241708372951952.png)

```js
function foo(a) {
    console.log(a + b);
    b = a;
}
foo(2); // b is not defined
```

```js
function foo(a) {
    console.log(a + b);
    var b = a;
}
foo(2); //NaN
```

```js
function foo() {
    var c = (d = 1);
}
foo();
console.log(c); // c is not defined
```

```js
(function () {
    var a = (b = 3);
})();
console.log(b);
console.log(a);

//   解释：
//   b = 3;
//   var a = b;
//   所以 b 成了全局变量，而 a 是自执行函数的一个局部变量。
```

```js
if (!('a' in window)) {
    var a = 1;
}
alert(a);
```

<h5 id="scopeType">作用域类型</h5>
作用域共有两种工作模型

1. 词法作用域（js）
2. 动态作用域

词法作用域是由你写代码时将变量和块作用域写在哪里决定的，上下文的判断是根据调用代码的顺序来决定的

```js
var scope = 'global scope';
function checkscope() {
    var scope = 'local scope';
    function f() {
        return scope;
    }
    return f();
}
checkscope();

var scope = 'global scope';
function checkscope() {
    var scope = 'local scope';
    function f() {
        return scope;
    }
    return f;
}
checkscope()();
// 结果都是相同的，函数的作用域是函数创建的位置
// 这两段代码是有蛇魔不同吗   执行上下文
```

```js
function foo() {
    console.log(a);
    a = 1;
}

foo(); // ???

function bar() {
    a = 1;
    console.log(a);
}
bar(); // ???
```

```js
console.log(foo);

function foo() {
    console.log('foo');
}

var foo = 1;
```

```js
var value = 1;
var obj = { value: 2 };
function foo() {
    console.log(this.value);
    console.log(this);
}

function bar() {
    var value = 2;
    foo.call(obj);
}
bar();
```

```js
var scope="80";
function scopeTest(){
     var scope;
     console.log(scope);
     scope="100"
     console.log(scope);
 }
scopeTest();
console.log(scope);
```

<h6 id="functionscope">函数作用域</h6>
立即执行函数表达式

-   IIFE 将 window 穿入进去
-   JS 中(function(){xxx})() _立即执行函数_

*   包围函数（function(){})的第一对括号向脚本返回未命名的函数，随后一对空括号立即执行返回的未命名函数，括号内为匿名函数的参数。
    其他写法:

    _ (function () { code } ());
    _ !function () { code } ();
    _ ~function () { code } ();
    _ -function () { code } (); \* +function () { code } ();

    -   函数声明： function name(){}
    -   函数表达式：var fnname = function(){}
    -   匿名函数： function(){} 匿名函数属于函数表达式
    -   两者最主要的区别是：

1. 变量提升
2. 函数表达式可以在后面添加扩看，但是命名函数不行吧

```js
  function fnName(){
        alert('Hello World');
    }();//error

    function(){
        console.log('Hello World');
    }();//error  没有赋值
```

而（）、！、+、-、=等运算符，都将函数声明转换成函数表达式，
消除了 javascript 引擎识别函数表达式和函数声明的歧义，告诉
javascript 引擎这是一个函数表达式，不是函数声明，可以在后面
加括号，并立即执行函数的代码。

```js
(function (a) {
    console.log(a); //firebug输出123,使用（）运算符
})(123);

(function (a) {
    console.log(a); //firebug输出1234，使用（）运算符
})(1234);
```

```js
var foo = 1;
function bar() {
    if (!foo) {
        var foo = 10;
    }
    alert(foo); //  10

    //      预解析阶段:
    //       var foo;
    //      代码执行阶段:
    if (!foo) {
        foo = 10;
    }
    alert(foo);
}
bar();

// 代码拆分:
//  预解析阶段:
var foo;
function bar() {
    console.log(99);
}
// 代码执行阶段:
foo = 1;

bar();
```

```js
function fn() {
    var a = 1,
        b = 1,
        c = 1;
    //    var a = 1;
    //    var b = 1;
    //    var c = 1;
}
fn();
console.log(c); //1  e
console.log(b); //1  e
// console.log(a); //e  e
function fn1() {
    var a = (b = c = 1);
    var a = 1;
    b = 1;
    c = 1;
}
fn1();
console.log(c); // 1
console.log(b); // 1
console.log(a); // e
```

```js
var a;
function a() {
    console.log('呵呵');
    function a() {
        a = 4;
        console.log('哈哈');
    }
    a();
    console.log(a); // 4
}
a();
```

###### 普通写法

```js
var wall = {}; // 声明定义一个命名空间wall

// 定义方法
(function (window, WALL, undefined) {
    // 给wall命名空间绑定方法say
    WALL.say = function () {
        console.log('hello');
    };
})(window, wall);

(function (window, WALL, undefined) {
    // 给wall命名空间绑定方法 whoIam
    WALL.whoIam = function () {
        console.log('wall');
    };
})(window, wall);

// 调用
wall.say();
wall.whoIam();
```

先定义一个命名空间，然后再给这个命名空间加东西。这是最普遍的写法，也是最好理解的。不足的地方就是必须先声明一个命名空间，然后才能执行相关的绑定代码。存在顺序加载的问题。

###### 放大写法

```js
var wall = (function (window, WALL, undefined) {
    if (typeof WALL == 'undefined') {
        WALL = {};
    }

    // 给wall命名空间绑定方法say
    WALL.say = function () {
        console.log('hello');
    };

    return WALL; // 返回引用
})(window, wall);

var wall = (function (window, WALL, undefined) {
    if (typeof WALL == 'undefined') {
        WALL = {};
    }

    // 给wall命名空间绑定方法 whoIam
    WALL.whoIam = function () {
        console.log('wall');
    };

    return WALL; // 返回引用
})(window, wall);

// 调用
wall.say();
wall.whoIam();
```

放大模式的好处就是，可以不用考虑代码加载的先后顺序。
  因为 js 允许 wall 变量进行重复 var 声明，所以这段代码是可以执行的。
  我可以把 IIFE 函数拆分成多个文件进行加载，而不会出现普通写法需要注意的问题。

需要注意的点：

1. IIFE 的头部，都要先进行检查命名空间是否已经实例化，如果还没实例化，则进行实例化。
2. IIFE 的尾部，都要 return 命名空间的引用，使后续代码能够得到最新的 wall 命名空间内容。

##### 宽放大写法

```js
(function (window, WALL, undefined) {
    // 给wall命名空间绑定方法say
    WALL.say = function () {
        console.log('hello');
    };
})(window, window.wall || (window.wall = {}));

(function (window, WALL, undefined) {
    // 给wall命名空间绑定方法 whoIam
    WALL.whoIam = function () {
        console.log('wall');
    };
})(window, window.wall || (window.wall = {}));

// 调用
wall.say();
wall.whoIam();
```

宽放大模式的重点注意的地方：就是在实参部分的 window.wall || (window.wall = {})。
  用||运算符进行取巧。
  如果 window.wall 是已经实例化的，非 not defined。则直接返回 window.wall 的引用，赋值给形参 WALL。不会执行||运算符后面的内容。
  如果 window.wall 还未实例化，则进行实例化。这里要注意的点是实例化是一个赋值操作，需要用括号包起来，变成表达式去执行，才不会报错。
  表达式(window.wall = {})执行完毕后，会返回新对象 window.wall 的引用。

宽放大模式的好处：是可以切割成多个文件进行加载，而不必考虑文件加载的先后顺序，不存在强耦合关系。
  当然，如果 IIFE 里面的方法互相引用，还是存在加载依赖的问题。这个问题可以用加载器 Require.js 等工具解决，这里就不讨论了。

##### 分文件加载 IIFE 要注意的点

```js
(function (window, WALL, undefined) {
    // 给wall命名空间绑定方法say
    WALL.say = function () {
        console.log('hello');
    };
})(window, window.wall || (window.wall = {}));
```

眼尖的已经看出区别了，就是文件开始的地方，先写上分号;。
  这样，多个文件合并的时候，才不会出现收尾相接，代码出现错乱的问题。比如下面这种情况：

```js
// a.js 文件
wall.log()(
    // b.js 文件
    function (window, WALL, undefined) {
        // 给wall命名空间绑定方法say
        WALL.say = function () {
            console.log('hello');
        };
    }
)(window, window.wall || (window.wall = {}));
//  由于a.js文件的wall.log()少写了分号，跟b.js文件合并后，js就会认为‘wall.log()(...)’是需要这么执行的，结果代码就报错了。
```

<h2 id="context">执行上下文</h2>

js 在**_执行_**代码段（全局代码， 函数体， eval）的时候，会做一些准备工作

-   创建 arguments 对象、检查 function 函数声明创建、检查 var 变量声明创建属性
-   scope chain
-   this——赋值(只有在执行的时候才能确定，定义的时候不能确定)

这三种数据的准备情况我们称之为“执行上下文”或者“执行上下文环境”。

函数每调用一次，都会产生一个新的上下文环境因为不同的调用可能产生不同的参数;
函数在定义的时候（不是调用的时候），就已经确定了函数体内部自由变量的作用域;
作用域只是一个“地盘”，一个抽象的概念，其中没有变量。要通过作用域对应的执行上下文环境来获取变量的值。
同一个作用域下，不同的调用会产生不同的执行上下文环境，继而产生不同的变量的值。所以，作用域中变量的值是在执行过程中产生的确定的，而作用域却是在函数创建时就确定了。
所以，如果要查找一个作用域下某个变量的值，就需要找到这个作用域对应的执行上下文环境，再在其中寻找变量的值。

1. 找到当前上下文中的调用函数的代码

2. 在执行被调用的函数体中的代码以前，开始创建执行上下文

3. 进入第一个阶段-建立阶段:

    - 建立 variableObject 对象:

        1. 建立 arguments 对象，检查当前上下文中的参数，建立该对象下的属性以及属性值
        2. 检查当前上下文中的函数声明：
        3. 每找到一个函数声明，就在 variableObject 下面用函数名建立一个属性，属性值就是指向该函数在内存中的地址的一个引用
        4. 如果上述函数名已经存在于 variableObject 下，那么对应的属性值会被新的引用所覆盖。
        5. 检查当前上下文中的变量声明：
        6. 每找到一个变量的声明，就在 variableObject 下，用变量名建立一个属性，属性值为 undefined。
        7. 如果该变量名已经存在于 variableObject 属性中，直接跳过(防止指向函数的属性的值被变量属性覆盖为 undefined)，原属性值不会被修改。

    - 初始化作用域链
    - 确定上下文中 this 的指向对象

4. 代码执行阶段:

    执行函数体中的代码，一行一行地运行代码，给 variableObject 中的变量属性赋值。
    下面来看个具体的代码示例:

```js
function foo(i) {
    var a = 'hello';
    var b = function privateB() {};
    function c() {}
}

foo(22);
```

在调用 foo(22)的时候，建立阶段如下:

```js
fooExecutionContext = {
       variableObject: {
           arguments: {
               0: 22,
               length: 1
           },
           i: 22,
           c: pointer to function c()
           a: undefined,
           b: undefined
       },
       scopeChain: { ... },
       this: { ... }
    }
```

由此可见，在建立阶段，除了`arguments`，函数的声明，以及参数被赋予了具体的属性值，其它的变量属性默认的都是 undefined。一旦上述建立阶段结束，引擎就会进入代码执行阶段，这个阶段完成后，上述执行上下文对象如下:

```js
fooExecutionContext = {
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c()
        a: 'hello',
        b: pointer to function privateB()
    },
    scopeChain: { ... },
    this: { ... }
}

```

我们看到，只有在代码执行阶段，变量属性才会被赋予具体的值。

```js
function b(x, y, a) {
    arguments[2] = 10;
    alert(a);
}
b(1, 2, 3);
```

<h5 id="Variable">关于Hoisting（变量提升）</h5>

全局变量是不会提升的

```js
(function() {
    console.log(typeof foo); // function pointer
    console.log(typeof bar); // undefined
    var foo = 'hello',
    bar = function() {
        return 'world';
    };
    function foo() {
        return 'hello';
    }
})();​

```

在上下文的建立阶段，先是处理 arguments, 参数，接着是函数的声明，最后是变量的声明。那么，发现 foo 函数的声明后，就会在 variableObject 下面建立一个 foo 属性，其值是一个指向 函数的引用。当处理变量声明的时候，发现有 var foo 的声明，但是 variableObject 已经具有了 foo 属性，所以直接跳过。当进入代码执行阶段的时候，就可以通过访问到 foo 属性了，因为它 已经就存在，并且是一个函数引用。

```js
function a(x) {
    return x * 2;
}
var a;
alert(a);
```

现在我们可以回答下面这些问题了

1. 在 foo 声明之前，为什么我们可以访问它？

    如果我们来跟踪 creation stage, 我们知道在代码执行阶段之前，变量已经被创建了。因此在函数流开始执行之前，foo 已经在 activation object 中被定义了。

2. foo 被声明了两次，为什么 foo 最后显示出来是一个 function，并不是 undefined 或者是 string？

    尽管 foo 被声明了两次，我们知道，在创建阶段，函数的创建是在变量之前的，并且如果属性名在 activation object 中已经存在的话，我们是会简单的跳过这个声明的。
    因此，对 function foo()的引用在 activation object 上先被创建了，当解释器到达 var foo 时，我们会发现属性名 foo 已经存在了，因此代码什么都不会做，继续向下执行。

3. 为什么 bar 是 undefined？

    bar 实际上是一个变量，并且被赋值了一个函数的引用。我们知道变量是在创建阶段被创建的，但是它们会被初始化为 undefined，所以 bar 是 undefined。希望现在你对 JavaScript 解释器如何执行你的代码能有一个好的理解了。理解 execution context and stack 会让你知道为什么你的代码有时候会输出和你最初期望不一样的值。

<h2 id="scopeChain">作用域链（scope chain）</h2>

先阅读（词法作用域）
作用域链:是由当前环境与上层环境的一系列变量对象组成，它保证了当前执行环境对符合访问权限的变量和函数的有序访问。是作用域的具体实施表现

```js
var a = 10;
function fn() {
    var b = 20;
    function bar() {
        console.log(a + b);
    }
    return bar;
}
var x = fn(),
    b = 200;
x();
```

```js
var a = 20;

function test() {
    var b = a + 10;

    function innerTest() {
        var c = 10;
        return b + c;
    }

    return innerTest();
}

test();
```

在上面的例子中，全局，函数 test，函数 innerTest 的执行上下文先后创建。我们设定他们的变量对象分别为 VO(global)，VO(test), VO(innerTest)。而 innerTest 的作用域链，则同时包含了这三个变量对象，所以 innerTest 的执行上下文可如下表示。

```

innerTestEC = {
VO: {...}, // 变量对象
scopeChain: [VO(innerTest), VO(test), VO(global)], // 作用域链
this: {}
}
很多人会误解为当前作用域与上层作用域为包含关系，但其实并不是。以最前端为起点，最末端为终点的单方向通道我认为是更加贴切的形容。如图。

```

![作用域链](../../img/5fd09372163bf05c34b3890287f88bd6.png)
是的，作用域链是由一系列变量对象组成，我们可以在这个单向通道中，查询变量对象中的标识符，这样就可以访问到上一层作用域中的变量了。

```js
var color = 'blue';
function changeColor() {
    console.log(color);
    if (color === 'blue') {
        color = 'red';
        console.log(color);
    } else {
        color = 'blue';
        console.log(color);
    }
}

changeColor();
```

<h2 id="closure">闭包</h2>
应用的两种情况即可——函数作为返回值，函数作为参数传递
>假设函数A在函数B的内部进行定义了，并在函数B的作用域之外执行（不管是上层作用域，下层作用域，还有其他作用域），那么A就是一个闭包

```js
var max = 10,
    fn = function (x) {
        if (x > max) {
            console.log(x); // 15
        }
    };
(function (f) {
    var max = 100;
    f(15);
})(fn);
```

```js
var fn = null;
function foo() {
    var a = 2;
    function innnerFoo() {
        console.log(a);
    }
    fn = innnerFoo; // 将 innnerFoo 的引用，赋值给全局变量中的 fn
}

function bar() {
    fn(); // 此处的保留的 innerFoo 的引用
}

foo();
bar(); // 2
```

在上面的例子中，foo()执行完毕之后，按照常理，其执行环境生命周期会结束，所占内存被垃圾收集器释放。但是通过 fn = innerFoo，函数 innerFoo 的引用被保留了下来，复制给了全局变量 fn。这个行为，导致了 foo 的变量对象，也被保留了下来。于是，函数 fn 在函数 bar 内部执行时，依然可以访问这个被保留下来的变量对象。所以此刻仍然能够访问到变量 a 的值。

这样，我们就可以称 fn 为闭包。

![闭包](../../img/afbdb2ad2330cf982d2b6fd2d6f3bc3a.png)

```js
// 挑战二
scope = 'stone';

function Func() {
    var scope = 'sophie';

    function inner() {
        console.log(scope);
    }
    return inner;
}

var ret = Func();
ret(); // ???
```

```js
// 挑战三
scope = 'stone';

function Func() {
    var scope = 'sophie';

    function inner() {
        console.log(scope);
    }
    scope = 'tommy';
    return inner;
}

var ret = Func();
ret(); // ???
```

```js
// 挑战四
scope = 'stone';

function Bar() {
    console.log(scope);
}

function Func() {
    var scope = 'sophie';
    return Bar;
}

var ret = Func();
ret(); // ???
```

```js
// 挑战五
var name = 'The Window';
var object = {
    name: 'My Object',
    getNameFunc: function () {
        return function () {
            return this.name;
        };
    },
};
console.log(object.getNameFunc()()); // ???
```

```js
var name = 'The Window';
var object = {
    name: 'My Object',
    getNameFunc: function () {
        console.log(this);
        return function () {
            return this.name;
        };
    },
};
console.log(object.getNameFunc()()); // ???
```

<h2 id="this">this</h2>
this的指向，是在函数被调用的时候确定的
在函数执行过程中，this一旦被确定，就不可更改了。

在一个函数上下文中，this 由调用者提供，由调用函数的方式来决定。如果调用者函数，被某一个对象所拥有，那么该函数在调用时，内部的 this 指向该对象。如果函数独立调用，那么该函数内部的 this，则指向 undefined。但是在非严格模式中，当 this 指向 undefined 时，它会被自动指向全局对象。

This 被分为三种情况：全局对象、当前对象或者任意对象;判断处于那种情况，这完全取决于函数的调用方式，JavaScript 中函数的调用有以下几种方式：

-   作为函数调用
-   作为对象方法调用
-   作为构造函数调用
-   使用 apply 或 call 调用

```js
// demo03
var a = 20;
var obj = {
    a: 10,
    c: this.a + 20,
    fn: function () {
        return this.a;
    },
};

console.log(obj.c);
console.log(obj.fn());
```

当 obj 在全局声明时，无论 obj.c 在什么地方调用，这里的 this 都指向全局对象，而当 obj 在函数环境中声明时，这个 this 指向 undefined，在非严格模式下，会自动转向全局对象

```js
'use strict';
var a = 20;
function foo() {
    var a = 1;
    var obj = {
        a: 10,
        c: this.a + 20,
        fn: function () {
            return this.a;
        },
    };
    return obj.c;
}
console.log(foo()); // 运行会报错
```

```js
var a = 20;
var foo = {
    a: 10,
    getA: function () {
        return this.a;
    },
};
console.log(foo.getA()); // 10

var test = foo.getA;
console.log(test()); // 20
```

```js
function foo() {
    console.log(this.a);
}

function active(fn) {
    fn(); // 真实调用者，为独立调用
}

var a = 20;
var obj = {
    a: 10,
    getA: foo,
};

active(obj.getA);
```

补充关于箭头函数的 this

```js
function a() {
    return () => {
        return () => {
            console.log(this);
        };
    };
}
console.log(a()()());
```

注意：箭头函数其实是没有 this 的，这个函数中的 this 只取决于他外面的第一个不是箭头函数的函数的 this。在这个例子中，因为调用 a 符合前面代码中的第一个情况，所以 this 是 window。并且 this 一旦绑定了上下文，就不会被任何代码改变。

<h2 id="conversion">类型转换</h2>

```

[]==[]
//false
[]==![]
//true
{}==!{}
//false
{}==![]
//VM1896:1 Uncaught SyntaxError: Unexpected token ==
![]=={}
//false
[]==!{}
//true
undefined==null
//true

```

有点 js 基础应该知道对象是引用类型,就会一眼看出来[] == []会输出 false,因为左边的[]和右边的[]看起来长的一样,但是他们引用的地址并不同,这个是同一类型的比较,所以相对没那么麻烦

```

var bool = new Boolean(0);
if (bool) {
alert('true');
} else {
alert('false');
}
//true

var bool = Boolean(0);
if (bool) {
alert('true');
} else {
alert('false');
}//false

```

###### 假值

6 个

> 0 或+0、-0，NaN
> ""
> false
> undefined
> null

###### 其他基本类型转化为字符串，基本和预期的一样

```

console.log("" + null); // "null"
console.log("" + undefined); // "undefined"
console.log("" + false); // "false"
console.log("" + true); // "true"
console.log("" + 0); // "0"
console.log("" + NaN); // "NaN"
console.log("" + Infinity); // "Infinity"

```

###### 其他基本类型转化为数字，需要特殊记忆：

```

console.log(+null); // 0
console.log(+undefined); // NaN
console.log(+false); // 0
console.log(+true); // 1
console.log(+""); // 0
console.log(+'1'); // 1
console.log(+'1x'); // NaN

```

###### 引用类型转换为布尔，始终为 true

###### 引用类型转换为字符串

> 1.优先调用 toString 方法（如果有），看其返回结果是否是原始类型，如果是，转化为字符串，返回。 2.否则，调用 valueOf 方法（如果有），看其返回结果是否是原始类型，如果是，转化为字符串，返回。 3.其他报错。

###### 引用类型转化为数字

> 1.优先调用 valueOf 方法（如果有），看其返回结果是否是基本类型，如果是，转化为数字，返回。 2.否则，调用 toString 方法（如果有），看其返回结果是否是基本类型，如果是，转化为数字，返回。 3.其他报错。

首先我们看看常见引用类型 toString 和 valueOf 返回什么？

> var a = {};
> console.dir(a.toString()); // "[object Object]"
> console.dir(a.valueOf()); // 对象本身

> var b = [1, 2, 3];
> console.dir(b.toString()); // "1,2,3"
> console.dir(b.valueOf()); // 对象本身

> var c = [[1],[2]];
> console.dir(c.toString()); // "1,2"
> console.dir(c.valueOf()); // 对象本身

> var d = function() {return 2};
> console.dir(d.toString()); // "function() {return 2}"
> console.dir(d.valueOf()); // 对象本身

因此对应的转换为字符串和数字的情形是：

> var a = {};
> console.dir(a + ""); // "[object Object]"
> console.dir(+a); // NaN

> var b = [1, 2, 3];
> console.dir(b + ""); // "1,2,3"
> console.dir(+b); // NaN

> var c = [[1],[2]];
> console.dir(c + ""); // "1,2"
> console.dir(+c); // NaN

> var d = function() {return 2};
> console.dir(d + ""); // "function () {return 2}"
> console.dir(+d); // NaN

> 再来个报错的情形：
> var a = {};
> a.toString = function() {return {};}
> console.log("" + a); // 报错
> console.log(+a) // 报错

###### 双等号，如果两边类型不同，会有隐式转换发生。犀牛书 75 页总结如下：

> 1，null 和 undefined，相等。
> 2，数字和字符串，转化为数字再比较。
> 3，如果有 true 或 false，转换为 1 或 0，再比较。
> 4，如果有引用类型，优先调用 valueOf。
> 5，其余都不相等。

```

console.log(undefined == false); // false
console.log(null == false); // false
console.log(0 == false); // true
console.log(NaN == false); // false
console.log("" == false); // true

1 == { valueOf: function() {return 1;} } // true
1 + { valueOf: function() {return 1;} } // 2

```

0 == false 之所以为 true 根据第 3 条。
"" == false 之所以为 true 根据第 3 条，变成了"" == 0,再根据第 2 条。

###### NaN

说到 NaN，就不得不提一下 isNaN() 方法，isNaN() 方法自带隐式类型转换，该方法在测试其参数之前，会先调用 Number() 方法将其转换为数字。所以 isNaN('1') 这个语句中明明用一个字符串去测试，返回值仍然为 false 也就不足为怪了。

###### object

当字符串和对象进行 + 运算的时候，Javascript 会通过对象的 toString() 方法将其自身转换为字符串，然后进行连接操作。

> "1" + { toString: function() {return 1;} } // "11"

之所以说它特殊，是因为当一个对象同时包含 toString() 和 valueOf() 方法的时候，运算符 + 应该调用哪个方法并不明显(做字符串连接还是加法应该根据其参数类型，但是由于隐式类型转换的存在，类型并不显而易见。)，Javascript 会盲目的选择 valueOf() 方法而不是 toString() 来解决这个问题。这就意味着如果你打算对一个对象做字符串连接的操作，但结果却是......

```

var obj = {
toString: function() { return "Object CustomObj"; },
valueOf: function() { return 1; }
};

console.log("Object: " + obj); // "Object: 1"

```

第 4 条再来一个例子：

> console.log([[2]] == 2)

其上结果为 true，原因如下：
[[2]]的 valueOf 是对象本身，不是基本类型。
尝试调用 toString 的结果是'2'。
因此变成了'2'和数字 2 的比较。根据第 2 条，相等。WTF!!

```

"1" + 2; // "12"
1 + "2"; // "12"
1 + 2 + "3"; // "33"

console.log(1 + '2' + '2');
console.log(1 + + '2' + '2');
console.log('A' - 'B' + '2');
console.log('A' - "B" + 2);

```

<h2 id="Event">事件循环机制</h2>

> [参考](http://www.jianshu.com/p/12b9f73c5a4f)

> [可以参考 eventloop.js]

-   js 有一个大的特点是是单线程，而这个单线程中拥有唯一的一个事件循环
-   js 除了依靠函数调用栈来搞定函数的执行顺序外，还依靠任务队列(task queue)来搞定另外一些代码的执行。
-   一个线程中，事件循环是唯一的，但是任务队列可以拥有多个。
-   任务队列又分为 macro-task（宏任务）与 micro-task（微任务），在最新标准中，它们被分别称为 task 与 jobs。
-   macro-task 大概包括：script(整体代码), setTimeout, setInterval, setImmediate, I/O, UI rendering。
-   micro-task 大概包括: process.nextTick, Promise, Object.observe(已废弃), MutationObserver(html5 新特性)
-   setTimeout/Promise 等我们称之为任务源。而进入任务队列的是他们指定的具体执行任务。
-   来自不同任务源的任务会进入到不同的任务队列。其中 setTimeout 与 setInterval 是同源的。
-   事件循环的顺序，决定了 JavaScript 代码的执行顺序。它从 script(整体代码)开始第一次循环。之后全局上下文进入函数调用栈。直到调用栈清空(只剩全局)，然后执行所有的 micro-task。当所有可执行的 micro-task 执行完毕之后。循环再次从 macro-task 开始，找到其中一个任务队列执行完毕，然后再执行所有的 micro-task，这样一直循环下去。(**在每一次事件循环中，macrotask 只会提取一个执行，而 microtask 会一直提取，直到 microtasks 队列清空。**)
-   其中每一个任务的执行，无论是 macro-task 还是 micro-task，都是借助函数调用栈来完成。


先执行同步代码，
遇到异步宏任务则将异步宏任务放入宏任务队列中，
遇到异步微任务则将异步微任务放入微任务队列中，
当所有同步代码执行完毕后，再将异步微任务从队列中调入主线程执行，
微任务执行完毕后再将异步宏任务从队列中调入主线程执行，
一直循环直至所有任务执行完毕。



```js
// setTimeout 中的回调函数才是进入任务队列的任务
setTimeout(function () {
    console.log('xxxx');
});
// 非常多的同学对于 setTimeout 的理解存在偏差。所以大概说一下误解：
// setTimeout 作为一个任务分发器，这个函数会立即执行，而它所要分发的任务，也就是它的第一个参数，才是延迟执行
```

demo

```js
// 为了方便理解，我以打印出来的字符作为当前的任务名称
setTimeout(function () {
    console.log('timeout1');
});

new Promise(function (resolve) {
    console.log('promise1');
    for (var i = 0; i < 1000; i++) {
        i == 99 && resolve();
    }
    console.log('promise2');
})
    .then(function () {
        console.log('then1');
    })
    .then(function () {
        console.log('then2');
    });

console.log('global1');
```

首先，事件循环从宏任务队列开始，这个时候，宏任务队列中，只有一个 script(整体代码)任务。每一个任务的执行顺序，都依靠函数调用栈来搞定，而当遇到任务源时，则会先分发任务到对应的队列中去，所以，上面例子的第一步执行如下图所示。
![1](../../img/599584-92fc0827aa39e325.png)

第二步：script 任务执行时首先遇到了 setTimeout，setTimeout 为一个宏任务源，那么他的作用就是将任务分发到它对应的队列中。
![2](../../img/599584-2a99131c2572f898.png)

第三步：script 执行时遇到 Promise 实例。Promise 构造函数中的第一个参数，是在 new 的时候执行，因此不会进入任何其他的队列，而是直接在当前任务直接执行了，而后续的.then 则会被分发到 micro-task 的 Promise 队列中去。

因此，构造函数执行时，里面的参数进入函数调用栈执行。for 循环不会进入任何队列，因此代码会依次执行，所以这里的 promise1 和 promise2 会依次输出。

![3](../../img/599584-774ec33de48c1d41.jpg)
![4](../../img/599584-8b5e93798f6c9d52.png)
![5](../../img/599584-521c5da565a35a45.png)
script 任务继续往下执行，最后只有一句输出了 globa1，然后，全局任务就执行完毕了。

第四步：第一个宏任务 script 执行完毕之后，就开始执行所有的可执行的微任务。这个时候，微任务中，只有 Promise 队列中的一个任务 then1，因此直接执行就行了，执行结果输出 then1，当然，他的执行，也是进入函数调用栈中执行的。
![6](../../img/599584-dd7673edbbe5e687.png)
第五步：当所有的 micro-tast 执行完毕之后，表示第一轮的循环就结束了。这个时候就得开始第二轮的循环。第二轮循环仍然从宏任务 macro-task 开始。
![7](../../img/599584-881e739c134cb6c9.jpg)
这个时候，我们发现宏任务中，只有在 setTimeout 队列中还要一个 timeout1 的任务等待执行。因此就直接执行即可。
![8](../../img/599584-c4ea234b27c5f2f2.png)
这个时

<h5 id="settimeout">定时器的面试题</h5>

> [80% 应聘者都不及格的 JS 面试题](https://juejin.im/post/58cf180b0ce4630057d6727c)

```js
console.log(1);

setTimeout(function () {
    console.log(2);
}, 0);

\$.ajax({
    url: '../index.php', //假如上一级目录下有 php 文件，并且 echo '3';
    data: 'GET',
    success: function (data) {
        console.log(data);
    },
});

new Promise(function (resolve, reject) {
    console.log(4);
    resolve();
})
    .then(function () {
        console.log(5);
    })
    .then(function () {
        console.log(6);
    });
console.log(7);
```

```js
for (var i = 0; i < 5; i++) {
    setTimeout(
        (function (i) {
            console.log(i);
        })(i),
        i * 1000
    );
}
```

蛤？什么鬼，这是什么情况，让我想想。这里给 setTimeout 传递了一个立即执行函数。额，setTimeout 可以接受函数或者字符串作为参数，那么这里立即执行函数是个啥呢，应该是个 undefined ，也就是说等价于：

setTimeout(undefined, ...);
而立即执行函数会立即执行，那么应该是立马输出的。

“应该是立马输出 0 到 4 吧。”

<h2 id="isElement">数据判断</h2>

《编写可维护的 JavaScript》 中提提到的数据监测方法

-   string number undefined boolean

> 这四中数据类型使用 typeof 在检测即可

```js
typeof '1' == 'string';
typeof 1 == 'number';
typeof found == 'boolean' && found;
typeof undefined == 'undefined';
```

-   null

> 使用 value === null

-   引用类型

>

    1. 一般
         * 使用instanceof
    2. array
        * Array.prototype.toString.call(array) == '[object Array]'

-   function

> typeof fn === 'function'

```js
_.isElement = function (obj) {
    return obj && obj.nodetype === 1;
};
```

如果 dom 的 nodeType 的属性,返回 boolean

-   typeof NaN (number)

```js
// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
_.each(
    ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'],
    function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    }
);
```

// null 的类型有些特殊，typeof null == 'object' null == undefined ,检测他就和 null 自身比较，null 用处多是初始化变量，这个变量可能是个对象在没有给变量赋值的时候，理解 null 可以是对象的占位符 可以 var value = null;

```js
_.isNull = function (obj) {
    return obj === null;
};
```

// 看到源码可以知道，函数也被视为对象，undefined，null，NaN 等则不被认为是对象
// javascript 函数和 object 都是对象,其中 null 也是 object 要注意使用!!object 来判断

```js
_.isObject = function (obj) {
    var type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
};
```

```js
if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function (obj) {
        return typeof obj == 'function' || false;
    };
}
```

```js
_.isBoolean = function (obj) {
    return (
        obj === true ||
        obj === false ||
        toString.call(obj) === '[object Boolean]'
    );
};
```

// 对于 Arguments 判断，IE9 以前的版本，Object.prototype.toString 返回的会是'[object Object]'而不是'[object Arguments]，需要通过判断对象是否具有 callee 来确定其是否 Arguments 类型，underscore 对此进行了修正：

```js
if (!_.isArguments(arguments)) {
    _.isArguments = function (obj) {
        return _.has(obj, 'callee');
    };
}
```

// 使用 void 0 原因是 undefined 可以被重写

```js
_.isUndefined = function (obj) {
    return obj === void 0;
};
```

在 underscore 对象 api 中，很多函数内部都可以见到下面的一段代码：
var obj = Object(obj);
这段代码的意义是：
如果 obj 是一个对象，那么 Object(obj)返回 obj
**如果 obj 是 undefined 或 null，那么 Object(obj)返回一个{}**
如果 obj 是一个原始值(Primitive value)，那么 Object(obj)返回一个被包裹的原始值:

```js
var obj = 2;
obj = Object(obj); // 相当于 new Number(obj);
// => obj: Number {[[PrimitiveValue]]: 2}
var value = obj.valueOf();
// => value: 2
```

Object(obj)就是将传入 obj 进行对象化

<h2 id="clone">Array.prototype.slice新发现</h2>
当obj 为array的时候，进行浅复制，发现使用obj.slice()，难道slice有浅复制的功能，查了一下MDNr原文如下：

-   slice() 方法将数组的一部分**浅拷贝**, 返回到从开始到结束（不包括结束）选择的新数组对象。原始数组不会改变\*

```js
_.clone = function () {
    if (_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
};
```

关于这个方法还有

```js
// 使用 slice 方法从 myCar 中创建一个 newCar.
var myHonda = { color: 'red', wheels: 4, engine: { cylinders: 4, size: 2.2 } };
var myCar = [myHonda, 2, 'cherry condition', 'purchased 1997'];
var newCar = myCar.slice(0, 2);

// 输出 myCar, newCar,以及各自的 myHonda 对象引用的 color 属性.
print('myCar = ' + myCar.toSource());
print('newCar = ' + newCar.toSource());

//结果是：
myCar = [
    { color: 'red', wheels: 4, engine: { cylinders: 4, size: 2.2 } },
    2,
    'cherry condition',
    'purchased 1997',
];
newCar = [{ color: 'red', wheels: 4, engine: { cylinders: 4, size: 2.2 } }, 2];

//也就是 myHonda 是一个整体来进行计算的
```

<h2 id="isEqual">对象相等性判断</h2>

在进行 a 和 b 的比较的过程中，面临如下的问题：
有如下的:

-   `0 === -0`
-   `null === undefined`
-   `NaN != NaN`
-   `NaN !== NaN`

方法：

-   `0 === -0` 解决
    对于该问题，我们可以借助如下等式解决
    `1 / a === 1 / b`

-   NaN != NaN 及 NaN !== NaN：
    如果我们要认为 NaN 等于 NaN（这更加符合认知和语义），我们只需要：
    `if(a !== a) return b !== b`

<h2 id="debounceThrottle">函数节流和防抖</h2>

有些方法触发时会被频发触发，致使产生性能问题

1. window 对象的 resize、scroll 事件

2. 拖拽时的 mousemove 事件

3. 射击游戏中的 mousedown、keydown 事件

4. 文字输入、自动完成的 keyup 事件

所以我们需要使用函数节流和函数

防抖来解决这个问题

```js
// 函数防抖 debounce
window.addEventListenter(
    'scroll',
    (function () {
        var timer;
        return function () {
            if (timer) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    console.log('do somthing');
                }, 500);
            }
        };
    })()
);
```

```js
// 函数节流
window.addEventListenter(
    'scroll',
    (function () {
        var timer;
        var startTime = new Date();
        return function () {
            var crrtime = new Daate();
            if (crrtime > startTime) {
                timer = setTimeout(function () {
                    console.log('do somthing');
                }, 500);
                starttime = curTime;
            }
        };
    })()
);
```

<!-- <meta http-equiv="refresh" content="1"> -->
