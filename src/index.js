const {
    PENDING,
    FULLFILLED,
    REJECTED,
    defaultOnResolve,
    defaultOnReject
} = require('./constant.js');
const isFunction = require('../helper/isFunction.js');
const resolvePromise = require('../helper/resolvePromise.js');
const isPromise = require('../helper/isPromise');

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

    static all(promiseArray) {        
        return new Promise((resolve, reject) => {
            /**
             * 针对Promise.all()情况
             */
            if (!(promiseArray && promiseArray[Symbol.iterator])) {
                throw new TypeError('cannot read Symbol.iterator of undefined');
            }
            /**
             * 针对Promise.all([])情况
             */
            if (!(promiseArray && promiseArray.length)) {
                return resolve();
            }
            const resolveResArr = [];
            const resolveResult = (index, value) => {
                resolveResArr[index] = value;
                if (index === (promiseArray.length  - 1)) {
                    return resolve(resolveResArr);
                }
            }
            for (let i = 0; i < promiseArray.length ; i++) {
                const promise = promiseArray[i];
                if (isPromise(promise)) {
                    promise.then(value => {
                        resolveResult(i, value);
                    }, err => {
                        return reject(err);
                    });
                } else {
                    resolveResult(i, promise);
                }
            }
        });
    }

    static race(promiseArray) {
        return new Promise((resolve, reject) => {
            /**
             * 针对Promise.all()情况
             */
             if (!(promiseArray && promiseArray[Symbol.iterator])) {
                throw new TypeError('cannot read Symbol.iterator of undefined');
            }
            for (const promise of promiseArray) {
                if (isPromise(promise)) {
                    promise.then(value => {
                        return resolve(value);
                    }, err => {
                        return reject(err);
                    });
                } else {
                    return resolve(promise);
                }
            }
        });
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

    finally(cb) {
        return this.then((value) => {
            return Promise.resolve(cb()).then(() => value);
        }, (err) => {
            return Promise.resolve(cb()).then(() => {
                throw err;
            });
        })
    }
}

/**
 * 官方测试用
 */
Promise.defer = Promise.deferred = function() {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
};

module.exports =  Promise;
