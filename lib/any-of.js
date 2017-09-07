"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnyOfSchema = (function () {
    function AnyOfSchema(schemas) {
        this.schemas = schemas;
    }
    AnyOfSchema.prototype.isa = function (value) {
        for (var i = 0; i < this.schemas.length; ++i) {
            if (this.schemas[i].isa(value))
                return true;
        }
        return false;
    };
    AnyOfSchema.prototype.validate = function (value, path, errors) {
        for (var i = 0; i < this.schemas.length; ++i) {
            var tempErrors = [];
            this.schemas[i].validate(value, path, tempErrors);
            if (tempErrors.length === 0) {
                return;
            }
        }
        // if we get here - all validation has failed.
        errors.push({
            path: path,
            value: value,
            schema: this,
            message: "Not any of the inner schema types"
        });
    };
    AnyOfSchema.prototype.fromJSON = function (data) {
        for (var i = 0; i < this.schemas.length; ++i) {
            if (this.schemas[i].isa(data))
                return this.schemas[i].fromJSON(data);
        }
        // validation error!!!
    };
    AnyOfSchema.prototype.toJSON = function () {
        return {
            anyOf: this.schemas.map(function (s) { return s.toJSON(); })
        };
    };
    AnyOfSchema.prototype.jsonify = function (value) {
        for (var i = 0; i < this.schemas.length; ++i) {
            if (this.schemas[i].isa(value)) {
                return this.schemas[i].jsonify(value);
            }
        }
        return value;
    };
    return AnyOfSchema;
}());
exports.AnyOfSchema = AnyOfSchema;
//# sourceMappingURL=any-of.js.map