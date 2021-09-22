// js 
const buf1 = Buffer.alloc(10);
console.log(buf1);

const buf2 = Buffer.alloc(10, 1)
console.log(buf2)
console.log(Buffer.from('你好'))

buf2.fill(0)
console.log(buf2)

// buffer是二进制(存的是16进制) 表示的是内存
// fs读取文件 buffer类型
// buffer可以和字符串相互转化 toString()

// 声明的方式 最小单位都是字节 内存是很珍贵 我申请好了 就不能随意增加或者删除
console.log(Buffer.alloc(6)); // 声明空间

console.log(Buffer.from([1111, 2, 3]));

console.log(Buffer.from('珠峰')); // 通过字符串声明是定长的 

// 默认情况下 Buffer不支持 gbk编码
// gbk -> utf8  iconv-lite可以处理乱码
let fs = require('fs');
let r = fs.readFileSync('./1.txt');
let iconvLite = require('iconv-lite');
r = iconvLite.decode(r, 'gbk');
console.log(r);

// 掌握常用的方法 (字节的长度)
console.log(Buffer.from('珠峰培训峰').indexOf('峰', 6));

// 截取buffer 可以使用slice方法
Buffer.prototype.split = function (sep) {
    let pos = 0;
    let index = 0;
    let arr = []
    let len = Buffer.from(sep).length;
    while (-1 != (index = this.indexOf(sep, pos))) {
        arr.push(this.slice(pos, index));
        pos = index + len;
    }
    arr.push(this.slice(pos))
    return arr
}
let arrSplit = Buffer.from('珠峰*我*珠峰*我*珠峰').split('*我*');
console.log(arrSplit);

// copy 拷贝
Buffer.prototype.copy = function (targetBuffer, targetStart, sourceStart, SourceEnd) {
    sourceStart = sourceStart ? sourceStart : 0
    SourceEnd = SourceEnd ? SourceEnd : this.length
    for (let i = sourceStart; i < SourceEnd; i++) {
        // 把内容考到对应的buffer的身上
        targetBuffer[targetStart++] = this[i];
    }
}
let buffer = Buffer.alloc(12); // [1,1,1,]
let buf1 = Buffer.from('珠');
let buf2 = Buffer.from('峰培训');
buf1.copy(buffer, 0);
buf2.copy(buffer, 3, 3, 6);
console.log(buffer.toString());


Buffer.concat = function (bufferArray, len) {
    len = typeof len === 'undefined' ? bufferArray.reduce((prev, next, current) => prev + next.length, 0) : len;
    // 计算出一个大的buffer来
    let buffer = Buffer.alloc(len);
    let pos = 0;
    for (let i = 0; i < bufferArray.length; i++) {
        // 把数组里的每一个buffer全部拷贝上去
        bufferArray[i].copy(buffer, pos);
        // 每次拷贝后累加自身的长度
        pos += bufferArray[i].length;
    }
    return buffer;
}
let buf1 = Buffer.from('珠');
let buf2 = Buffer.from('峰培训');
let newBuffer = Buffer.concat([buf1, buf2, buf1]);
console.log(newBuffer.toString());

// fs 文件系统 buffer

// fs.read / write 手写流