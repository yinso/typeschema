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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var integer_1 = require("./integer");
var valiDate = require("vali-date");
function isNumber(v) {
    return typeof (v) === 'number' || (v instanceof Number);
}
function isInteger(v) {
    return isNumber(v) && ((v % 1) === 0);
}
function isString(v) {
    return typeof (v) === 'string' || (v instanceof String);
}
function isBoolean(v) {
    return typeof (v) === 'boolean' || (v instanceof String);
}
function isArray(v) {
    return v instanceof Array;
}
function isNull(v) {
    return v === null;
}
function isObject(v) {
    return v instanceof Object;
}
var JsonSchema = (function () {
    function JsonSchema() {
    }
    JsonSchema.prototype.validate = function (val, path, errors) {
        if (path === void 0) { path = ''; }
        if (errors === void 0) { errors = []; }
        this._validate(val, path, errors);
        return errors;
    };
    return JsonSchema;
}());
exports.JsonSchema = JsonSchema;
var StringJsonSchema = (function (_super) {
    __extends(StringJsonSchema, _super);
    function StringJsonSchema() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'string';
        return _this;
    }
    StringJsonSchema.prototype.isa = function (val) {
        return typeof (val) === 'string' || (val instanceof String);
    };
    StringJsonSchema.prototype._validate = function (val, path, errors) {
        if (!this.isa(val)) {
            errors.push({
                path: path,
                value: val,
                message: 'Not a string',
                schema: this
            });
        }
    };
    StringJsonSchema.prototype.toSchema = function () {
        return {
            type: this.type
        };
    };
    return StringJsonSchema;
}(JsonSchema));
var DateJsonSchema = (function (_super) {
    __extends(DateJsonSchema, _super);
    function DateJsonSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateJsonSchema.prototype.isa = function (val) {
        return _super.prototype.isa.call(this, val) && valiDate(val);
    };
    DateJsonSchema.prototype._validate = function (val, path, errors) {
        if (!this.isa(val)) {
            errors.push({
                path: path,
                value: val,
                message: 'Not a Date',
                schema: this
            });
        }
    };
    DateJsonSchema.prototype.toSchema = function () {
        return {
            type: this.type,
            format: 'date-time'
        };
    };
    return DateJsonSchema;
}(StringJsonSchema));
var NumberSchema = (function (_super) {
    __extends(NumberSchema, _super);
    function NumberSchema() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'number';
        return _this;
    }
    NumberSchema.prototype.isa = function (val) {
        return typeof (val) === 'number' || (val instanceof Number);
    };
    NumberSchema.prototype._validate = function (val, path, errors) {
        if (!this.isa(val)) {
            errors.push({
                path: path,
                value: val,
                message: 'Not a number',
                schema: this
            });
        }
    };
    NumberSchema.prototype.toSchema = function () {
        return {
            type: this.type
        };
    };
    return NumberSchema;
}(JsonSchema));
var IntegerSchema = (function (_super) {
    __extends(IntegerSchema, _super);
    function IntegerSchema() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'integer';
        return _this;
    }
    IntegerSchema.prototype.isa = function (val) {
        return _super.prototype.isa.call(this, val) && ((val % 1) === 0);
    };
    IntegerSchema.prototype._validate = function (val, path, errors) {
        if (!this.isa(val)) {
            errors.push({
                path: path,
                value: val,
                message: 'Not an integer',
                schema: this
            });
        }
    };
    IntegerSchema.prototype.toSchema = function () {
        return {
            type: this.type
        };
    };
    return IntegerSchema;
}(NumberSchema));
var BooleanSchema = (function (_super) {
    __extends(BooleanSchema, _super);
    function BooleanSchema() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'boolean';
        return _this;
    }
    BooleanSchema.prototype.isa = function (val) {
        return typeof (val) === 'boolean' || (val instanceof Boolean);
    };
    BooleanSchema.prototype._validate = function (val, path, errors) {
        if (!this.isa(val)) {
            errors.push({
                path: path,
                value: val,
                message: 'Not a boolean',
                schema: this
            });
        }
    };
    BooleanSchema.prototype.toSchema = function () {
        return {
            type: this.type
        };
    };
    return BooleanSchema;
}(JsonSchema));
var NullSchema = (function (_super) {
    __extends(NullSchema, _super);
    function NullSchema() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'null';
        return _this;
    }
    NullSchema.prototype.isa = function (val) {
        return val === null;
    };
    NullSchema.prototype._validate = function (val, path, errors) {
        if (!this.isa(val)) {
            errors.push({
                path: path,
                value: val,
                message: 'Not null',
                schema: this
            });
        }
    };
    NullSchema.prototype.toSchema = function () {
        return {
            type: this.type
        };
    };
    return NullSchema;
}(JsonSchema));
var ArraySchema = (function (_super) {
    __extends(ArraySchema, _super);
    function ArraySchema(inner) {
        var _this = _super.call(this) || this;
        _this.type = 'array';
        return _this;
    }
    ArraySchema.prototype.isa = function (val) {
        return val instanceof Array;
    };
    ArraySchema.prototype._validate = function (val, path, errors) {
        var _this = this;
        if (!this.isa(val)) {
            errors.push({
                path: path,
                value: val,
                message: 'Not an array',
                schema: this
            });
        }
        val.forEach(function (item, i) {
            _this.inner.validate(item, path + "." + i, errors);
        });
    };
    ArraySchema.prototype.toSchema = function () {
        return {
            type: this.type,
            items: this.inner.toSchema()
        };
    };
    return ArraySchema;
}(JsonSchema));
var ObjectSchema = (function (_super) {
    __extends(ObjectSchema, _super);
    function ObjectSchema(properties) {
        var _this = _super.call(this) || this;
        _this.type = 'object';
        _this.properties = properties;
        _this.required = [];
        return _this;
    }
    ObjectSchema.prototype.isa = function (val) {
        return val instanceof Object;
    };
    ObjectSchema.prototype._validate = function (val, path, errors) {
        if (!this.isa(val)) {
            errors.push({
                path: path,
                value: val,
                message: 'Not an object',
                schema: this
            });
        }
    };
    ObjectSchema.prototype.setProperty = function (key, prop, optional) {
        if (optional === void 0) { optional = false; }
        if (this.properties.hasOwnProperty(key)) {
            throw new Error("ObjectSchema:duplicateProperty: " + key);
        }
        this.properties[key] = prop;
        if (!optional) {
            this.required.push(key);
        }
    };
    ObjectSchema.prototype.toSchema = function () {
        return {
            type: this.type,
            properties: this._toPropertySchemas(),
            required: this.required
        };
    };
    ObjectSchema.prototype._toPropertySchemas = function () {
        var result = {};
        for (var key in this.properties) {
            if (this.properties.hasOwnProperty(key)) {
                result[key] = this.properties[key].toSchema();
            }
        }
        return result;
    };
    return ObjectSchema;
}(JsonSchema));
var OneOfSchema = (function (_super) {
    __extends(OneOfSchema, _super);
    function OneOfSchema(items) {
        var _this = _super.call(this) || this;
        _this.type = 'oneOf'; // this is used differently for when generating the schema JSON.
        _this.items = items;
        return _this;
    }
    OneOfSchema.prototype.isa = function (val) {
        for (var i = 0; i < this.items.length; ++i) {
            if (this.items[i].isa(val))
                return true;
        }
        return false;
    };
    OneOfSchema.prototype._validate = function (val, path, errors) {
        if (!this.isa(val)) {
            errors.push({
                path: path,
                value: val,
                message: 'Not one of',
                schema: this
            });
        }
    };
    OneOfSchema.prototype.toSchema = function () {
        return {
            type: this.items.map(function (schema) { return schema.type; })
        };
    };
    return OneOfSchema;
}(JsonSchema));
function makeSchema(options) {
    console.info('***************** makeSchema', options);
    var type = options.type || 'object';
    if (type instanceof Array) {
        return makeOneOfSchema(options);
    }
    else {
        switch (type) {
            case 'number':
                return new NumberSchema();
            case 'integer':
                return new IntegerSchema();
            case 'string':
                if (options.format) {
                    return new DateJsonSchema();
                }
                else {
                    return new StringJsonSchema();
                }
            case 'boolean':
                return new BooleanSchema();
            case 'null':
                return new NullSchema();
            case 'array':
                return makeArraySchema(options);
            case 'object':
                return makeObjectSchema(options);
            default:
                throw new Error("UnknownSchemaType: " + type);
        }
    }
}
exports.makeSchema = makeSchema;
function makeArraySchema(options) {
    if (options.items) {
        var inner = makeSchema(options.items);
        return new ArraySchema(inner);
    }
    throw new Error("ArraySchema:no_items");
}
function makeObjectSchema(options) {
    if (options.properties) {
        var properties = {};
        for (var key in options.properties) {
            if (options.properties.hasOwnProperty(key)) {
                properties[key] = makeSchema(options.properties[key]);
            }
        }
        return new ObjectSchema(properties);
    }
    else {
        throw new Error("ObjectSchema:no_properties");
    }
}
function makeOneOfSchema(options) {
    if (options.type instanceof Array) {
        var items = options.type.map(function (type) { return makeSchema(__assign({}, options, { type: type })); });
        return new OneOfSchema(items);
    }
    else {
        throw new Error("OneOfSchema:not_array");
    }
}
var SCHEMA_FIELD = '__schema';
// there are a few things to do in order to construct the right schema tree.
// 1 - every Ctor will have a __schema field
// 2 - the first call will create it.
// 3 - there will be decorators that will be used to generate the __schema field and populate it with information.
// 4 - due to the complexity of the information, there needs to be a way to make sense of it all
// @Schema is a top level
function attachSchema(constructor, schema) {
    if (!constructor.hasOwnProperty(SCHEMA_FIELD)) {
        Object.defineProperty(constructor, SCHEMA_FIELD, {
            value: schema,
            enumerable: true,
            configurable: false,
            writable: false
        });
    }
    return constructor;
}
exports.attachSchema = attachSchema;
function getAttachedSchema(constructor) {
    var prop = Object.getOwnPropertyDescriptor(constructor, SCHEMA_FIELD);
    if (prop) {
        return prop.value;
    }
    else {
        throw new Error("NoSchemaDefined");
    }
}
function addProperty(target, key, options, ctor) {
    var constructor = target.constructor;
    attachSchema(constructor, makeObjectSchema({
        type: 'object',
        properties: {},
        required: []
    }));
    var schema = getAttachedSchema(constructor);
    var propSchema = getSchema(ctor);
    schema.setProperty(key, propSchema, options.optional ? true : false);
    propSchema['$ctor'] = ctor;
}
exports.addProperty = addProperty;
function isOptional(options) {
    return options.optional === true;
}
// how do deal with default values?
// have a function 
function getSchema(ctor) {
    console.info('--------getSchema', ctor);
    if (ctor === integer_1.Integer) {
        return makeSchema({ type: 'integer' });
    }
    else if (ctor === String) {
        return makeSchema({ type: 'string' });
    }
    else if (ctor === Boolean) {
        return makeSchema({ type: 'boolean' });
    }
    else if (ctor === Date) {
        return makeSchema({ type: 'string', format: 'date-time' });
    }
    var prop = Object.getOwnPropertyDescriptor(ctor, SCHEMA_FIELD);
    if (prop) {
        return prop.value;
    }
    else {
        throw new Error("NoSchemaDefined");
    }
}
exports.getSchema = getSchema;
//# sourceMappingURL=schema2.js.map