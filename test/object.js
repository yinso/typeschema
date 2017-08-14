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
var S = require("../lib/schema");
var B = require("../lib/builder");
var I = require("../lib/integer");
var T = require("../lib/string");
var A = require("../lib/array");
var O = require("../lib/object");
var BO = require("../lib/boolean");
var V = require("../lib/value-object");
var test_util_1 = require("../lib/test-util");
var util = require("util");
var ObjectSchemaTest = (function () {
    function ObjectSchemaTest() {
    }
    ObjectSchemaTest.prototype.canCreateSchema = function () {
        var x = new O.ObjectSchema({
            properties: new O.PropertiesConstraint({
                foo: new I.IntegerSchema(),
                bar: new T.StringSchema(),
                xyz: new A.ArraySchema({ items: new A.ItemsConstraint(new BO.BooleanSchema()) })
            }),
            required: new O.RequiredConstraint(['foo', 'bar'])
        });
        test_util_1.noErrors(S.validate(x, {
            foo: 1, bar: 'hello'
        }));
        test_util_1.noErrors(S.validate(x, {
            foo: 1, bar: 'hello', xyz: [true, false, true]
        }));
    };
    ObjectSchemaTest.prototype.canUseBuilder = function () {
        var x = B.makeSchema({
            type: 'object',
            properties: {
                foo: { type: 'integer' },
                bar: { type: 'string' },
                xyz: {
                    type: 'array',
                    items: { type: 'boolean' }
                }
            },
            required: ['foo', 'bar']
        });
        test_util_1.noErrors(S.validate(x, {
            foo: 1, bar: 'hello'
        }));
        test_util_1.noErrors(S.validate(x, {
            foo: 1, bar: 'hello', xyz: [true, false, true]
        }));
    };
    ObjectSchemaTest.prototype.canDeserialize = function () {
        var SSN = (function (_super) {
            __extends(SSN, _super);
            function SSN() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SSN;
        }(V.ValueObject));
        var Person = (function () {
            function Person(options) {
                this.name = options.name;
                this.ssn = options.ssn;
                this.birthday = options.birthday;
            }
            Person.prototype.toJSON = function () {
                return {
                    name: this.name,
                    ssn: this.ssn.toJSON(),
                    birthday: this.birthday.toISOString()
                };
            };
            return Person;
        }());
        //T.registerFormat('ssn', (v) => /^\d\d\d-?\d\d-?\d\d\d\d$/.test(v), (v) => new SSN(v))
        var s_ssn = B.makeSchema({
            type: 'string',
            pattern: '^\\d\\d\\d-?\\d\\d-?\\d\\d\\d\\d$',
            $make: function (v) { return new SSN(v); }
        });
        var s_person = B.makeSchema({
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                },
                ssn: s_ssn,
                birthday: {
                    type: 'string', format: 'date-time'
                }
            },
            required: ['name', 'ssn', 'birthday'],
            $make: function (v) {
                console.info('new Person being called...', v);
                return new Person(v);
            }
        });
        var johnJson = {
            name: 'John',
            ssn: '123-45-6789',
            birthday: '1970-01-10T00:00:00.000Z'
        };
        var john = s_person.fromJSON(johnJson);
        test_util_1.deepEqual(john.toJSON(), johnJson);
        console.info(util.inspect(john, { depth: 1000, colors: true }));
    };
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ObjectSchemaTest.prototype, "canCreateSchema", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ObjectSchemaTest.prototype, "canUseBuilder", null);
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ObjectSchemaTest.prototype, "canDeserialize", null);
    ObjectSchemaTest = __decorate([
        test_util_1.suite
    ], ObjectSchemaTest);
    return ObjectSchemaTest;
}());
//# sourceMappingURL=object.js.map