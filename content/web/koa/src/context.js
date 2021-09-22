// 上下文对象
// 代理 本身没有属性
let proto = {};
// ctx.path
function defineGetter(target, property) {
    proto.__defineGetter__(property, function() {
        return this[target][property];
    });
}
function defineSetter(target, property) {
    proto.__defineSetter__(property, function(value) {
        this[target][property] = value;
    });
}
// ctx.path = ctx.request.path;
defineGetter('request', 'path');
defineGetter('request', 'query');
defineGetter('response', 'body');
// ctx.body = ctx.response.body;
defineSetter('response', 'body');

module.exports = proto;
