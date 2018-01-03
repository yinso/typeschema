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
var test_util_1 = require("../lib/test-util");
var EnvironmentTest = /** @class */ (function () {
    function EnvironmentTest() {
    }
    EnvironmentTest.prototype.canCreate = function () {
        var env = new ast.Environment();
        env.set(ast.identifier('test'), ast.integerExp(1));
        console.log(env.get(ast.identifier('test')));
        var nested = env.pushEnv();
        console.log(env.get(ast.identifier('test'))); // expect to exist again.
    };
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], EnvironmentTest.prototype, "canCreate", null);
    EnvironmentTest = __decorate([
        test_util_1.suite
    ], EnvironmentTest);
    return EnvironmentTest;
}());
//# sourceMappingURL=environment.js.map