let fs = require("fs");
let path = require("path");
let json = require("./index.json");

// node  在处理路径的时候一般是处理为绝对路径
//__dirname 父路径 不是global 的属性
let r = readFileSync(path.join(__dirname, "1ndex.js"), "utf8");
let exits = exitsSync(path.join(__dirname, "1ndex.js")); // 文件是否存在

console.log(path.join(__dirname, "common.js", "a")); //获取文件路径
console.log(path.basename("common.js.jk", ".js.jk")); // 去除基本名字
console.log(path.extname("1.main.aas.js")); // 取后缀名字
console.log(path.dirname(__dirname)); // 获取父路径

// 让字符串执行
// 1) 第一种
let a = 100;
evel("console.log(a)"); // 沙箱

// 2) 第二种
let str = "console.log(1)";
let fn = new Function("a", str);
fn(1);

//  3) node 执行字符串
// let vm = require("vm");
// let str = "console.log(a)";
// vm.runInNewContext(str);
