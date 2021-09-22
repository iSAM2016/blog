// 流 水流 有方向
// 读流 和 写流 ,双工流,转换流

const fs = require('fs');
const path = require('path');

const rr = fs.createReadStream(path.join(__dirname, 'a.text'), {
    flags: 'r', // 如何操作文件
    encoding: null, // 读取文件的编码格式 默认buffer
    autoClose: true, // 读取完毕后 是否自动关闭
    start: 0, // 开始读取的位置
    end: 15, // 结束位置( 包后 )
    highWaterMark: 4 // 64k每次默认读取64k
});

//  默认情况下 非流动模式 如果监听了on(data),事件就会变为流动模式，不断的读取文件读取完毕最快速速度时候，是触发
//  end 事件
rr.on('open', () => {
    console.log('open file');
});

rr.on('data', data => {
    console.log(data);
});

rr.on('end', data => {
    console.log('end');
});

rr.on('close', data => {
    console.log('close');
});

rr.on('error', data => {
    console.log('error');
});
