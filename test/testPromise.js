const Promise = require('../src/index.js');

// const p = new Promise((resolve, reject) => {
//     setTimeout(()=>resolve('a'), 1000);
// })

// /**
//  * 思考总结： 第一次改变状态后，后面会调用相应次数的resolve(undefined)，但是只有第一次有效。
//  */
// p.then(v => {return new Promise(resolve => {resolve(new Promise(resolve => {resolve(new Promise((resolve, reject) => reject(Promise.resolve('b'))))}))})}).then(v=>console.log('last: ', v), err => console.log('last err: ', err));


/**
 * 期约合成all测试用例
 */

//  let p1 = Promise.all([
//     Promise.resolve(),
//     Promise.resolve()
//   ]).then(value => console.log('p1:', value));
  
//   // 可迭代对象中的元素会通过Promise.resolve()转换为期约
//   let p2 = Promise.all([3, 4]).then(value => console.log('p2:', value));
  
//   // 空的可迭代对象等价于Promise.resolve()
//   let p3 = Promise.all([]).then(value => console.log('p3:', value));
  
//   // 无效的语法
//   let p4 = Promise.all().then(value => console.log('p4:', value), value => console.log('p4:', value));
//   // TypeError: cannot read Symbol.iterator of undefined

//   let p = Promise.all([
//     Promise.resolve(),
//     new Promise((resolve, reject) => setTimeout(resolve, 1000))
//   ]);
//   setTimeout(console.log, 0, p); // Promise <pending>
  
//   p.then((value) => setTimeout(console.log, 0, 'all() resolved! value: ', value));
  
//   // all() resolved!（大约1秒后）

  // 永远待定
// let p1 = Promise.all([new Promise(() => {})]).then(v => console.log(v), e => console.log(e))

// // 一次拒绝会导致最终期约拒绝
// let p2 = Promise.all([
//   Promise.resolve(),
//   Promise.reject('p2'),
//   Promise.resolve()
// ]).then(null, err => console.log('p2: ', err))

// 虽然只有第一个期约的拒绝理由会进入
// 拒绝处理程序，第二个期约的拒绝也
// 会被静默处理，不会有错误跑掉
// let p = Promise.all([
//     Promise.reject(3),
//     new Promise((resolve, reject) => setTimeout(reject, 1000))
//   ]);
  
//   p.catch((reason) => setTimeout(console.log, 0, reason)); // 3
  
//   // 没有未处理的错误

/**
 * 期约合成race测试用例
 */

//  let p1 = Promise.race([
//     Promise.resolve(),
//     Promise.resolve()
//   ]).then(value => console.log('p1:', value));
  
//   // 可迭代对象中的元素会通过Promise.resolve()转换为期约
//   let p2 = Promise.race([3, 4]).then(value => console.log('p2:', value));
  
//   // 空的可迭代对象等价于new Promise(() => {})
//   let p3 = Promise.race([]).then(value => console.log('p3:', value));
  
//   // 无效的语法
//   let p4 = Promise.race().then(value => console.log('p4:', value), e => console.log('p4:', e));
//   // TypeError: cannot read Symbol.iterator of undefined

// // 解决先发生，超时后的拒绝被忽略
// let p1 = Promise.race([
//     Promise.resolve(3),
//     new Promise((resolve, reject) => setTimeout(reject, 1000))
//   ]);
//   setTimeout(console.log, 0, p1); // Promise <resolved>: 3
  
//   // 拒绝先发生，超时后的解决被忽略
//   let p2 = Promise.race([
//     Promise.reject(4),
//     new Promise((resolve, reject) => setTimeout(resolve, 1000))
//   ]);
//   setTimeout(console.log, 0, p2); // Promise <rejected>: 4
  
//   // 迭代顺序决定了落定顺序
//   let p3 = Promise.race([
//     Promise.resolve(5),
//     Promise.resolve(6),
//     Promise.resolve(7)
//   ]);
//   setTimeout(console.log, 0, p3); // Promise <resolved>: 5


// 虽然只有第一个期约的拒绝理由会进入
// 拒绝处理程序，第二个期约的拒绝也
// 会被静默处理，不会有错误跑掉
// let p = Promise.race([
//     Promise.reject(3),
//     Promise.reject(4)
//   ]);
  
//   p.catch((reason) => setTimeout(console.log, 0, reason)); // 3
  
//   // 没有未处理的错误

/**
 * finally测试
 */

//  let p1 = Promise.resolve();
//  let p2 = Promise.reject();
//  let onFinally = function() {
//    setTimeout(console.log, 0, 'Finally!')
//  }
 
//  p1.finally(onFinally); // Finally
//  p2.finally(onFinally); // Finally

//let p1 = Promise.resolve('foo');

// // 这里都会原样后传
// let p2 = p1.finally().then(v => console.log('p2: ', v));
// let p3 = p1.finally(() => undefined).then(v => console.log('p2: ', v));
// let p4 = p1.finally(() => {}).then(v => console.log('p4: ', v));
// let p5 = p1.finally(() => Promise.resolve()).then(v => console.log('p5: ', v));
// let p6 = p1.finally(() => 'bar').then(v => console.log('p6: ', v));
// let p7 = p1.finally(() => Promise.resolve('bar')).then(v => console.log('p7: ', v));
// let p8 = p1.finally(() => Error('qux')).then(v => console.log('p8: ', v));


// Promise.resolve()保留返回的期约
// let p9 = p1.finally(() => new Promise(() => {})).then(v => console.log('p9: ', v), err => console.log('p9e: ', err));
// let p10 = p1.finally(() => Promise.reject()).then(v => console.log('p10: ', v), err => console.log('p10e: ', err));
// // Uncaught (in promise): undefined

// let p11 = p1.finally(() => { throw 'baz'; }).then(v => console.log('p11: ', v), err => console.log('p11e: ', err));

// let p1 = Promise.resolve('foo');

// // 忽略解决的值
// let p2 = p1.finally(
//   () => new Promise((resolve, reject) => setTimeout(() => resolve('bar'), 100)));

// setTimeout(console.log, 0, p2); // Promise <pending>

// setTimeout(() => setTimeout(console.log, 0, p2), 200);

// // 200毫秒后：
// // Promise <resolved>: foo


/**
 * 期约进度通知
 */
class TrackPromise extends Promise {
  constructor(excutor) {
      const notifyHandlers = [];
      const notify = status => {
        notifyHandlers.forEach(handler => handler(status));
      }
      super((resolve, reject) => {
          return excutor(resolve, reject, notify);
      });
      this.notifyHandlers = notifyHandlers; // 引用，两者指向同一个数组
  }

  addNotify(cb) {
      if (typeof cb === 'function') {
          this.notifyHandlers.push(cb);
      }
      return this; // 可以连锁
  }
}

let p = new TrackPromise((resolve, reject, notify) => {
  function countdown(x) {
      if (x > 0) {
          setTimeout(() => notify(`${20 * x}% remaining`), 0); // 延后，才能打印100%
          setTimeout(() => countdown(x - 1), 1000);
      } else {
          resolve();
      }
  }
  countdown(5);
});

p.addNotify((x) => setTimeout(console.log, 0, 'a:', x))
 .addNotify((x) => setTimeout(console.log, 0, 'b:', x));

p.then(() => setTimeout(console.log, 0, 'completed'));
