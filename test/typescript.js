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
var T = require("../lib/ast");
var G = require("../lib/grammar");
var P = require("../lib/typescript");
var fs = require("fs-extra-promise");
var path = require("path");
var test_util_1 = require("../lib/test-util");
var TypeScriptTest = /** @class */ (function () {
    function TypeScriptTest() {
    }
    TypeScriptTest.prototype.canLoadTemplates = function () {
        var printer = new P.TypeScriptPrinter();
        return printer.loadTemplates()
            .then(function () {
            // now we can print.
            return printer.renderDeclaration(new T.TypeDeclaration('SSN', new T.StringType([new T.Pattern(/^\d\d\d-?\d\d-?\d\d\d\d$/), new T.MinLength(5)])));
        })
            .then(function (res) {
            return fs.writeFileAsync(path.join(__dirname, '..', '_test_source', 'ssn.ts'), res, 'utf8')
                .then(function () {
                console.info(res);
            });
        });
    };
    TypeScriptTest.prototype.canParseTypeDefinition = function () {
        var res = G.parse('type SSN = string with { pattern: /^\\d\\d\\d-?\\d\\d-?\\d\\d\\d\\d$/ minLength: 10 }');
        var decl = new T.TypeDeclaration('SSN', new T.StringType([new T.MinLength(10), new T.Pattern(/^\d\d\d-?\d\d-?\d\d\d\d$/)]));
        test_util_1.ok(res.length > 0 && res.get('SSN').equals(decl.typeExp));
    };
    TypeScriptTest.prototype.canParseObjectTypeDefinition = function () {
        var text = "\n    type Person = {\n      firstName: string\n      lastName: string\n      ssn ?: SSN\n    }\n    ";
        var res = G.parse(text);
        var decl = new T.TypeDeclaration('Person', new T.ObjectType([
            new T.ObjectTypeKeyVal('lastName', new T.StringType(), true),
            new T.ObjectTypeKeyVal('firstName', new T.StringType(), true),
            new T.ObjectTypeKeyVal('ssn', new T.RefType('SSN'), false),
        ]));
        test_util_1.ok(res.length > 0 && res.get('Person').equals(decl.typeExp));
    };
    TypeScriptTest.prototype.canPrintObjectType = function () {
        var printer = new P.TypeScriptPrinter();
        return printer.loadTemplates()
            .then(function () {
            var text = "\n        type Person = {\n          firstName: string\n          lastName: string\n          ssn ?: SSN\n        }\n        ";
            var res = G.parse(text);
            return printer.render(res);
        })
            .then(function (res) {
            return fs.writeFileAsync(path.join(__dirname, '..', '_test_source', 'person.ts'), res, 'utf8')
                .then(function () {
                console.info(res);
            });
        });
    };
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TypeScriptTest.prototype, "canLoadTemplates", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TypeScriptTest.prototype, "canParseTypeDefinition", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TypeScriptTest.prototype, "canParseObjectTypeDefinition", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TypeScriptTest.prototype, "canPrintObjectType", null);
    TypeScriptTest = __decorate([
        test_util_1.suite
    ], TypeScriptTest);
    return TypeScriptTest;
}());
//# sourceMappingURL=typescript.js.map