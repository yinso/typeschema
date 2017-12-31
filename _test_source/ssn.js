"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("../lib/schema");
var SSN = /** @class */ (function () {
    function SSN(v) {
        this._v = v;
    }
    SSN.fromJSON = function (v) {
        var res = SSN.validate(v);
        if (res.hasErrors()) {
            throw res;
        }
        return new SSN(v);
    };
    SSN.validate = function (v, path, err) {
        if (path === void 0) { path = '$'; }
        if (err === void 0) { err = new schema_1.ValidationResult(); }
        if (!(typeof (v) === 'string')) {
            err.push({
                error: 'Not a string',
                path: path,
                value: v
            });
        }
        return err;
    };
    SSN.isJSON = function (v) {
        var res = SSN.validate(v);
        return !res.hasErrors();
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