const event = require('events');
const fs = require('fs');
const path = require('path');
// 流 水流 有方向
// 读流 和 写流 ,双工流,转换流
let EventEmitter = require('events');
let fs = require('fs');
class ReadStream extends EventEmitter {
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.flags = options.flags || 'r';
        this.encoding = options.encoding || null;
        this.mode = options.mode || 0o666;
        this.start = options.start || 0;
        this.end = options.end || null;
        this.highWaterMark = options.highWaterMark || 64 * 1024;
        this.autoClose = options.autoClose || true;
        // 定义一个控制读取的偏移量 默认和start是一样的
        this.pos = this.start;

        // 默认叫非流动模式 就是不出结果，只有on('data') 时 flowing的值变为 true
        this.flowing = null;

        this.open(); //1s之后才能获取 拿到fd操作符号的 fd默认是异步获取的 this.emit('open')

        this.buffer = Buffer.alloc(this.highWaterMark);
        this.on('newListener', type => {
            // 用户监听了data事件
            if (type === 'data') {
                this.flowing = true;
                this.read();
            }
        });
    }
    read() {
        //读取数据
        // 利用发布订阅的模式 当某个值有了后通知我继续读取
        if (typeof this.fd !== 'number') {
            return this.once('open', () => this.read());
        }
        // 我们需要搞一个buffer用来存放读取到的内容，为了性能好，每次用同一个内存
        // 1 2 3  this.pos = 3
        // 4 5 6  this.pos = 6
        // 7 每次读取的时候要看一下还要读多少个 Math.min

        let howMuchToRead = this.end
            ? Math.min(this.highWaterMark, this.end - this.pos + 1)
            : this.highWaterMark;
        // 每次读取的个数
        fs.read(
            this.fd,
            this.buffer,
            0,
            howMuchToRead,
            this.pos,
            (err, byteReads) => {
                // byteReads真实读取到的个数
                // 可以拿到读取的内容了 this.buffer
                if (byteReads > 0) {
                    this.pos += byteReads;
                    let r = this.buffer.slice(0, byteReads); // 截取有效的字节
                    r = this.encoding ? r.toString(this.encoding) : r;
                    this.emit('data', r); // 发射读取到的结果

                    // 判断是否是流动模式
                    if (this.flowing) {
                        this.read();
                    }
                } else {
                    this.emit('end');
                    if (this.autoClose) {
                        this.destroy();
                    }
                }
            }
        );
    }
    resume() {
        this.flowing = true;
        this.read();
    }
    pause() {
        this.flowing = false;
    }
    destroy() {
        // 用来关闭的
        if (typeof this.fd === 'number') {
            fs.close(this.fd, () => {
                this.emit('close');
            });
        } else {
            this.emit('close');
        }
    }
    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) {
                // 如果打开文件出错就发射 错误事件
                this.emit('error', err);
                // 如果需要自动关闭 关闭文件
                if (this.autoClose) {
                    this.destroy();
                }
                return;
            }
            this.fd = fd;
            this.emit('open', this.fd); // 当前fd拿到了，并且触发open事件
        });
    }
    pipe(ws) {
        this.on('data', function(data) {
            let flag = ws.write(data);
            if (!flag) {
                this.pause();
            }
        });
        ws.on('drain', () => {
            this.resume();
        });
    }
}

module.exports = ReadStream;
const rr = new ReadStream(path.join(__dirname, 'a.text'), {
    flags: 'r', // 如何操作文件
    encoding: null, // 读取文件的编码格式 默认buffer
    autoClose: true, // 读取完毕后 是否自动关闭
    start: 0, // 开始读取的位置
    end: 15, // 结束位置( 包后 )
    highWaterMark: 4, // 64k每次默认读取64k
    autoClose: true
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
