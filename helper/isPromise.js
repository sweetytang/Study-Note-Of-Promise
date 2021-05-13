const isFunction = require('./isFunction.js');
const isObject = require('./isObject');

function isPromise(value) {
    if (isFunction(value) || isObject(value)) {
        const then = value && value.then;
        if (isFunction(then)) {
            return true;
        }
    }
    return false;
}

module.exports = isPromise;
