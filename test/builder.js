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
var B = require("../lib/builder");
var test_util_1 = require("../lib/test-util");
var BuilderTest = (function () {
    function BuilderTest() {
    }
    BuilderTest.prototype.equals = function (json) {
        var s = B.makeSchema(json);
        test_util_1.deepEqual(s.toJSON(), json);
    };
    BuilderTest.prototype.canBuildSchema = function () {
        this.equals({ type: 'integer' });
        this.equals({ type: 'number' });
        this.equals({ type: 'boolean' });
        this.equals({ type: 'null' });
        this.equals({ type: 'string' });
        this.equals({ type: 'array', items: { type: 'string' } });
        this.equals({ type: 'object',
            properties: { foo: { type: 'integer' }, bar: { type: 'string' } },
            required: []
        });
    };
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], BuilderTest.prototype, "canBuildSchema", null);
    BuilderTest = __decorate([
        test_util_1.suite
    ], BuilderTest);
    return BuilderTest;
}());
//# sourceMappingURL=builder.js.map