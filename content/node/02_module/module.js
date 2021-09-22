let path = require('path');
let fs = require('fs');
let vm = require('vm');

// 第一步 要解析出一个绝对路径
// 第二步 如果文件不存在 添加 .js .json .node
// 第三步 上缓存里通过名字查找一下有没有加载过
// 第四步 创建一个模块 模块里有有个this.exports的对象
// 第五步 把模块放到缓存中
// 第六步 记载这个模块 根据文件后缀加载
// 文件模块 都是相对路径
// let a = require("./b"); // 会自动的去添加.js后缀 .json .node

// let r = readFileSync(path.join(__dirname, "1ndex.js"), "utf8");
// let exits = exitsSync(path.join(__dirname, "1ndex.js")); // 文件是否存在

// exports = module.exports

function Module(id) {
    this.id = id;
    this.exports = {}; // 模块导出的结果
}
Module.wrapper = [
    '(function(exports,require, module,__filename, __dirname){',
    '\n})'
];
Module.wrap = function(script) {
    return Module.wrapper[0] + script + Module.wrapper[1];
};

Module._extensions = {
    '.js': function(module) {
        let str = fs.readFileSync(module.id, 'utf8');
        // 读取文件的内容
        let fnStr = Module.wrap(str); // 返回的是函数字符串
        let fn = vm.runInThisContext(fnStr);
        // 让产生的函数执行
        // fn.call(module.exports, req, module, path.basename(module.id), module.id);
        fn.call(module.exports, module.exports, module, req); // 会在内部把结果赋值到exports属性上
    },
    '.node': function() {},
    '.json': function(module) {
        let contentStr = fs.readFileSync(module.id);
        module.exports = JSON.parse(contentStr);
    }
};

Module._resolveFilename = function(relativepath) {
    //  怕段路径是否后缀
    let filepath = path.join(__dirname, relativepath);
    let isexitfile = fs.existsSync(filepath);
    //  存在文件
    if (isexitfile) {
        return filepath;
    }
    let fileExtname = path.extname(relativepath);
    // 存在后缀名
    if (fileExtname !== '') {
        return false;
    }
    let keys = Object.keys(Module._extensions);
    let r = false;
    for (let val of keys) {
        //  循环key
        let realPath = filepath + val; //拼接出文件路径
        let exists = fs.existsSync(realPath); // 找到后把路径抛出去
        if (exists) {
            r = realPath;
            break;
        }
    }
    if (!r) {
        throw new Error('file not exists');
    }
    return r;
};

Module.prototype.load = function(filename) {
    let extname = path.extname(filename);
    Module._extensions[extname](this);
};

function req(path) {
    let filename = Module._resolveFilename(path);

    console.log(filename);
    let module = new Module(filename);
    module.load(filename); // 加载自己 {exports:{xxxx}}
    return module.exports;
}

let a = req('./index');
console.log(a); // 缓存的机制
