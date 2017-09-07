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
var D = require("../lib/decorator");
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
    ObjectSchemaTest.prototype.canUseDecorator = function () {
        var Foo = (function () {
            function Foo(options) {
                // these are already typed...
                // if we are going to create this function, the way to do it is to check against the class's maker...
                // i.e. the $class.isa(value) ==> ought to return the right values...
                // what happens when it's an | type??? in that case hopefully it will be the right types...
                // currently isa() checks for basic strutural values, but doesn't check against the ctor.
                // 
                // Class
                //   _$schema
                //     isa(value : any) => boolean - for JSON check (i.e. structural).
                //     validate(value : any) => result - structural check.
                //   fromJSON(value : any) => instance - utilizes _$schema
                //   isa(value : any) => should this utilize schema?
                //   the idea is that once it gets in here - we will need to be sure to check against the value's types, which 
                //   are the $class value!
                //   i.e this is because the target type & the end type isn't necessary the same!!!
                //   in order to do this - we'll need to have the type map.
                //   TypeMap.integer.isa()
                //   TypeMap.SSN.isa() => v instanceof SSN ==> this *must* exist.
                //   
                // 
                this.foo = options.foo;
                this.bar = options.bar || new Date();
            }
            __decorate([
                D.Property({
                    type: 'string'
                }),
                __metadata("design:type", String)
            ], Foo.prototype, "foo", void 0);
            __decorate([
                D.Property({
                    type: 'string',
                    format: 'date-time',
                    $optional: true
                }),
                __metadata("design:type", Date)
            ], Foo.prototype, "bar", void 0);
            return Foo;
        }());
        var foo = new Foo({ foo: 'test', bar: new Date() });
        console.log('****** canUseDecorator', foo.toJSON());
        var bar = Foo.fromJSON({ foo: 'hello', bar: '2017-01-01T00:00:01Z' });
        console.log('********** from JSON', util.inspect(bar, { colors: true, depth: 1000 }));
        var bar2 = Foo.fromJSON({ foo: 'hello' });
        console.log('********** from JSON', util.inspect(bar2, { colors: true, depth: 1000 }));
        test_util_1.throws(function () {
            var bar = Foo.fromJSON({});
            console.info('!!!!!!!!! should not see this!!!', bar);
        });
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
    __decorate([
        test_util_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ObjectSchemaTest.prototype, "canUseDecorator", null);
    ObjectSchemaTest = __decorate([
        test_util_1.suite
    ], ObjectSchemaTest);
    return ObjectSchemaTest;
}());
//# sourceMappingURL=object.js.map