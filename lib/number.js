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
        _this = _super.call(this, [new S.TypeSchema('number')].concat(constraints)) || this;
        return _this;
    }
    return NumberSchema;
}(S.CompoundSchema));
exports.NumberSchema = NumberSchema;
var MultipleOfConstraint = (function (_super) {
    __extends(MultipleOfConstraint, _super);
    function MultipleOfConstraint(multipleOf) {
        var _this = _super.call(this) || this;
        _this.multipleOf = multipleOf;
        return _this;
    }
    MultipleOfConstraint.prototype.satisfy = function (value) {
        return (value % this.multipleOf) === 0;
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
    return MultipleOfConstraint;
}(S.TypeConstraint));
exports.MultipleOfConstraint = MultipleOfConstraint;
var MinimumConstraint = (function (_super) {
    __extends(MinimumConstraint, _super);
    function MinimumConstraint(minimum, exclusive) {
        var _this = _super.call(this) || this;
        _this.minimum = minimum;
        _this.exclusive = exclusive;
        return _this;
    }
    MinimumConstraint.prototype.satisfy = function (num) {
        return this.exclusive ? num > this.minimum : num >= this.minimum;
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
    return MinimumConstraint;
}(S.TypeConstraint));
exports.MinimumConstraint = MinimumConstraint;
var MaximumConstraint = (function (_super) {
    __extends(MaximumConstraint, _super);
    function MaximumConstraint(maximum, exclusive) {
        var _this = _super.call(this) || this;
        _this.maximum = maximum;
        _this.exclusive = exclusive;
        return _this;
    }
    MaximumConstraint.prototype.satisfy = function (num) {
        return this.exclusive ? num < this.maximum : num <= this.maximum;
    };
    MaximumConstraint.prototype.errorMessage = function (value) {
        return "Greater than " + (this.exclusive ? 'or equal to' : '') + " " + this.maximum;
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
    return MaximumConstraint;
}(S.TypeConstraint));
exports.MaximumConstraint = MaximumConstraint;
//# sourceMappingURL=number.js.map