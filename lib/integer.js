"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var value_object_1 = require("./value-object");
var S = require("./schema");
var IntegerSchema = (function (_super) {
    __extends(IntegerSchema, _super);
    function IntegerSchema(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var constraints = [];
        if (options.multipleOf)
            constraints.push(options.multipleOf);
        if (options.minimum)
            constraints.push(options.minimum);
        if (options.maximum)
            constraints.push(options.maximum);
        if (options.enum)
            constraints.push(options.enum);
        var type = new S.TypeConstraint('integer');
        _this = _super.call(this, 'integer', constraints) || this;
        if (options.enum)
            _this.enum = options.enum;
        if (options.maximum)
            _this.maximum = options.maximum;
        if (options.minimum)
            _this.minimum = options.minimum;
        if (options.multipleOf)
            _this.multipleOf = options.multipleOf;
        return _this;
    }
    IntegerSchema.prototype.jsonify = function (value) {
        if (S.TypeMap.integer.isa(value)) {
            return value;
        }
        else if (value instanceof Integer) {
            return value.valueOf();
        }
        else {
            throw new Error("Not an integer");
        }
    };
    return IntegerSchema;
}(S.TypeSchema));
exports.IntegerSchema = IntegerSchema;
var s = new IntegerSchema();
var Integer = (function (_super) {
    __extends(Integer, _super);
    function Integer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Integer.prototype._validate = function (value) {
        var result = S.validate(s, value);
        if (result.errors.length > 0) {
            throw new TypeError("NotInteger: " + value);
        }
    };
    return Integer;
}(value_object_1.ValueObject));
exports.Integer = Integer;
S.registerSchema(Integer, s);
//# sourceMappingURL=integer.js.map