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
var valiDate = require("vali-date");
var StringSchema = (function (_super) {
    __extends(StringSchema, _super);
    function StringSchema(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var constraints = [];
        if (options.minLength)
            constraints.push(options.minLength);
        if (options.maxLength)
            constraints.push(options.maxLength);
        if (options.pattern)
            constraints.push(options.pattern);
        if (options.format)
            constraints.push(options.format);
        _this = _super.call(this, [new S.TypeSchema('string')].concat(constraints)) || this;
        return _this;
    }
    return StringSchema;
}(S.CompoundSchema));
exports.StringSchema = StringSchema;
var MinLength = (function () {
    function MinLength(minLength) {
        this.minLength = minLength;
    }
    MinLength.prototype.isa = function (value) {
        return value.length >= this.minLength;
    };
    MinLength.prototype.validate = function (value, path, errors) {
        if (!this.isa(value)) {
            errors.push({
                path: path,
                value: value,
                schema: this,
                message: "Length less than " + this.minLength
            });
        }
    };
    MinLength.prototype.fromJSON = function (data) {
        return data;
    };
    MinLength.prototype.toJSON = function () {
        return {
            minLength: this.minLength
        };
    };
    return MinLength;
}());
exports.MinLength = MinLength;
var MaxLength = (function () {
    function MaxLength(maxLength) {
        this.maxLength = maxLength;
    }
    MaxLength.prototype.isa = function (value) {
        return value.length >= this.maxLength;
    };
    MaxLength.prototype.validate = function (value, path, errors) {
        if (!this.isa(value)) {
            errors.push({
                path: path,
                value: value,
                schema: this,
                message: "Length greater than " + this.maxLength
            });
        }
    };
    MaxLength.prototype.fromJSON = function (data) {
        return data;
    };
    MaxLength.prototype.toJSON = function () {
        return {
            maxLength: this.maxLength
        };
    };
    return MaxLength;
}());
exports.MaxLength = MaxLength;
var Pattern = (function () {
    function Pattern(pattern) {
        this.pattern = new RegExp(pattern);
    }
    Pattern.prototype.isa = function (value) {
        return this.pattern.test(value);
    };
    Pattern.prototype.validate = function (value, path, errors) {
        if (!this.isa(value)) {
            errors.push({
                path: path,
                value: value,
                schema: this,
                message: "Failed pattern: " + this.pattern
            });
        }
    };
    Pattern.prototype.fromJSON = function (data) {
        return data;
    };
    Pattern.prototype.toJSON = function () {
        return {
            pattern: this.pattern.source
        };
    };
    return Pattern;
}());
exports.Pattern = Pattern;
var formatMap = {
    'date-time': {
        isa: valiDate,
        fromJSON: function (value) { return new Date(value); }
    }
};
function registerFormat(format, isa, fromJSON) {
    formatMap[format] = {
        isa: isa,
        fromJSON: fromJSON
    };
}
exports.registerFormat = registerFormat;
var Format = (function () {
    function Format(format) {
        if (!formatMap.hasOwnProperty(format)) {
            throw new Error("Unknown Format: " + format);
        }
        this.format = format;
    }
    Format.prototype.isa = function (value) {
        return formatMap[this.format].isa(value);
    };
    Format.prototype.validate = function (value, path, errors) {
        if (!this.isa(value)) {
            errors.push({
                path: path,
                value: value,
                schema: this,
                message: "Failed format: " + this.format
            });
        }
    };
    Format.prototype.fromJSON = function (data) {
        if (this.isa(data)) {
            return formatMap[this.format].fromJSON(data);
        }
        else {
            throw new S.ValidationException([{
                    path: '$',
                    schema: this,
                    value: data,
                    message: "Failed format: " + this.format
                }
            ]);
        }
    };
    Format.prototype.toJSON = function () {
        return {
            pattern: this.format
        };
    };
    return Format;
}());
exports.Format = Format;
//# sourceMappingURL=string.js.map