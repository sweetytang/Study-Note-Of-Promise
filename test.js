const Promise = require('./index.js');

const p = new Promise((resolve, reject) => {
    setTimeout(()=>resolve('a'), 1000);
})

/**
 * 思考总结： 第一次改变状态后，后面会调用相应次数的resolve(undefined)，但是只有第一次有效。
 */
p.then(v => {return new Promise(resolve => {resolve(new Promise(resolve => {resolve(new Promise((resolve, reject) => reject(Promise.resolve('b'))))}))})}).then(v=>console.log('last: ', v), err => console.log('last err: ', err));
