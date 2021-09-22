/* 按条件查询-下载东西
 * @Author: isam2016 
 * @Date: 2019-01-17 14:53:09 
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-01-17 16:37:02
 */

let http = require('http');
let fs = require('fs');
let path = require('path');
let filePath = path.join(__dirname, 'my.txt')
// 获取文件大小
let size = fs.statSync(filePath).size
let client = http.createServer((req, res) => {
    // opts.headers.Range = `bytes=${start}-${start+3}`;
    let range = req.headers['range'];
    if (range) {
        let [, start, end] = range.match(/(\d*)-(\d*)/);
        start = start ? Number(start) : 0;
        end = end ? Number(end) : size - 1;
        console.log('end', end)
        res.setHeader('Content-Range', `bytes ${start}-${end}/${size-1}`)
        fs.createReadStream(filePath, {
            start,
            end
        }).pipe(res);
    } else {
        fs.createReadStream(filePath).pipe(res)
    }

});
client.listen(3000)