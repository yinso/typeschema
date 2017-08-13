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
var RequiredConstraint = (function () {
    function RequiredConstraint(required) {
        this.required = required;
    }
    RequiredConstraint.prototype.isa = function (value) {
        for (var i = 0; i < this.required.length; ++i) {
            if (!value.hasOwnProperty(this.required[i])) {
                return false;
            }
        }
        return true;
    };
    RequiredConstraint.prototype.setRequired = function (key) {
        this.required.push(key);
    };
    RequiredConstraint.prototype.validate = function (value, path, errors) {
        for (var i = 0; i < this.required.length; ++i) {
            if (!value.hasOwnProperty(this.required[i])) {
                errors.push({
                    path: path + "." + this.required[i],
                    message: this.errorMessage(value[i]),
                    value: value,
                    schema: this
                });
            }
        }
    };
    RequiredConstraint.prototype.errorMessage = function (value) {
        return "Missing required field: " + value;
    };
    RequiredConstraint.prototype.fromJSON = function (data) {
        return data;
    };
    RequiredConstraint.prototype.toJSON = function () {
        return {
            required: this.required
        };
    };
    return RequiredConstraint;
}());
exports.RequiredConstraint = RequiredConstraint;
var PropertiesConstraint = (function () {
    function PropertiesConstraint(properties) {
        this.properties = properties;
    }
    PropertiesConstraint.prototype.isa = function (value) {
        for (var key in this.properties) {
            if (value.hasOwnProperty(key)) {
                if (!this.properties[key].isa(value[key])) {
                    return false;
                }
            }
        }
        return true;
    };
    PropertiesConstraint.prototype.setProperty = function (key, prop) {
        this.properties[key] = prop;
    };
    PropertiesConstraint.prototype.validate = function (value, path, errors) {
        for (var key in this.properties) {
            if (value.hasOwnProperty(key)) {
                this.properties[key].validate(value[key], path + "." + key, errors);
            }
        }
    };
    PropertiesConstraint.prototype.errorMessage = function (value) {
        return "Not a Property";
    };
    PropertiesConstraint.prototype.fromJSON = function (data) {
        var res = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (this.properties.hasOwnProperty(key)) {
                    res[key] = this.properties[key].fromJSON(data[key]);
                }
                else {
                    res[key] = data[key];
                }
            }
        }
        return res;
    };
    PropertiesConstraint.prototype.toJSON = function () {
        var result = {};
        for (var key in this.properties) {
            if (this.properties.hasOwnProperty(key)) {
                result[key] = this.properties[key].toJSON();
            }
        }
        return { properties: result };
    };
    return PropertiesConstraint;
}());
exports.PropertiesConstraint = PropertiesConstraint;
// we need a bit more ability to figure out what's going on since these things are interacting with each other..
var ObjectSchema = (function (_super) {
    __extends(ObjectSchema, _super);
    function ObjectSchema(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var constraints = [];
        if (options.enum)
            constraints.push(options.enum);
        if (options.required)
            constraints.push(options.required);
        if (options.properties)
            constraints.push(options.properties);
        _this = _super.call(this, [new S.TypeSchema('object')].concat(constraints)) || this;
        if (options.required)
            _this.required = options.required;
        if (options.properties)
            _this.properties = options.properties;
        return _this;
    }
    ObjectSchema.prototype.fromJSON = function (value) {
        var validateRes = S.validate(this, value);
        if (validateRes.errors.length > 0)
            throw validateRes;
        // otherwise - it's time to get the values converted...
        var res = this.properties.fromJSON(value);
        return res;
    };
    ObjectSchema.prototype.setProperty = function (key, prop, required) {
        if (required === void 0) { required = true; }
        // this can be difficult to do!!!
        // perhaps this is where the design falls down? hmm...
        this.properties.setProperty(key, prop);
        if (required) {
            this.required.setRequired(key);
        }
    };
    return ObjectSchema;
}(S.CompoundSchema));
exports.ObjectSchema = ObjectSchema;
//# sourceMappingURL=object.js.map