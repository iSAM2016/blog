// 创建一个空对象
// 首先，body-parser 中间件的作用是给 req 添加属性 body，值为对象，以键值对的形式存储请求体中的参数；
// 其次，body-parser 只处理 POST 请求；
// 最后，body-parser 模块导出一个对象，上面有两个方法 urlencoded 和 json，分别处理表单提交和 json 格式的请求体参数。
var parsers = Object.create({});
var deprecate = require('depd')('body-parser');

exports = module.exports = bodyParser;

Object.defineProperty(exports, 'json', {
    configurable: true,
    enumerable: true,
    get: createParserGetter('json')
});
/**
 * Module exports.
 */

function bodyParser(options) {
    var opts = {};

    // exclude type option
    if (options) {
        for (var prop in options) {
            if (prop !== 'type') {
                opts[prop] = options[prop];
            }
        }
    }

    var _json = exports.json(opts);
    // 1.需要返回一个中间件固定函数
    return function bodyParser(req, res, next) {
        _json(req, res, function(err) {
            if (err) return next(err);
        });
    };
}

// 返回get 监听函数
function createParserGetter(name) {
    return function get() {
        console.log(parsers);
        return loadParser(name); // 返回的是函数
    };
}

function loadParser(parserName) {
    var parser = parsers[parserName]; // parser = {json:}

    switch (parserName) {
        case 'json':
            parser = require('./lib/types/json');
            break;
    }
    // console.log(parser);
    // store to prevent invoking require()
    // 注意：这个函数返回的是一个函数， 不是对象 ，代表着给对象复制，并返回函数
    return (parsers[parserName] = parser);
}
