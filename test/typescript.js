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
var ast = require("../lib/ast");
var ts = require("../lib/typescript");
var test_util_1 = require("../lib/test-util");
var PrinterTest = /** @class */ (function () {
    function PrinterTest() {
    }
    PrinterTest.prototype.canPrint = function () {
        var printer = new ts.Printer();
        console.info(printer.print(ast.ifExp(ast.binaryExp('==', ast.identifier('a'), ast.stringExp('hello kitty\'s')), ast.blockExp([
            ast.funcallExp(ast.memberExp(ast.identifier('console'), ast.identifier('log')), [ast.identifier('a')])
        ]), ast.blockExp([
            ast.funcallExp(ast.memberExp(ast.identifier('console'), ast.identifier('log')), [ast.identifier('a')])
        ]))));
        var transformer = new ts.StringTypeTransformer(ast.stringTypeExp(ast.identifier('SSN')));
        console.info(printer.print(transformer.transform()));
    };
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], PrinterTest.prototype, "canPrint", null);
    PrinterTest = __decorate([
        test_util_1.suite
    ], PrinterTest);
    return PrinterTest;
}());
//# sourceMappingURL=typescript.js.map