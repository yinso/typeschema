"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SSN = /** @class */ (function () {
    function SSN(v) {
        this._v = v;
    }
    SSN.fromJSON = function (v) {
        var res = validate(v);
        if (res.hasErrors()) {
            throw res;
        }
        return new SSN(v);
    };
    SSN.validate = function (v, path, err) {
        if (path === void 0) { path = '$'; }
        if (err === void 0) { err = new ValidationResult(); }
        if (!typeof (v) === 'string') {
            err.push({
                error: 'Not a string',
                path: path
            });
        }
        return err;
    };
    SSN.prototype.valueOf = function () {
        return this._v;
    };
    SSN.prototype.toString = function () {
        return this._v;
    };
    SSN.prototype.toJSON = function () {
        return this._v;
    };
    return SSN;
}());
exports.SSN = SSN;
//# sourceMappingURL=ssn.js.map