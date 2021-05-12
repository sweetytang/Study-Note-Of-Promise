const {
    PENDING,
    FULLFILLED,
    REJECTED,
    defaultOnResolve,
    defaultOnReject
} = require('./constant.js');
const isFunction = require('./helper/isFunction.js');
const resolvePromise = require('./helper/resolvePromise.js');

class Promise {
    constructor(excutor) {
        this.status = PENDING;
        this.value = null;
        this.reason = null;
        this.resolveCallback = [];
        this.rejectCallback = [];

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULLFILLED;
                this.value = value;
                this.resolveCallback.forEach(func => func());
            }
        }

        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.rejectCallback.forEach(func => func());
            }
        }

        try {
            excutor(resolve, reject);
        } catch(err) {
            reject(err);
        }
    }

    static resolve(value) {
        if (value instanceof Promise) {
            return value;
        }
        return new Promise(resolve => resolve(value));
    }

    static reject(reason) {
        return new Promise((resolve, reject) => reject(reason));
    }

    then(onResolve, onReject) {
        onResolve = isFunction(onResolve) ? onResolve : defaultOnResolve;
        onReject = isFunction(onReject) ? onReject : defaultOnReject;

        const promise2 = new Promise((resolve, reject) => { // 此处必须用箭头函数绑定this至调用then的promise对象
            if (this.status === FULLFILLED) {
                /**
                 * 1. 需用setTimeout到下一循环 方能取得promise2
                 * 2. 箭头函数绑定了this至调用then的promise对象
                 * 3. call使得resolvePromise中的this绑定至调用then的promise对象
                 */
                setTimeout(() => {
                    try {
                        /**
                         * 如果resolveValue是promise，则下一次调用的onResolve还是onReject，完成了所有的步骤，包括最终状态的第一次改变，后面的状态改变无效。
                         */
                        const resolveValue = onResolve(this.value);
                        resolvePromise(promise2, resolveValue, resolve, reject);
                    } catch(err) {
                        reject(err)
                    }
                }, 0);
            }

            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        /**
                         * 如果rejectReason是promise，则下一次调用的onResolve还是onReject，完成了所有的步骤，包括最终状态的第一次改变，后面的状态改变无效。
                         */
                        const rejectReason = onReject(this.reason);
                        resolvePromise(promise2, rejectReason, resolve, reject);
                    } catch(err) {
                        reject(err);
                    }
                }, 0);
            }

            if (this.status === PENDING) {
                this.resolveCallback.push(() => {
                    setTimeout(() => {
                        try {
                            /**
                             * 如果resolveValue是promise，则下一次调用的onResolve还是onReject，完成了所有的步骤，包括最终状态的第一次改变，后面的状态改变无效。
                             */
                            const resolveValue = onResolve(this.value);
                            resolvePromise(promise2, resolveValue, resolve, reject);
                        } catch(err) {
                            reject(err)
                        }
                    }, 0);
                });
                this.rejectCallback.push(() => {
                    setTimeout(() => {
                        try {
                            /**
                             * 如果rejectReason是promise，则下一次调用的onResolve还是onReject，完成了所有的步骤，包括最终状态的第一次改变，后面的状态改变无效。
                             */
                            const rejectReason = onReject(this.reason);
                            resolvePromise(promise2, rejectReason, resolve, reject);
                        } catch(err) {
                            reject(err);
                        }
                    }, 0);
                });
            }
        });
        
        return promise2;
    }

    catch(onReject) {
        onReject = isFunction(onReject) ? onReject : defaultOnReject;
        return this.then(null, onReject);
    }
}

Promise.defer = Promise.deferred = function() {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
};

module.exports =  Promise;
