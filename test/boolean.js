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
var BO = require("../lib/boolean");
var test_util_1 = require("../lib/test-util");
var BooleanSchemaTest = (function () {
    function BooleanSchemaTest() {
    }
    BooleanSchemaTest.prototype.canValidate = function () {
        var s = new BO.BooleanSchema();
        test_util_1.noErrors(S.validate(s, true));
        test_util_1.noErrors(S.validate(s, false));
        test_util_1.hasErrors(S.validate(s, 1));
        test_util_1.hasErrors(S.validate(s, 'hello'));
        test_util_1.hasErrors(S.validate(s, []));
        test_util_1.hasErrors(S.validate(s, null));
        test_util_1.hasErrors(S.validate(s, {}));
    };
    BooleanSchemaTest.prototype.canDeserialize = function () {
        var s = new BO.BooleanSchema();
        test_util_1.deepEqual(s.fromJSON(true), true);
        test_util_1.deepEqual(s.fromJSON(false), false);
        test_util_1.throws(function () { return s.fromJSON(1.1); });
        test_util_1.throws(function () { return s.fromJSON('hello'); });
        test_util_1.throws(function () { return s.fromJSON(1); });
        test_util_1.throws(function () { return s.fromJSON([]); });
        test_util_1.throws(function () { return s.fromJSON({}); });
        test_util_1.throws(function () { return s.fromJSON(null); });
    };
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], BooleanSchemaTest.prototype, "canValidate", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], BooleanSchemaTest.prototype, "canDeserialize", null);
    BooleanSchemaTest = __decorate([
        test_util_1.suite
    ], BooleanSchemaTest);
    return BooleanSchemaTest;
}());
//# sourceMappingURL=boolean.js.map