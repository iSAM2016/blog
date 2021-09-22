function PromiseSelf(callback) {
    var self = this;
    self.status = 'PENDING'; // 开始状态
    self.data = undefined;
    self.onResolvedCallback = []; //resolve 回调的结果
    self.onRejectedCallback = []; //reject 回调

    function resolve(value) {
        setTimeout(function () {
            if (self.status === 'PENDING') {
                self.status == 'FULFILLED'; // 成功转态
                self.data = value;
                // 依次执行成功之后的函数栈
                for (var i = 0; i < self.onResolvedCallback.length; i++) {
                    self.onResolvedCallback[i](value);
                }
            }
            return
        })
    }

    function reject(error) {
        setTimeout(function () {
            if (self.status === 'PENDING') {
                self.status == 'REJECTED';
                (self.data = error);
                // 依次执行失败之后的函数栈
                for (var i = 0; i < self.onRejectedCallback.length; i++) {
                    self.onRejectedCallback[i](error);
                }
            }
            return
        })
    }
    try {
        callback(resolve, reject); //执行executor 病传入想想的参数
    } catch (error) {
        reject(error)
    }

}

// then
PromiseSelf.prototype.then = function (onResolve, onReject) {
    console.log(this.status)
    if (this.status == 'FULFILLED') {
        onReject(this.data)
    }
    if (this.status == 'REJECTED') {
        onResolve(this.data)
    }
    if (this.status == 'PENDING') {
        this.onResolvedCallback.push(onResolve)
        this.onRejectedCallback.push(onReject)
    }

};

new PromiseSelf((res, rej) => {
    console.log(99)
    res('1');
}).then((data) => {
    console.log(data);
});