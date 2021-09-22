/**
 * 常见的手写函数
 * 
 * 快排序
 * 发布订阅模式
 * 事件注册
 * 拷贝
 * bind 实现
 * 去重
 * jsonp  
 * xhrHttprequest
 */

/**
 * 发布订阅模式
 */


//  ES6 class 继承与原生js 继承区别
  
//  在es5 中，继承实质上子类先创建属于自己的this, 然后在将父类的方法添加到this，（也就是使用Parent.apply(this)的方法）或者this.__proto__
//  而在ES6 中，则是先创建父类的实例对象this,然后在用子类的构造函数修改this

console.log(90)

function PubSub() {
    this.handles = {};
}
PubSub.prototype.on = function (eventType, handles) {
    // 订阅
    va self = this;
    if (!(eventType in self.handles)) {
        self.handles[eventType] = [];
    }
    self.handles.push(handles);
    return this;
}
PubSub.prototype.emit = function (eventType) {
    if (eventType in self.handles) {
        var self = this;
        var handleAry = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, i < self.handles[eventType].length; i++) {
            self.handles[eventType][i].apply(self, handleAry)
        }
    } else {
        return false;
    }
}

    /**
     * XMLHttpRequest
     */
    (function () {
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXbject();
        }
        xhr.open("GET", "data.txt", true)
        xhr.send();
        onreadystatechange
        xhr.onreadystatechange = function () {
            xhr.readyState === 4 {
                xhr.state === 1
            }
        }
    })(window)

    /**
     * 深拷贝
     */

    (function (window) {
        var deepcopy = function (obj) {
            if (!obj || typeof obj !== 'object') {
                throw Error('')
            }
            var target = Object.prototype.toString.call(obj) === '[Object object]' ? {} : [];
            for (key in target) {
                if (obj.hasOwnPropertype(key)) {
                    if (Object.prototype.toString.call(obj) === '[Object object]') {
                        targetObj[keys] = deepClone(source[keys]);
                    } else {
                        target[key] = obj[key]
                    }
                }
            }
            return targetobj
        }
        window.deepcopy = deepcopy;
    })(window)

/**
 * jsonp
 */
(function(window) {
    var json = function(url, data, callback) {
        
        //1 挂载回调函数
        var fnSuffix=Math.random().toString().replace('.','');
        var cbFuncName='my_json_cb_'+fnSuffix;
        //将函数挂载在全局环境的方式不推荐  使用cbs.my_json_cb_
        window[cbFuncName]=callback;

        //2 将data转化成url字符串的形式
        // {id:1,name:'zhangsan'} =>id=1&name=zhangsan
        var querystring=url.indexOf('?')==-1?'?':'&';
        for(var key in data){
            querystring+=key+'='+data[key]+'&';
            //            id=          1   &
        }
        //querystring=?id=1&name=zhangsan&
        //3 处理url地址中的回调参数
        //url+=callback=sdfsfdg

        querystring+='callback='+cbFuncName;
        //querystring=?id=1&name=zhangsan&cb=my_json_cb_0231241
        //4 创建一个script的标签
        var scriptElement=document.createElement('script');
        scriptElement.src=url+querystring;
        // 此时还不能将其append到页面上

        //5 将script标签放到页面中
        document.body.appendChild(scriptElement);
        //append过后页面会自动对这个地址发送请求，请求完成以后自动执行脚本
    }
})(window)

/**
 * 自定义事件，除IE8(及以下)
 * https://juejin.im/entry/580b5553570c350068e6c2d6
 */

//var test = document.getElementById("longen");
var event = document.createEvent('Event');

//上面的initEvent的第二个参数的意思是：是否冒泡，
//第三个参数的意思是：是否可以使用preventDefault()来阻止默认行为。
event.initEvent('customEvent', true, true);
test.addEventListener('customEvent', function () {
    console.log(123);
}, false);

test.dispathEvent(event);

/**
 * 中间元素快排
 */

 function quickSort(a) {
    if(a.length <= 1) {
        return a;
    }
    var mid = Math.floor((a.length) / 2);
    var midItem = a.splice(mid,1)[0];
    var left = [];
    var right = [];
    
    a.forEach(function(item) {
        if(item < - midItem) {
            left.push(item);
        }else {
            right.push(item);
        }
    })
    var _left = quickSort(left);
    var _right = quickSort(right);
    return _left.concat(midItem, _right);
 }



/**
 * 使用可取消的Promisen做异步操作
 */
const makeCancelable = (promise) => {
    let _isNext = true;
    let wrappedPromise = new Promise((resolve, reject) => {
        promise.then((val) => {
            console.log(23);
            _isNext ? resolve(val) : reject({
                isCanceled: true
            });
        })
        promise.catch((error) => {
            _isNext ? reject(error) : reject({
                isCanceled: true
            });
        })
    })
    return {
        promise: wrappedPromise,
        cancel() {
            _isNext = false;
        }
    }
}

