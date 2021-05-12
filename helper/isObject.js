/**
 * 判断输入的是否是对象（非函数）
 * @param {*} obj 
 * @returns boolean
 */
function isObject(obj) {
    const isObject = typeof obj === 'object' && !!obj;
    return isObject;
}

module.exports = isObject;
