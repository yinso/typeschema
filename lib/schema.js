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
require('es6-shim');
var ValidationResult = /** @class */ (function () {
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
var ValidationException = /** @class */ (function (_super) {
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
function isJsonable(v) {
    return v && isFunction(v.toJSON);
}
exports.isJsonable = isJsonable;
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
        make: function (value) {
            console.info('string.make', value);
            return value;
        }
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
var TypeConstraint = /** @class */ (function () {
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
    TypeConstraint.prototype.jsonify = function (value) {
        return value;
    };
    return TypeConstraint;
}());
exports.TypeConstraint = TypeConstraint;
var TypeSchema = /** @class */ (function () {
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
    TypeSchema.prototype.jsonify = function (value) {
        return value;
    };
    return TypeSchema;
}());
exports.TypeSchema = TypeSchema;
var EnumConstraint = /** @class */ (function () {
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
    EnumConstraint.prototype.jsonify = function (value) {
        return value;
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
var SCHEMA_FIELD = '__schema';
// there are a few things to do in order to construct the right schema tree.
// 1 - every Ctor will have a __schema field
// 2 - the first call will create it.
// 3 - there will be decorators that will be used to generate the __schema field and populate it with information.
// 4 - due to the complexity of the information, there needs to be a way to make sense of it all
// @Schema is a top level
var _builtInSchemas = new Map();
function registerSchema(ctor, schema) {
    _builtInSchemas.set(ctor, schema);
}
exports.registerSchema = registerSchema;
function attachSchema(constructor, schema) {
    console.info('Schema.attachSchema', constructor, schema);
    if (!constructor.hasOwnProperty(SCHEMA_FIELD)) {
        Object.defineProperty(constructor, SCHEMA_FIELD, {
            value: schema,
            enumerable: true,
            configurable: false,
            writable: false
        });
    }
    else {
        throw new Error("Schema Redefinition " + constructor);
    }
    return constructor;
}
exports.attachSchema = attachSchema;
function hasAttachedSchema(ctor) {
    var prop = Object.getOwnPropertyDescriptor(ctor, SCHEMA_FIELD);
    if (prop) {
        return prop.value;
    }
    else {
        return undefined;
    }
}
exports.hasAttachedSchema = hasAttachedSchema;
function hasSchema(ctor) {
    if (_builtInSchemas.has(ctor))
        return _builtInSchemas.get(ctor);
    else
        return hasAttachedSchema(ctor);
}
exports.hasSchema = hasSchema;
function getAttachedSchema(constructor) {
    var prop = Object.getOwnPropertyDescriptor(constructor, SCHEMA_FIELD);
    if (prop) {
        return prop.value;
    }
    else {
        throw new Error("NoSchemaDefined");
    }
}
exports.getAttachedSchema = getAttachedSchema;
function getSchema(ctor) {
    var res = _builtInSchemas.get(ctor);
    if (res)
        return res;
    else
        return getAttachedSchema(ctor);
}
exports.getSchema = getSchema;
function fromJSON(ctor, data) {
    var schema = getSchema(ctor);
    var result = validate(schema, data);
    if (result.errors.length > 0) {
        throw new ValidationException(result.errors);
    }
    else {
        return schema.fromJSON(data);
    }
}
exports.fromJSON = fromJSON;
//# sourceMappingURL=schema.js.map