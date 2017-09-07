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
var S = require("./schema");
S.TypeMap['number'] = {
    isa: function (value) { return typeof (value) === 'number'; },
    make: function (v) { return v; }
};
var NumberSchema = (function (_super) {
    __extends(NumberSchema, _super);
    function NumberSchema(options) {
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
        _this = _super.call(this, 'number', constraints) || this;
        return _this;
    }
    NumberSchema.prototype.jsonify = function (value) {
        if (S.TypeMap.number.isa(value)) {
            return value;
        }
        else if (value instanceof Number) {
            return value.valueOf();
        }
        else {
            throw new Error("Not a number");
        }
    };
    return NumberSchema;
}(S.TypeSchema));
exports.NumberSchema = NumberSchema;
S.registerSchema(Number, new NumberSchema());
var MultipleOfConstraint = (function () {
    function MultipleOfConstraint(multipleOf) {
        this.multipleOf = multipleOf;
    }
    MultipleOfConstraint.prototype.isa = function (value) {
        return S.TypeMap['number'].isa(value) && (value % this.multipleOf) === 0;
    };
    MultipleOfConstraint.prototype.validate = function (value, path, errors) {
        if (!this.isa(value)) {
            errors.push({
                path: path,
                value: value,
                schema: this,
                message: "Not a multiple of " + this.multipleOf
            });
        }
    };
    MultipleOfConstraint.prototype.errorMessage = function (value) {
        return "Not a multiple of " + value;
    };
    MultipleOfConstraint.prototype.fromJSON = function (data) {
        return data;
    };
    MultipleOfConstraint.prototype.toJSON = function () {
        return {
            multipleOf: this.multipleOf
        };
    };
    MultipleOfConstraint.prototype.jsonify = function (value) {
        return value;
    };
    return MultipleOfConstraint;
}());
exports.MultipleOfConstraint = MultipleOfConstraint;
var MinimumConstraint = (function () {
    function MinimumConstraint(minimum, exclusive) {
        this.minimum = minimum;
        this.exclusive = exclusive;
    }
    MinimumConstraint.prototype.isa = function (value) {
        return S.TypeMap['number'].isa(value) && this.exclusive ? value > this.minimum : value >= this.minimum;
    };
    MinimumConstraint.prototype.validate = function (value, path, errors) {
        if (!this.isa(value)) {
            errors.push({
                path: path,
                value: value,
                schema: this,
                message: this.errorMessage(value)
            });
        }
    };
    MinimumConstraint.prototype.errorMessage = function (value) {
        return "Less than " + (this.exclusive ? 'or equal to' : '') + " " + this.minimum;
    };
    MinimumConstraint.prototype.fromJSON = function (data) {
        return data;
    };
    MinimumConstraint.prototype.toJSON = function () {
        return {
            minimum: this.minimum,
            exclusiveMinimum: this.exclusive
        };
    };
    MinimumConstraint.prototype.jsonify = function (value) {
        return value;
    };
    return MinimumConstraint;
}());
exports.MinimumConstraint = MinimumConstraint;
var MaximumConstraint = (function () {
    function MaximumConstraint(maximum, exclusive) {
        this.maximum = maximum;
        this.exclusive = exclusive;
    }
    MaximumConstraint.prototype.isa = function (value) {
        return S.TypeMap['number'].isa(value) && this.exclusive ? value < this.maximum : value <= this.maximum;
    };
    MaximumConstraint.prototype.errorMessage = function (value) {
        return "Greater than " + (this.exclusive ? 'or equal to' : '') + " " + this.maximum;
    };
    MaximumConstraint.prototype.validate = function (value, path, errors) {
        if (!this.isa(value)) {
            errors.push({
                path: path,
                value: value,
                schema: this,
                message: this.errorMessage(value)
            });
        }
    };
    MaximumConstraint.prototype.fromJSON = function (data) {
        return data;
    };
    MaximumConstraint.prototype.toJSON = function () {
        return {
            maximum: this.maximum,
            exclusiveMaximum: this.exclusive
        };
    };
    MaximumConstraint.prototype.jsonify = function (value) {
        return value;
    };
    return MaximumConstraint;
}());
exports.MaximumConstraint = MaximumConstraint;
//# sourceMappingURL=number.js.map