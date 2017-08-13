"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValueObject = (function () {
    function ValueObject(value) {
        this._validate(value);
        this.__value = value;
    }
    ValueObject.prototype._validate = function (value) {
    };
    ValueObject.prototype.valueOf = function () {
        return this.__value;
    };
    ValueObject.prototype.toJSON = function () {
        return this.__value;
    };
    return ValueObject;
}());
exports.ValueObject = ValueObject;
//# sourceMappingURL=value-object.js.map