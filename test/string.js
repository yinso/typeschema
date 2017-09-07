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
var T = require("../lib/string");
var D = require("../lib/decorator");
var test_util_1 = require("../lib/test-util");
var StringSchemaTest = (function () {
    function StringSchemaTest() {
    }
    StringSchemaTest.prototype.canValidate = function () {
        var s = new T.StringSchema();
        test_util_1.noErrors(S.validate(s, 'hello'));
        test_util_1.hasErrors(S.validate(s, false));
        test_util_1.hasErrors(S.validate(s, 1));
        test_util_1.hasErrors(S.validate(s, []));
        test_util_1.hasErrors(S.validate(s, null));
        test_util_1.hasErrors(S.validate(s, {}));
    };
    StringSchemaTest.prototype.canDeserialize = function () {
        var s = new T.StringSchema();
        test_util_1.deepEqual(s.fromJSON('hello'), 'hello');
        test_util_1.throws(function () { return s.fromJSON(1.1); });
        test_util_1.throws(function () { return s.fromJSON(true); });
        test_util_1.throws(function () { return s.fromJSON(1); });
        test_util_1.throws(function () { return s.fromJSON([]); });
        test_util_1.throws(function () { return s.fromJSON({}); });
        test_util_1.throws(function () { return s.fromJSON(null); });
    };
    StringSchemaTest.prototype.canDeserializeDate = function () {
        var s = new T.StringSchema({ format: new T.Format('date-time') });
        var ts = '2017-01-01T00:00:00Z';
        test_util_1.deepEqual(s.fromJSON(ts), new Date(ts));
        test_util_1.throws(function () { return s.fromJSON('hello'); });
    };
    StringSchemaTest.prototype.canUseDecorator = function () {
        var SSN = D.makeValueObject({
            type: 'string',
            pattern: /^\d\d\d-?\d\d-?\d\d\d\d$/
        });
        test_util_1.noThrows(function () { return new SSN('123-45-6789'); });
        test_util_1.throws(function () { return new SSN('134'); });
        test_util_1.noThrows(function () { return SSN.fromJSON('123456789'); });
        test_util_1.throws(function () { return SSN.fromJSON('junk'); });
        test_util_1.deepEqual(new SSN('123-45-6789').toJSON(), '123-45-6789');
    };
    StringSchemaTest.prototype.canAddNewFormat = function () {
        var SSN = D.makeValueObject({
            type: 'string',
            pattern: /^\d\d\d-?\d\d-?\d\d\d\d$/
        });
        T.registerFormat('ssn', {
            isa: function (v) { return SSN.getSchema().isa(v); },
            fromJSON: function (v) { return SSN.fromJSON(v); },
            jsonify: function (v) { return v.toJSON(); }
        });
        var s = new T.StringSchema({ format: new T.Format('ssn') });
        var ssn = '123456789';
        test_util_1.deepEqual(s.fromJSON(ssn), new SSN(ssn));
        test_util_1.deepEqual(new SSN(ssn).toJSON(), ssn);
    };
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], StringSchemaTest.prototype, "canValidate", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], StringSchemaTest.prototype, "canDeserialize", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], StringSchemaTest.prototype, "canDeserializeDate", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], StringSchemaTest.prototype, "canUseDecorator", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], StringSchemaTest.prototype, "canAddNewFormat", null);
    StringSchemaTest = __decorate([
        test_util_1.suite
    ], StringSchemaTest);
    return StringSchemaTest;
}());
//# sourceMappingURL=string.js.map