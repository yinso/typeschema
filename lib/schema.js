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
var util = require("./util");
var u = require("util");
var ValidationResult = (function () {
    function ValidationResult(errors) {
        if (errors === void 0) { errors = []; }
        this.errors = errors;
    }
    ValidationResult.prototype.hasErrors = function () {
        return this.errors.length > 0;
    };
    ValidationResult.prototype.raise = function () {
        throw new ValidationException(this.errors);
    };
    return ValidationResult;
}());
exports.ValidationResult = ValidationResult;
var ValidationException = (function (_super) {
    __extends(ValidationException, _super);
    function ValidationException(errors) {
        if (errors === void 0) { errors = []; }
        var _this = _super.call(this) || this;
        _this.errors = errors;
        return _this;
    }
    ValidationException.prototype.hasErrors = function () {
        return this.errors.length > 0;
    };
    return ValidationException;
}(Error));
exports.ValidationException = ValidationException;
function isFunction(v) {
    return typeof (v) === 'function' || (v instanceof Function);
}
exports.isFunction = isFunction;
function isJsonSchema(obj) {
    return (obj instanceof Object) && isFunction(obj.isa) && isFunction(obj.validate) && isFunction(obj.fromJSON);
}
exports.isJsonSchema = isJsonSchema;
exports.TypeMap = {
    number: {
        isa: function (value) { return typeof (value) === 'number'; },
        make: function (value) { return value; }
    },
    integer: {
        isa: function (value) { return exports.TypeMap.number.isa(value) && ((value % 1) === 0); },
        make: function (value) { return value; }
    },
    boolean: {
        isa: function (value) { return typeof (value) === 'boolean'; },
        make: function (value) { return value; }
    },
    string: {
        isa: function (value) { return typeof (value) === 'string'; },
        make: function (value) { return value; }
    },
    null: {
        isa: function (value) { return value === null; },
        make: function (value) { return value; }
    },
    array: {
        isa: function (value) { return value instanceof Array; },
        make: function (value) { return value; }
    },
    object: {
        isa: function (value) { return value instanceof Object; },
        make: function (value) { return value; }
    }
};
var TypeConstraint = (function () {
    function TypeConstraint(type) {
        this.type = type;
    }
    TypeConstraint.prototype.isa = function (value) {
        return exports.TypeMap[this.type].isa(value);
    };
    TypeConstraint.prototype.validate = function (value, path, errors) {
        if (!this.isa(value)) {
            errors.push({
                path: path,
                value: value,
                schema: this,
                message: this.errorMessage(value)
            });
        }
    };
    TypeConstraint.prototype.errorMessage = function (value) {
        return "Not " + this.type + ": " + value;
    };
    TypeConstraint.prototype.fromJSON = function (data) {
        if (this.isa(data)) {
            return data;
        }
        else {
            throw new ValidationException([{
                    path: '$',
                    value: data,
                    schema: this,
                    message: "Invalid Value"
                }]);
        }
    };
    TypeConstraint.prototype.toJSON = function () {
        return {
            type: this.type
        };
    };
    return TypeConstraint;
}());
exports.TypeConstraint = TypeConstraint;
var TypeSchema = (function () {
    function TypeSchema(type, constraints, maker) {
        this.type = new TypeConstraint(type);
        this._constraints = [this.type].concat(constraints);
        this._maker = maker ? maker : function (v) { return v; };
        if (type === 'string')
            console.info(u.inspect(this, { depth: 1000, colors: true }), u.inspect(maker, { colors: true }));
    }
    TypeSchema.prototype.isa = function (value) {
        for (var i = 0; i < this._constraints.length; ++i) {
            if (!this._constraints[i].isa(value)) {
                return false;
            }
        }
        return true;
    };
    TypeSchema.prototype.validate = function (value, path, errors) {
        for (var i = 0; i < this._constraints.length; ++i) {
            this._constraints[i].validate(value, path, errors);
        }
    };
    TypeSchema.prototype.fromJSON = function (data) {
        var exc = validate(this, data);
        if (exc.hasErrors())
            exc.raise();
        return this._maker(data);
    };
    TypeSchema.prototype.toJSON = function () {
        var result = util.extend.apply(util, this._constraints.map(function (s) { return s.toJSON(); }));
        return result;
    };
    return TypeSchema;
}());
exports.TypeSchema = TypeSchema;
var EnumConstraint = (function () {
    function EnumConstraint(values) {
        this.values = values;
    }
    EnumConstraint.prototype.isa = function (value) {
        for (var i = 0; i < this.values.length; ++i) {
            if (util.deepEqual(this.values[i], value))
                return true;
        }
        return false;
    };
    EnumConstraint.prototype.validate = function (value, path, errors) {
        if (!this.isa(value)) {
            errors.push({
                path: path,
                message: this.errorMessage(value),
                schema: this,
                value: value
            });
        }
    };
    EnumConstraint.prototype.fromJSON = function (data) {
        return data;
    };
    EnumConstraint.prototype.errorMessage = function (value) {
        return "Not one of the enumerated values";
    };
    EnumConstraint.prototype.toJSON = function () {
        return {
            enum: this.values
        };
    };
    return EnumConstraint;
}());
exports.EnumConstraint = EnumConstraint;
// this is the function that'll be recursively called...
function validate(s, value) {
    var err = new ValidationResult();
    s.validate(value, '', err.errors);
    return err;
}
exports.validate = validate;
//# sourceMappingURL=schema.js.map