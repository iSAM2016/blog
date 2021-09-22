-   [1. 什么是 Buffer](#1-%E4%BB%80%E4%B9%88%E6%98%AF-buffer)

# 1. 什么是 Buffer

-   JS 语言没有二进制数据类型，而在处理 TCP 和文件流的时候，必须要处理二进制数据。
-   NodeJS 提供了一个 Buffer 对象来提供对二进制数据的操作
-   是一个表示固定内存分配的全局对象，也就是说要放到缓存区中的字节数需要提前确定
-   Buffer 好比由一个 8 位字节元素组成的数组，可以有效的在 JavasScript 中表示二进制数据

# 2. 什么是字节

-   字节(Byte)是计算机存储时的一种计量单位，一个字节等于 8 位二进制数
-   一个位就代表一个 0 或 1，每 8 个位（bit）组成一个字节（Byte）
-   字节是通过网络传输信息的单位
-   一个字节最大值十进制数是 255 2\*\*8-1;

## 进制

-   0b 2 进制
-   0x 16 进制
-   0o 8 进制

将任意进制字符串转换为十进制

```
parseInt("11", 2); // 3 2 进制转 10 进制
parseInt("77", 8); // 63 8 进制转 10 进制
parseInt("e7", 16); //175 16 进制转 10 进制
将 10 进制转换为其它进制字符串
(3).toString(2)) // "11" 十进制转 2 进制
(17).toString(16) // "11" 十进制转 16 进制
(33).toString(32) // "11" 十提制转 32 进制
```

# 3. 定义 buffer 的三种方式

## 3.1 通过长度定义 buffer

```
// 创建一个长度为 10、且用 0 填充的 Buffer。
const buf1 = Buffer.alloc(10);
// 创建一个长度为 10、且用 0x1 填充的 Buffer。
const buf2 = Buffer.alloc(10, 1);
// 创建一个长度为 10、且未初始化的 Buffer。
const buf3 = Buffer.allocUnsafe(10);
```

## 3.2 通过数组定义 buffer

```
// 创建一个包含 [0x1, 0x2, 0x3] 的 Buffer。
const buf4 = Buffer.from([1, 2, 3]);
正常情况下为 0-255 之间;
```

## 3.3 字符串创建

```
const buf5 = Buffer.from('珠峰培训');
```

# 4.buffer 常用方法

## 4.1 buf.fill(value[, offset[, end]][, encoding])

手动初始化,擦干净桌子,将 buffer 内容清 0

```
buffer.fill(0);
```

## 4.2 write 方法

```
buf.write(string[, offset[, length]][, encoding])

buffer.write('珠',0,3,'utf8');
buffer.write('峰',3,3,'utf8'); //珠峰
```

## 4.3 writeInt8

```
var buf = new Buffer(4);
buf.writeInt8(0,0);
buf.writeInt8(16,1);
buf.writeInt8(32,2);
buf.writeInt8(48,3);//16*3*/
console.log(buf);
console.log(buf.readInt8(0));
console.log(buf.readInt8(1));
console.log(buf.readInt8(2));
console.log(buf.readInt8(3));
```

### 4.3.1 Little-Endian&Big-Endian

不同的 CPU 有不同的字节序类型，这些字节序是指整数在内存中保存的顺序。

-   Big-endian：将高序字节存储在起始地址（高位编址）
-   Little-endian：将低序字节存储在起始地址（低位编址）

```
let buf3 = new Buffer(4);
buf3.writeInt16BE(2\*\*8,0);
console.log(buf3);//<Buffer 01 00 00 00>
console.log(buf3.readInt16BE(0));
buf3.writeInt16LE(2\*\*8,2);
console.log(buf3);//<Buffer 01 00 00 01>
console.log(buf3.readInt16LE(2));

```

## 4.3 toString 方法

buf.toString([encoding[, start[, end]]])

```
buffer.toString('utf8',3,6)
```

## 4.4 slice 方法

buf.slice([start[, end]])

```
let newBuf = buffer.slice(0,4);
```

### 4.4.1 截取乱码问题

```
let {StringDecoder} = require('string_decoder');
let sd = new StringDecoder();
let buffer = new Buffer('珠峰');
console.log(sd.write(buffer.slice(0,4)));
console.log(sd.write(buffer.slice(4)));

```

## 4.5 copy 方法

复制 Buffer 把多个 buffer 拷贝到一个大 buffer 上

```
buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])
```

```
let buf5 = Buffer.from('珠峰培训');
let buf6 = Buffer.alloc(6);
buf5.copy(buf6,0,0,4);
buf5.copy(buf6,3,3,6);
//buf6=珠峰
```

```
Buffer.prototype.copy2 = function(targetBuffer,targetStart,sourceStart,sourceEnd){
    for(let i=sourceStart;i<sourceEnd;i++){
        target[targetStart+i] = this[i];
    }
}
```

## 4.6 concat 方法

```
Buffer.concat(list[, totalLength])
```

```
let buf1 = Buffer.from('珠');
let buf2 = Buffer.from('峰');
let buf3 = Buffer.concat([buf1,buf2],3);
console.log(buf3.toString());
```

```
Buffer.concat2 = function (list = [], total = list.reduce((len, item) => len + item.length, 0)) {
    if (list.length == 1)
        return list[0];
    let result = Buffer.alloc(total);
    let pos = 0;
    for (let bf of list) {
        for (let b of bf) {
            if (pos < total)
                result[pos++] = b;
            else
                return result;
        }
    }
    return result;
}
```

```
Buffer.myConcat = function(list,totalLength=list.reduce((len,item)=>len+item.length,0)){
  if(list.length==0)
    return list[0];
  let newBuffer = Buffer.alloc(totalLength);
  let offset = 0;
  for(let i=0;i<list.length;i++){
    if(offset+list[i].length>totalLength){
      list[i].copy(newBuffer,offset,0,totalLength-offset);
      break;
    }else{
      list[i].copy(newBuffer,offset,0,list[i].length);
      offset+=list[i].length;
    }
  }
  return newBuffer;
}
```

## 4.7 isBuffer

判断是否是 buffer

Buffer.isBuffer

## 4.8 length

获取字节长度(显示是字符串所代表 buffer 的长度)

Buffer.byteLength("珠峰");
buffer.length;

# 6. base64

Base64 是网络上最常见的用于传输 8Bit 字节码的编码方式之一，Base64 就是一种基于 64 个可打印字符来表示二进制数据的方法。
Base64 要求把每三个 8Bit 的字节转换为四个 6Bit 的字节（38 = 46 = 24），然后把 6Bit 再添两位高位 0，组成四个 8Bit 的字节，也就是说，转换后的字符串理论上将要比原来的长 1/3

```
const CHARTS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function transfer(str){
let buf = Buffer.from(str);
let result = '';
for(let b of buf){
result += b.toString(2);
}
return result.match(/(\d{6})/g).map(val=>parseInt(val,2)).map(val=>CHARTS[val]).join('');
}
let r = transfer('珠');//54+g
```