const cancelablePromise = makeCancelable(
    new Promise((resolve, reject) => {
        setTimeout(() => reject(), 2000)
    })
);

cancelablePromise
    .promise
    .then(() => console.log('resolved'))
    .catch((reason) => console.log('isCanceled', reason.isCanceled));
cancelablePromise.cancel(); // Cancel the promise


/**
 * 显示返回顶部的按钮，开始、结束、运动三个过程中调用的函数判断是否到达终点
 * @Author   iSAM
 * @DateTime 2017-04-11T08:46:52+0800
 * @param    {string}
 * @param    {Function}               callback [description]
 * @return   {[type]}                          [description]
 */
export const showBack = callback => {
    let requestFram;
    let oldScrollTop;

    document.addEventListener('scroll', () => {
        showBackFunc();
    }, false)
    document.addEventListener('touchstart', () => {
        showBackFunc();
    }, {
            passive: true
        })
    document.addEventListener('touchmove', () => {
        showBackFunc();
    }, {
            passive: true
        })
    document.addEventListener('touchend', () => {
        oldScrollTop = document.body.scrollTop;
        moveEnd();
    }, {
            passive: true
        })
    const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
            // 在requestAnimationFrame中的 数据是更新之后的数据
            if (document.body.scrollTop != oldScrollTop) {
                oldScrollTop = document.body.scrollTop;
                moveEnd();
            } else {
                cancelAnimationFrame(requestFram);
            }
            showBackFunc();
        })
    }
    // 判断是否达到目标点
    const showBackFunc = () => {
        if (document.body.scrollTop > 500) {
            callback(true);
        } else {
            callback(false);
        }
    }
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
    let target;
    // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
    if (attr === 'scrollTop') {
        target = element.scrollTop;
    } else if (element.currentStyle) {
        target = element.currentStyle[attr];
    } else {
        target = document.defaultView.getComputedStyle(element, null)[attr];
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    return NumberMode == 'float' ? parseFloat(target) : parseInt(target);
}
/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画
 */
export const animate = (element, target, duration = 400, mode = 'ease-out', callback) => {
    clearInterval(element.timer);

    //判断不同参数的情况
    if (duration instanceof Function) {
        callback = duration;
        duration = 400;
    } else if (duration instanceof String) {
        mode = duration;
        duration = 400;
    }

    //判断不同参数的情况
    if (mode instanceof Function) {
        callback = mode;
        mode = 'ease-out';
    }

    //获取dom样式
    const attrStyle = attr => {
        if (attr === "opacity") {
            return Math.round(getStyle(element, attr, 'float') * 100);
        } else {
            return getStyle(element, attr);
        }
    }
    //根字体大小，需要从此将 rem 改成 px 进行运算
    const rootSize = parseFloat(document.documentElement.style.fontSize);

    const unit = {};
    const initState = {};

    //获取目标属性单位和初始样式值
    Object.keys(target).forEach(attr => {
        if (/[^\d^\.]+/gi.test(target[attr])) {
            unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
        } else {
            unit[attr] = 'px';
        }
        initState[attr] = attrStyle(attr);
    });

    //去掉传入的后缀单位
    Object.keys(target).forEach(attr => {
        if (unit[attr] == 'rem') {
            target[attr] = Math.ceil(parseInt(target[attr]) * rootSize);
        } else {
            target[attr] = parseInt(target[attr]);
        }
    });


    let flag = true; //假设所有运动到达终点
    const remberSpeed = {}; //记录上一个速度值,在ease-in模式下需要用到
    element.timer = setInterval(() => {
        Object.keys(target).forEach(attr => {
            let iSpeed = 0; //步长
            let status = false; //是否仍需运动
            let iCurrent = attrStyle(attr) || 0; //当前元素属性址
            let speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
            let intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
            switch (mode) {
                case 'ease-out':
                    speedBase = iCurrent;
                    intervalTime = duration * 5 / 400;
                    break;
                case 'linear':
                    speedBase = initState[attr];
                    intervalTime = duration * 20 / 400;
                    break;
                case 'ease-in':
                    let oldspeed = remberSpeed[attr] || 0;
                    iSpeed = oldspeed + (target[attr] - initState[attr]) / duration;
                    remberSpeed[attr] = iSpeed
                    break;
                default:
                    speedBase = iCurrent;
                    intervalTime = duration * 5 / 400;
            }
            if (mode !== 'ease-in') {
                iSpeed = (target[attr] - speedBase) / intervalTime;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            }
            //判断是否达步长之内的误差距离，如果到达说明到达目标点
            switch (mode) {
                case 'ease-out':
                    status = iCurrent != target[attr];
                    break;
                case 'linear':
                    status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                    break;
                case 'ease-in':
                    status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                    break;
                default:
                    status = iCurrent != target[attr];
            }

            if (status) {
                flag = false;
                //opacity 和 scrollTop 需要特殊处理
                if (attr === "opacity") {
                    element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
                    element.style.opacity = (iCurrent + iSpeed) / 100;
                } else if (attr === 'scrollTop') {
                    element.scrollTop = iCurrent + iSpeed;
                } else {
                    element.style[attr] = iCurrent + iSpeed + 'px';
                }
            } else {
                flag = true;
            }

            if (flag) {
                clearInterval(element.timer);
                if (callback) {
                    callback();
                }
            }
        })
    }, 20);
}

