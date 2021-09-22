// md5 是摘要
// 加密=》 解密

// 摘要：  摘要算法不可逆

let crypto = require('crypto');
let r = crypto
    .createHash('md5')
    .update('123')
    .digest('base64');
console.log(r);
