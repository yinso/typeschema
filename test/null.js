"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var S = require("../lib/schema");
var test_util_1 = require("../lib/test-util");
var U = require("../lib/null");
var NullSchemaTest = (function () {
    function NullSchemaTest() {
    }
    NullSchemaTest.prototype.canValidateNull = function () {
        var s = new U.NullSchema();
        test_util_1.noErrors(S.validate(s, null));
        test_util_1.hasErrors(S.validate(s, 1));
        test_util_1.hasErrors(S.validate(s, 'hello'));
        test_util_1.hasErrors(S.validate(s, true));
        test_util_1.hasErrors(S.validate(s, []));
        test_util_1.hasErrors(S.validate(s, {}));
    };
    NullSchemaTest.prototype.canDeserialize = function () {
        var s = new U.NullSchema();
        test_util_1.deepEqual(s.fromJSON(null), null);
        test_util_1.throws(function () { return s.fromJSON(1); });
        test_util_1.throws(function () { return s.fromJSON('hello'); });
        test_util_1.throws(function () { return s.fromJSON(true); });
        test_util_1.throws(function () { return s.fromJSON([]); });
        test_util_1.throws(function () { return s.fromJSON({}); });
    };
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NullSchemaTest.prototype, "canValidateNull", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NullSchemaTest.prototype, "canDeserialize", null);
    NullSchemaTest = __decorate([
        test_util_1.suite
    ], NullSchemaTest);
    return NullSchemaTest;
}());
//# sourceMappingURL=null.js.map