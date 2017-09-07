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
        _this = _super.call(this, 'string', constraints, options.$make ? options.$make : (options.format ? formatMap[options.format.format].make : S.TypeMap.string.make)) || this;
        if (options.format)
            _this.format = options.format;
        return _this;
    }
    StringSchema.prototype.jsonify = function (value) {
        if (S.TypeMap.string.isa(value))
            return value;
        else if (value instanceof String)
            return value.valueOf();
        else if (this.format && this.format.isa(value))
            return this.format.jsonify(value);
        else
            throw new Error("Invalid Schema Value Match");
    };
    return StringSchema;
}(S.TypeSchema));
exports.StringSchema = StringSchema;
S.registerSchema(String, new StringSchema());
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
    MinLength.prototype.jsonify = function (value) {
        return value;
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
    MaxLength.prototype.jsonify = function (value) {
        return value;
    };
    return MaxLength;
}());
exports.MaxLength = MaxLength;
var Pattern = (function () {
    function Pattern(pattern) {
        if (pattern instanceof RegExp) {
            this.pattern = pattern;
        }
        else {
            this.pattern = new RegExp(pattern);
        }
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
    Pattern.prototype.jsonify = function (value) {
        return value;
    };
    return Pattern;
}());
exports.Pattern = Pattern;
var formatMap = {
    'date-time': {
        isa: valiDate,
        make: function (value) {
            console.info('date-time.make', value);
            return new Date(value);
        },
        jsonify: function (value) { return value.toJSON(); }
    }
};
function registerFormat(format, _a) {
    var isa = _a.isa, fromJSON = _a.fromJSON, jsonify = _a.jsonify;
    formatMap[format] = {
        isa: isa,
        make: fromJSON,
        jsonify: jsonify
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
            return formatMap[this.format].make(data);
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
    Format.prototype.jsonify = function (value) {
        if (this.isa(value)) {
            return formatMap[this.format].jsonify(value);
        }
        else {
            throw new Error("Invalid format");
        }
    };
    return Format;
}());
exports.Format = Format;
S.registerSchema(Date, new StringSchema({
    format: new Format('date-time')
}));
//# sourceMappingURL=string.js.map