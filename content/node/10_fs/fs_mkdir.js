/* 创建文件夹
 * @Author: isam2016
 * @Date: 2018-12-30 13:25:53
 * @Last Modified by:   isam2016
 * @Last Modified time: 2018-12-30 13:25:53
 *
 *
 * 本质上讲，fs.readFile()方法是对fs.read()方法的进一步封装，
 * fs.readFile()方法可以方便的读取文件的全部内容。
 */

let fs = require('fs');
let path = require('path');
let access = promisify(fs.access);
let mkdir = promisify(fs.mkdir);
// 同步是async
let r = fs.readFileSync(path.join(__dirname, 'util.js'), {
    encoding: 'utf8',
    flag: 'r'
});
// 异步
fs.readFile(path.join(__dirname, 'util.js'), 'utf8', function(err, data) {
    // console.log(data)
});

//写文件
// 写文件会是以二进制的形式写入
fs.writeFile(path.join(__dirname, 'test.js'), '{data: 1}', function(err) {
    // console.log('succes');
});

/**
 * 创建文件夹
 *
 * 递归实现
 * @param {} p
 */
function mdkirnext(p, callback) {
    let paths = p.split('/');
    let index = 0;
    function next() {
        if (index === paths.length) {
            callback();
            return false;
        }
        let realPath = paths.slice(0, ++index).join('/');
        fs.mkdir(realPath, function(er) {
            next();
        });
    }
    next();
}

/**
 * 创建文件夹
 *
 * async 实现
 * @param {} p
 */
async function mkdirasync(p) {
    let paths = p.split('/');
    for (let i = 0; i <= paths.length; i++) {
        let realPath = paths.slice(0, i + 1).join('/');
        try {
            await access(realPath);
        } catch (e) {
            await mkdir(realPath);
        }
    }
}

// mkdir('e/d/c').then(function () {
//     console.log('suces');
// });
