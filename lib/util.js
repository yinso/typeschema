"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extend() {
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    var result = {};
    for (var i = 0; i < items.length; ++i) {
        for (var key in items[i]) {
            if (items[i].hasOwnProperty(key)) {
                result[key] = items[i][key];
            }
        }
    }
    return result;
}
exports.extend = extend;
function deepEqual(x, y) {
    if (x === undefined && y === undefined)
        return true;
    else if (x === null && y === null)
        return true;
    else if ((x instanceof Array) && (y instanceof Array))
        return deepEqualArray(x, y);
    else if ((x instanceof Date) && (y instanceof Date))
        return x.getTime() === y.getTime();
    else if ((x instanceof Object) && (y instanceof Object))
        return deepEqualObject(x, y);
    else if (typeof (x) === typeof (y))
        return x === y;
    else
        return false;
}
exports.deepEqual = deepEqual;
function deepEqualArray(x, y) {
    if (x.length !== y.length)
        return false;
    for (var i = 0; i < x.length; ++i) {
        if (!deepEqual(x[i], y[i]))
            return false;
    }
    return true;
}
function deepEqualObject(x, y) {
    if (Object.keys(x).length !== Object.keys(y).length)
        return false;
    for (var key in x) {
        if (x.hasOwnProperty(key)) {
            if (!y.hasOwnProperty(key))
                return false;
            if (!deepEqual(x[key], y[key]))
                return false;
        }
    }
    return true;
}
//# sourceMappingURL=util.js.map