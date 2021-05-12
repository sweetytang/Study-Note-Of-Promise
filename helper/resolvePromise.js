const isFunction = require('./isFunction.js');
const isObject = require('./isObject.js');

/**
 * 核心程序
 * @param {*} promise2 
 * @param {*} v 
 * @param {*} resolve 
 * @param {*} reject 
 */
function resolvePromise(promise2, v, resolve, reject) {

    if (promise2 === v) {
        return reject(new TypeError('the new promise can not be the same as super promise'));
    }

    let lock = false;
    const isFunc = isFunction(v);
    const isObj = isObject(v);
    
    if (isFunc || isObj) {
        try {
            let then = v.then;
            if (isFunction(then)) {
                then.call(v, value => {
                    /**
                     * 递归的具象化：
                     * 递：本质是为了去除resovle的外壳 就像剥洋葱一层一层剥开（剥等同于then）
                     * 归：1. 一旦遇到reject的外壳 只需再剥一次（即用then取出里面的值 reject一下）
                     * 归：2. 或者遇到非thenable对象的值 不用剥（resolve一下）
                     */
                    if (lock) {
                        return;
                    }
                    lock = true;
                    resolvePromise(promise2, value, resolve, reject); // 递归的“递”
                }, reason => {
                    if (lock) {
                        return;
                    }
                    lock = true;
                    reject(reason); // 递归的“归”-1
                });
            } else {
                if (lock) {
                    return;
                }
                lock = true;
                resolve(v);
            }
        } catch(err) {
            if (lock) {
                return;
            }
            lock = true;
            reject(err);
        }
    } else {
        if (lock) {
            return;
        }
        lock = true;
        resolve(v); // 递归的“归”-2
    }
}

module.exports = resolvePromise;
