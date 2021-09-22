let opts = {
    host: 'localhost',
    port: 3000,
    headers: {}
};
let http = require('http');
let start = 0;
let fs = require('fs');
let pause = false;

// 不太清楚是干啥的
process.stdin.on('data', function (data) {
    if (data.toString().includes('p')) {
        pause = true;
    } else {
        pause = false;
        download();
    }
});

function download() {
    // 每次读取三个
    opts.headers.Range = `bytes=${start}-${start + 3}`;
    start += 4;
    let client = http.request(opts, res => {
        // opts.headers.Range = `bytes=${start}-${start+3}`;
        let total = res.headers['content-range'].split('/')[1];
        console.log(total)
        res.on('data', data => {
            fs.appendFileSync('./download.txt', data);
        });
        res.on('end', () => {
            setTimeout(() => {
                if (!pause && start < total) download();
            }, 1000);
        });
    });
    client.end();
}
download();