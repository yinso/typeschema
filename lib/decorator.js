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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var S = require("./schema");
var B = require("./builder");
var V = require("./value-object");
var O = require("./object");
/*
: {
    new (...args: any[]): {};
    prototype: any;
} & T
*/
function attachClassSchema(Clazz, schema) {
    S.attachSchema(Clazz, schema);
    Clazz.fromJSON = function (value) {
        console.info('***** clazz level fromJSON', value);
        return schema.fromJSON(value);
    };
    Clazz.prototype.toJSON = function () {
        console.info('***** object level toJSON', this);
        return schema.jsonify(this);
    };
    return Clazz;
}
function Schema(options) {
    return function (Clazz) {
        console.info('Schema.maker', Clazz, options);
        return attachClassSchema(Clazz, B.makeSchema(__assign({}, options, { $make: function (value) { return new Clazz(value); } })));
    };
}
exports.Schema = Schema;
function IntegerSchema(options) {
    return function (Clazz) {
        return S.attachSchema(Clazz, B.makeSchema(__assign({ type: 'integer' }, options)));
    };
}
exports.IntegerSchema = IntegerSchema;
function NumberSchema(options) {
    return function (Clazz) {
        return S.attachSchema(Clazz, B.makeSchema(__assign({ type: 'number' }, options)));
    };
}
exports.NumberSchema = NumberSchema;
function BooleanSchema(options) {
    return function (Clazz) {
        return S.attachSchema(Clazz, B.makeSchema(__assign({ type: 'boolean' }, options)));
    };
}
exports.BooleanSchema = BooleanSchema;
function NullSchema() {
    return function (Clazz) {
        return S.attachSchema(Clazz, B.makeSchema({ type: 'null' }));
    };
}
exports.NullSchema = NullSchema;
function StringSchema(options) {
    return function (Clazz) {
        return S.attachSchema(Clazz, B.makeSchema(__assign({ type: 'string' }, options)));
    };
}
exports.StringSchema = StringSchema;
function ArraySchema(options) {
    return function (Clazz) {
        return S.attachSchema(Clazz, B.makeSchema(__assign({ type: 'array' }, options)));
    };
}
exports.ArraySchema = ArraySchema;
function ObjectSchema(options) {
    return function (Clazz) {
        return S.attachSchema(Clazz, B.makeSchema(__assign({ type: 'object' }, options)));
    };
}
exports.ObjectSchema = ObjectSchema;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  PROPERTY-LEVEL Decorators.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addProperty(target, key, options, ctor) {
    var constructor = target.constructor;
    var schema = S.hasAttachedSchema(constructor);
    if (!schema) {
        schema = new O.ObjectSchema();
        attachClassSchema(constructor, schema);
    }
    var propSchema = S.getSchema(ctor);
    if (!S.isJsonSchema(options)) {
        schema.setProperty(key, propSchema, options.$optional ? !options.$optional : true);
    }
    propSchema['$ctor'] = ctor;
}
exports.addProperty = addProperty;
// this is for special case of dealing with Null types...
var _Null = (function (_super) {
    __extends(_Null, _super);
    function _Null() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    _Null = __decorate([
        NullSchema()
    ], _Null);
    return _Null;
}(V.ValueObject));
function makeValueObject(options) {
    var schema = B.makeValueSchema(options);
    var Clazz = (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.getSchema = function () {
            return schema;
        };
        class_1.isa = function (value) {
            return value instanceof Clazz;
        };
        class_1.fromJSON = function (value) {
            return schema.fromJSON(value);
        };
        class_1.prototype._validate = function (value) {
            var errors = [];
            schema.validate(value, '$', errors);
            if (errors.length > 0) {
                throw new S.ValidationException(errors);
            }
        };
        return class_1;
    }(V.ValueObject));
    S.attachSchema(Clazz, schema);
    return Clazz;
}
exports.makeValueObject = makeValueObject;
// decorator function
function Property(options) {
    return function (target, key) {
        var ctor = Reflect.getMetadata('design:type', target, key);
        if (ctor === Object) {
            // this is a complex type - in such case we need the inform the user...
            console.warn('Complex type - be sure to add $ctors check');
        }
        addProperty(target, key, options, ctor || _Null); // ctor is undefined for null type.
    };
}
exports.Property = Property;
// do we want the type to have their own JSON capability? by default the answer should be yes but 
// that's 
// converting the 
function toJSON(ctor, data) {
    return data;
}
exports.toJSON = toJSON;
//# sourceMappingURL=decorator.js.map