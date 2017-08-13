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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var ajv = require("ajv");
var S = require("./schema2");
var integer_1 = require("./integer");
exports.Integer = integer_1.Integer;
function test(clazz) {
    console.log('Class constructor', clazz);
    return clazz;
}
exports.test = test;
function Schema(options) {
    return function (Clazz) {
        return S.attachSchema(Clazz, S.makeSchema(options));
    };
}
exports.Schema = Schema;
/*
type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
//*/
var ValueObject = (function () {
    function ValueObject(value) {
        this.__value = this._validate(value);
    }
    ValueObject.prototype._validate = function (value) {
        return validate(this.constructor, value);
    };
    ValueObject.prototype.valueOf = function () {
        return this.__value;
    };
    ValueObject.prototype.toJSON = function () {
        return this.__value;
    };
    return ValueObject;
}());
exports.ValueObject = ValueObject;
// this is for special case of dealing with Null types...
var _Null = (function (_super) {
    __extends(_Null, _super);
    function _Null() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    _Null = __decorate([
        Schema({ type: 'null' })
    ], _Null);
    return _Null;
}(ValueObject));
function Property(options) {
    return function (target, key) {
        var ctor = Reflect.getMetadata('design:type', target, key);
        if (ctor === Object) {
            // this is a complex type - in such case we need the inform the user...
            console.warn('Complex type - be sure to add $ctors check');
        }
        S.addProperty(target, key, options, ctor || _Null); // ctor is undefined for null type.
    };
}
exports.Property = Property;
function validate(Ctor, val) {
    var _ajv = new ajv();
    var schema = S.getSchema(Ctor);
    var result = _ajv.validate(schema, val);
    console.info('validate.result', Ctor, val, schema, result, _ajv.errors);
    if (_ajv.errors) {
        var e = new Error("ValidationError");
        Object.defineProperty(e, 'errors', {
            value: _ajv.errors,
            configurable: false,
            writable: false
        });
        throw e;
    }
    return val;
}
exports.validate = validate;
//# sourceMappingURL=index.js.map