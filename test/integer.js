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
var N = require("../lib/number");
var I = require("../lib/integer");
var test_util_1 = require("../lib/test-util");
var IntegerSchemaTest = (function () {
    function IntegerSchemaTest() {
    }
    IntegerSchemaTest.prototype.canValidateInteger = function () {
        var x = new I.IntegerSchema();
        test_util_1.noErrors(S.validate(x, 10));
        test_util_1.deepEqual(x.toJSON(), { type: 'integer' });
    };
    IntegerSchemaTest.prototype.canRejectNonInteger = function () {
        var x = new I.IntegerSchema();
        test_util_1.hasErrors(S.validate(x, 10.1));
    };
    IntegerSchemaTest.prototype.canConstraintMultipleOf = function () {
        var x = new I.IntegerSchema({ multipleOf: new N.MultipleOfConstraint(5) });
        test_util_1.hasErrors(S.validate(x, 4));
        test_util_1.noErrors(S.validate(x, 10));
        test_util_1.deepEqual(x.toJSON(), { type: 'integer', multipleOf: 5 });
    };
    IntegerSchemaTest.prototype.canConstraintMinimum = function () {
        var x = new I.IntegerSchema({ minimum: new N.MinimumConstraint(5, false) });
        test_util_1.hasErrors(S.validate(x, 4));
        test_util_1.noErrors(S.validate(x, 6));
        test_util_1.deepEqual(x.toJSON(), { type: 'integer', minimum: 5, exclusiveMinimum: false });
    };
    IntegerSchemaTest.prototype.canConstraintMaximum = function () {
        var x = new I.IntegerSchema({ maximum: new N.MaximumConstraint(5, false) });
        test_util_1.noErrors(S.validate(x, 4));
        test_util_1.hasErrors(S.validate(x, 6));
        test_util_1.deepEqual(x.toJSON(), { type: 'integer', maximum: 5, exclusiveMaximum: false });
    };
    IntegerSchemaTest.prototype.canCreateInteger = function () {
        var x = new I.Integer(10);
    };
    IntegerSchemaTest.prototype.canValidateIntegerObject = function () {
        test_util_1.throws(function () { return new I.Integer(16.1); });
        test_util_1.noThrows(function () { return new I.Integer(16); });
    };
    IntegerSchemaTest.prototype.canDeserialize = function () {
        var s = new I.IntegerSchema();
        test_util_1.deepEqual(s.fromJSON(1), 1);
        test_util_1.throws(function () { return s.fromJSON(1.1); });
        test_util_1.throws(function () { return s.fromJSON('hello'); });
        test_util_1.throws(function () { return s.fromJSON(true); });
        test_util_1.throws(function () { return s.fromJSON([]); });
        test_util_1.throws(function () { return s.fromJSON({}); });
        test_util_1.throws(function () { return s.fromJSON(null); });
    };
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], IntegerSchemaTest.prototype, "canValidateInteger", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], IntegerSchemaTest.prototype, "canRejectNonInteger", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], IntegerSchemaTest.prototype, "canConstraintMultipleOf", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], IntegerSchemaTest.prototype, "canConstraintMinimum", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], IntegerSchemaTest.prototype, "canConstraintMaximum", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], IntegerSchemaTest.prototype, "canCreateInteger", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], IntegerSchemaTest.prototype, "canValidateIntegerObject", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], IntegerSchemaTest.prototype, "canDeserialize", null);
    IntegerSchemaTest = __decorate([
        test_util_1.suite
    ], IntegerSchemaTest);
    return IntegerSchemaTest;
}());
//# sourceMappingURL=integer.js.map