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
var ValidationException = (function (_super) {
    __extends(ValidationException, _super);
    function ValidationException(errors) {
        if (errors === void 0) { errors = []; }
        var _this = _super.call(this) || this;
        _this.errors = errors;
        return _this;
    }
    return ValidationException;
}(Error));
exports.ValidationException = ValidationException;
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
var TypeSchema = (function () {
    function TypeSchema(type, maker) {
        if (maker === void 0) { maker = function (data) { return data; }; }
        this.type = type;
        this.maker = maker;
    }
    TypeSchema.prototype.isa = function (value) {
        return exports.TypeMap[this.type].isa(value);
    };
    TypeSchema.prototype.validate = function (value, path, errors) {
        if (!this.isa(value)) {
            errors.push({
                path: path,
                value: value,
                schema: this,
                message: this.errorMessage(value)
            });
        }
    };
    TypeSchema.prototype.errorMessage = function (value) {
        return "Not " + this.type + ": " + value;
    };
    TypeSchema.prototype.fromJSON = function (data) {
        if (this.isa(data)) {
            return this.maker(data);
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
    TypeSchema.prototype.toJSON = function () {
        return {
            type: this.type
        };
    };
    return TypeSchema;
}());
exports.TypeSchema = TypeSchema;
var CompoundSchema = (function () {
    function CompoundSchema(constraints) {
        this.constraints = constraints;
    }
    CompoundSchema.prototype.isa = function (value) {
        for (var i = 0; i < this.constraints.length; ++i) {
            if (!this.constraints[i].isa(value)) {
                return false;
            }
        }
        return true;
    };
    CompoundSchema.prototype.validate = function (value, path, errors) {
        for (var i = 0; i < this.constraints.length; ++i) {
            this.constraints[i].validate(value, path, errors);
        }
    };
    CompoundSchema.prototype.fromJSON = function (data) {
        var result = data;
        for (var i = 0; i < this.constraints.length; ++i) {
            result = this.constraints[i].fromJSON(result);
        }
        return result;
    };
    CompoundSchema.prototype.toJSON = function () {
        var result = util.extend.apply(util, this.constraints.map(function (s) { return s.toJSON(); }));
        return result;
    };
    return CompoundSchema;
}());
exports.CompoundSchema = CompoundSchema;
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
    var err = new ValidationException();
    s.validate(value, '', err.errors);
    return err;
}
exports.validate = validate;
//# sourceMappingURL=schema.js.map