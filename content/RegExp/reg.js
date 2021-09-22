let str1 = '珠峰2017你好2018';
let str2 = '2017j2018';

var reg = /\d+/; // 如果没有修饰符，则表示包含 某某某 即可
var reg = /^\d+/;
var reg = /^\d+$/; //  ^和$ 只是一个修饰或者声明，不会占据字符串的位置

console.log(reg.test(str2));

/**
 * /
 */
// . 匹配的是 除\n 之外的任意字符
var reg = /^2.3$/;

console.log(reg.test('2.3')); // => true
console.log(reg.test('2+3')); // => true

var reg = /^2\.3$/;
console.log(reg.test('2+3')); // => false

// \\d 同时出现会变成  \\
// 正则里面是不允许一个 \ 出现 例如 ‘\’
var reg = /^\\\d$/;
console.log(reg.test('\\9')); // => true

var reg = /^\\d$/;
console.log(reg.test('\\d')); // => true
console.log(reg.test('\\9')); // => false

/**
 *会匹配很多
 * 18 或 19
 * 以 1 开头以 9 结尾 中间是 8或 1
 * 以 18 开头或者19 结尾即可
 */
var reg = /^18|19$/;

var reg = /^(18|19)$/;

console.log(reg.test('1919')); // => false
console.log(reg.test('1818')); // => false
console.log(reg.test('181')); // => false
console.log(reg.test('1819')); // => false

/**
 * ()
 * 改变默认的优先级
 * 分组引用 \1 \2
 * 分组捕获
 */

/**
 * 引用
 */

var reg = /^([a-z])([a-z])\1([a-z])$/;
console.log(reg.test('hthp')); // => true

var reg = /^([a-z])([a-z])\2([a-z])$/;
console.log(reg.test('http')); // => true

var reg = /^[a-zA-Z0-9_]$/; // => \w

// 中括号中出现的元字符，一般都代表本身的含义
var reg = /^[.?+&]+&/; // 中括号里面代表四个元字符都是本身含义，具有消磁作用

//  检测一个class类名
var reg = /^[\w][\w-]*$/;
console.log(reg.test('t'));

//  检测一个html 标签 是否有效
var reg = /<[a-z]+><\/[a-z]+>/;
console.log(reg.test('<span></span>'));

/**
 * 分组
 *
 */
var reg = /(abc){2}/; // => abcabc
console.log(reg.test('abcabcc'));

var reg = /(123|456){2}/; // => 匹配 123123、456456、123456、456123

/**
 * 分组
 *
 *
 * 1. 捕获分组(默认)
 * 2. 非捕获分组
 *
 */
var reg = /(abc){2}/; // => abcabc
console.log(reg.test('abcabcc'));

var reg = /(123|456){2}/; // => 匹配 123123、456456、123456、456123

'123'.match(/(?:123)/); // 返回 ['123']
'123'.match(/(123)/); // 返回 ['123', '123']

/** 反义 */

/*
 * 验证18-65 之前的年龄
 *
 * 分阶段
 *
 * var  reg = /^[18-65]$/; => 1 或者 8-6 或者 5
 * 小括号在中括号中失效
 *
 * 1 18-19
 * 2 20-59
 * 3 60-65
 */
var reg = /^((18|19)|([2-5]\d)|(6[0-5]))$/;
console.log(reg.test(17));

// match
console.log('abcabc'.match(/abc/g));

//  replace
console.log('abc'.replace('ab', 'b'));
console.log('abc'.replace(/[abc]/, 'y'));
console.log('abc'.replace(/[abc]/g, 'y'));

// 函数
let str = 'abc'.replace(/\w/g, function(match, $1, $2) {
    return match + '_';
});

console.log(str);

//  常用的例子

// 电话 010-xxxx xxx

//  13 17 18

var reg = /^1[378]\d{9}$/;
console.log(reg.test('17610393505'));
//  邮箱

var reg = /^\w+@[0-9a-zA-Z]+\.com$/;
console.log(reg.test('1228901986@qq.com'));

// 去除字符串的前后空白
var reg = str.replace(/^\s*|\s*$/g, '');

// 给定这样一个连字符串，写一个function转换为驼峰命名法形式的字符串 getElementById
var s1 = 'get-element-by-id';

function changstr(str) {
    return str.replace(/-\w/g, function(match, p1) {
        console.log(match);
        return match.slice(1).toUpperCase();
    });
}
console.log(changstr(s1));

// 2、判断字符串是否包含数字
var reg = /\d/g;
console.log(reg.test('le0kl'));

/**
 * 4、判断是否符合指定格式
 * 给定字符串str，检查其是否符合如下格式
 * XXX-XXX-XXXX
 * 其中X为Number类型
 */

var reg = /^(\d{3}-)\1\d{4}$/;
console.log(reg.test('000-000-0000'));

/**op
 * 5、判断是否符合USD格式
 * 给定字符串 str，检查其是否符合美元书写格式
 *
 * 以 $ 开始
 * 整数部分，从个位起，满 3 个数字用 , 分隔
 * 如果为小数，则小数部分长度为 2
 * 正确的格式如：$1,023,032.03 或者 $2.03，错误的格式如：$3,432,12.12 或者 $34,344.3**
 */

var reg = /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/;
console.log(reg.test('$2.03'));
console.log(reg.test('$89.03'));
console.log(reg.test('$1,289.'));
console.log(reg.test('$3,432,12.12'));
console.log(reg.test('$34,344.3**'));

/**00
 * 正向边界 匹配 rex 前边的东西
 */
var con = 'coming soon,going gogogo';
var reg = /\b[\w]+(?=ing\b)/g; //匹配带ing的单词，但是不要ing。注意：如果ing后不加\b，类似于goingabc也会匹配。
console.log(con.match(reg));

function format(number) {
    var regx = /\d{1,3}(?=(\d{3})+$)/g;
    return (number + '').replace(regx, '$&,'); // $&表示与regx相匹配的字符串
}
console.log(format('9999999'));

// 12、判断日期格式是否符合 '2017-05-11'的形式，简单判断，只判断格式

var regx = /^\d{4}\-\d{2}-\d{2}$/;
