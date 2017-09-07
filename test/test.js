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
var B = require("../lib/builder");
var I = require("../lib/integer");
var A = require("../lib/array");
var test_util_1 = require("../lib/test-util");
var EnumConstraintTest = (function () {
    function EnumConstraintTest() {
    }
    EnumConstraintTest.prototype.canValidate = function () {
        var x = new S.EnumConstraint([1, 'hello', 'test']);
        test_util_1.noErrors(S.validate(x, 1));
        test_util_1.noErrors(S.validate(x, 'hello'));
        test_util_1.noErrors(S.validate(x, 'test'));
        test_util_1.hasErrors(S.validate(x, true));
    };
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], EnumConstraintTest.prototype, "canValidate", null);
    EnumConstraintTest = __decorate([
        test_util_1.suite
    ], EnumConstraintTest);
    return EnumConstraintTest;
}());
var ArraySchemaTest = (function () {
    function ArraySchemaTest() {
    }
    ArraySchemaTest.prototype.canCreateSchema = function () {
        var x = new A.ArraySchema({ items: new A.ItemsConstraint(new I.IntegerSchema()) });
        test_util_1.noErrors(S.validate(x, [5, 10, 15]));
        test_util_1.hasErrors(S.validate(x, [1, 'ehllo', 5]));
    };
    ArraySchemaTest.prototype.canUseBuilder = function () {
        var x = B.makeSchema({
            type: 'array',
            items: {
                type: 'integer'
            }
        });
        test_util_1.noErrors(S.validate(x, [1, 2, 3]));
        test_util_1.hasErrors(S.validate(x, 'hello'));
        test_util_1.hasErrors(S.validate(x, [1, 'hello']));
    };
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ArraySchemaTest.prototype, "canCreateSchema", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ArraySchemaTest.prototype, "canUseBuilder", null);
    ArraySchemaTest = __decorate([
        test_util_1.suite
    ], ArraySchemaTest);
    return ArraySchemaTest;
}());
var DeserializeTest = (function () {
    function DeserializeTest() {
    }
    DeserializeTest.prototype.canDeserializeNumber = function () {
        // is this what I'm looking for?
        var num = S.fromJSON(Number, 1);
        var str = S.fromJSON(String, 'test');
        var date = S.fromJSON(Date, '2013-01-01T00:00:00Z');
    };
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DeserializeTest.prototype, "canDeserializeNumber", null);
    DeserializeTest = __decorate([
        test_util_1.suite
    ], DeserializeTest);
    return DeserializeTest;
}());
//# sourceMappingURL=test.js.map