/**
 *  创建一个类，存储删除数据
 */
class Store {
    constructor() {
        this.store = window.localStorage;
        this.prefix = db_prefix;
    }
    set(key, value, fn) {
        if (key === 'userinfo') {
            value.time = new Date().getTime()
        }
        try {
            value = JSON.stringify(value);
        } catch (e) { }
        this.store.setItem(this.prefix + key, value);
        fn && fn();
    }
    get(key, express, fn) {
        console.log(express)
        if (!key) {
            throw new Error('没有key数据');
        }
        if (typeof key === 'object') {
            throw new Error('key的值不能是对象');
        }
        let value = this.store.getItem(this.prefix + key);
        if (value !== null) {
            try {
                value = JSON.parse(value);
            } catch (e) { }
        }
        if (key === 'userinfo' && value) {
            if (new Date().getTime() - value.time > express) {
                // 数据过期的时候，数据作废
                this.remove(key);
            } else {
                return value;
            }
        }
        return value;
    }
    remove(key) {
        console.log(this.store)
        this.store.removeItem(this.prefix + key);
    }
}

module.exports = new Store();

/**
 * data 时间
 */
function formatDates(date, fmt) {
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return (('00' + str).substr(str.length));
};
/**
 * by isam  2016-11-8 16:48:07
 */

export function getCookie(name) {
    let cookieName = encodeURIComponent(name) + "="
    let cookieStart = document.cookie.indexOf(cookieName)
    let cookieValue = null

    if (cookieStart > -1) {
        var cookieEnd = document.cookie.indexOf(";", cookieStart)

        if (cookieEnd == -1) {
            cookieEnd = document.cookie.length;
        }

        cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))
    }

    return cookieValue

}

/**
 * Merge an array of objects into one.
 *
 * @param {Array<Object>} arr
 * @return {Object}
 */

export function mergeObjects(arr) {
    return arr.reduce((prev, obj) => {
        Object.keys(obj).forEach(key => {
            const existing = prev[key]
            if (existing) {
                // allow multiple mutation objects to contain duplicate
                // handlers for the same mutation type
                if (Array.isArray(existing)) {
                    prev[key] = existing.concat(obj[key])
                } else {
                    prev[key] = [existing].concat(obj[key])
                }
            } else {
                prev[key] = obj[key]
            }
        })
        return prev
    }, {})
}

/**
 * Check whether the given value is Object or not
 *
 * @param {*} obj
 * @return {Boolean}
 */

export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

/**
 * Get state sub tree by given keys.
 *
 * @param {Object} state
 * @param {Array<String>} nestedKeys
 * @return {Object}
 */
export function getNestedState(state, nestedKeys) {
    return nestedKeys.reduce((state, key) => state[key], state)
}

/**
 * Hacks to get access to Vue internals.
 * Maybe we should expose these...
 */

let Watcher
export function getWatcher(vm) {
    if (!Watcher) {
        const noop = function () { }
        const unwatch = vm.$watch(noop, noop)
        Watcher = vm._watchers[0].constructor
        unwatch()
    }
    return Watcher
}

let Dep
export function getDep(vm) {
    if (!Dep) {
        Dep = vm._data.__ob__.dep.constructor
    }
    return Dep
}

/**
 * bind 实现
 */

function() {
    if(!('bind' in Function.prototype)) {
        Function.prototype.bind = function() {
            var self = this;
            var context = Array.prototype.slice.call(arguments,1);
            var arg = arguments;
            
            return function() {
                return self.apply(context, arg);
            }
        }
    }
}


/**
 * 去重
 * Array.from() 方法从一个类似数组或可迭代对象中创建一个新的数组实例
 * Set 是一种新的数据类型，但是成员的值是唯一的，没有重复的值
 * Map
 */


 var array = [1,2,3,4,"1"];

 function unique(array) {
     return Array.form(new Set(array));
 }

function unique() {
    return [...new Set(array)];
}
