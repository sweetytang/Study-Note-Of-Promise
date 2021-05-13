const PENDING = 'pending';

const FULLFILLED = 'fullfilled';

const REJECTED = 'rejected';

function defaultOnResolve(value) {
    return value;
}

function defaultOnReject(reason) {
    throw reason;
}

module.exports = { PENDING, FULLFILLED, REJECTED, defaultOnResolve, defaultOnReject };
