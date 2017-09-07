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
S.TypeMap['null'] = {
    isa: function (v) { return v === null; },
    make: function (v) { return v; }
};
var NullSchema = (function (_super) {
    __extends(NullSchema, _super);
    function NullSchema(constraints) {
        if (constraints === void 0) { constraints = []; }
        return _super.call(this, 'null', constraints) || this;
    }
    NullSchema.prototype.jsonify = function (value) {
        if (value === null)
            return value;
        else
            throw new Error("Not a null");
    };
    return NullSchema;
}(S.TypeSchema));
exports.NullSchema = NullSchema;
//# sourceMappingURL=null.js.map