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
var BooleanSchema = (function (_super) {
    __extends(BooleanSchema, _super);
    function BooleanSchema(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var constraints = [];
        if (options.enum)
            constraints.push(options.enum);
        _this = _super.call(this, [new S.TypeSchema('boolean')].concat(constraints)) || this;
        return _this;
    }
    return BooleanSchema;
}(S.CompoundSchema));
exports.BooleanSchema = BooleanSchema;
//# sourceMappingURL=boolean.js.map