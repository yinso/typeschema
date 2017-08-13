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
var ItemsConstraint = (function () {
    function ItemsConstraint(items) {
        this.items = items;
    }
    ItemsConstraint.prototype.isa = function (value) {
        if (!S.TypeMap.array.isa(value))
            return false;
        for (var i = 0; i < value.length; ++i) {
            if (!this.items.isa(value)) {
                return false;
            }
        }
        return true;
    };
    ItemsConstraint.prototype.validate = function (value, path, errors) {
        var _this = this;
        if (!S.TypeMap.array.isa(value)) {
            errors.push({
                path: path,
                message: "Not an array",
                schema: this,
                value: value
            });
        }
        else {
            value.forEach(function (item, i) {
                _this.items.validate(item, path + "[" + i + "]", errors);
            });
        }
    };
    ItemsConstraint.prototype.fromJSON = function (data) {
        return data;
    };
    ItemsConstraint.prototype.toJSON = function () {
        return {
            items: this.items.toJSON()
        };
    };
    return ItemsConstraint;
}());
exports.ItemsConstraint = ItemsConstraint;
var ArraySchema = (function (_super) {
    __extends(ArraySchema, _super);
    function ArraySchema(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var constraints = [];
        if (options.items)
            constraints.push(options.items);
        if (options.enum)
            constraints.push(options.enum);
        if (options.minItems)
            constraints.push(options.minItems);
        if (options.maxItems)
            constraints.push(options.maxItems);
        _this = _super.call(this, [new S.TypeSchema('array')].concat(constraints)) || this;
        return _this;
    }
    return ArraySchema;
}(S.CompoundSchema));
exports.ArraySchema = ArraySchema;
//# sourceMappingURL=array.js.map