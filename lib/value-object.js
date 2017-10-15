"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValueObject = /** @class */ (function () {
    function ValueObject(value) {
        this._validate(value);
        this.__v = value;
    }
    ValueObject.prototype._validate = function (value) {
    };
    ValueObject.prototype.valueOf = function () {
        return this.__v;
    };
    ValueObject.prototype.toJSON = function () {
        return this.__v;
    };
    return ValueObject;
}());
exports.ValueObject = ValueObject;
//# sourceMappingURL=value-object.js.map