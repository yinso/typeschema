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
var util = require("util");
var TS = require("../lib");
var mocha_typescript_1 = require("mocha-typescript");
var assert = require("assert");
var BaseTest = (function () {
    function BaseTest() {
    }
    BaseTest.prototype.canConstructStringSchema = function () {
        var Name = (function (_super) {
            __extends(Name, _super);
            function Name() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Name = __decorate([
                TS.Schema({ type: 'string', pattern: '\\S+' })
            ], Name);
            return Name;
        }(TS.ValueObject));
        var name = new Name('Yinso');
        assert.equal(name.valueOf(), 'Yinso');
        assert.throws(function () {
            new Name(1);
        });
    };
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], BaseTest.prototype, "canConstructStringSchema", null);
    BaseTest = __decorate([
        mocha_typescript_1.suite
    ], BaseTest);
    return BaseTest;
}());
var Test = (function () {
    function Test() {
        this.pattern = /[^\s]+/; // does this make use of the validation???
    }
    return Test;
}());
var Name = (function (_super) {
    __extends(Name, _super);
    function Name() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Name = __decorate([
        TS.Schema({ type: 'string', pattern: '\\S+' })
    ], Name);
    return Name;
}(TS.ValueObject));
var Integer = (function (_super) {
    __extends(Integer, _super);
    function Integer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Integer = __decorate([
        TS.Schema({ type: 'integer' })
    ], Integer);
    return Integer;
}(TS.ValueObject));
var Foo = (function () {
    function Foo() {
    }
    __decorate([
        TS.Property({}),
        __metadata("design:type", Integer)
    ], Foo.prototype, "foo", void 0);
    __decorate([
        TS.Property({}),
        __metadata("design:type", String)
    ], Foo.prototype, "bar", void 0);
    __decorate([
        TS.Property({
            optional: true
        }),
        __metadata("design:type", Boolean)
    ], Foo.prototype, "baz", void 0);
    __decorate([
        TS.Property({}),
        __metadata("design:type", void 0)
    ], Foo.prototype, "test", void 0);
    __decorate([
        TS.Property({}),
        __metadata("design:type", Date)
    ], Foo.prototype, "created", void 0);
    return Foo;
}());
console.info(util.inspect(Foo, { depth: 1000, colors: true }));
new Integer(10);
new Integer(5);
//new Integer(5.1)
//new Name(' ')
console.info(JSON.stringify({
    foo: new TS.Integer(10),
    bar: new Name('hello world'),
    created: new Date()
}));
//# sourceMappingURL=test.js.map