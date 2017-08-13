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
var SCHEMA_FIELD = '__schema';
// there are a few things to do in order to construct the right schema tree.
// 1 - every Ctor will have a __schema field
// 2 - the first call will create it.
// 3 - there will be decorators that will be used to generate the __schema field and populate it with information.
// 4 - due to the complexity of the information, there needs to be a way to make sense of it all
// @Schema is a top level
function attachSchema(constructor, schema) {
    if (!constructor.hasOwnProperty(SCHEMA_FIELD)) {
        Object.defineProperty(constructor, SCHEMA_FIELD, {
            value: schema,
            enumerable: true,
            configurable: false,
            writable: false
        });
    }
    return constructor;
}
exports.attachSchema = attachSchema;
function getAttachedSchema(constructor) {
    var prop = Object.getOwnPropertyDescriptor(constructor, SCHEMA_FIELD);
    if (prop) {
        return prop.value;
    }
    else {
        throw new Error("NoSchemaDefined");
    }
}
function getSchema(ctor) {
    if (ctor === String) {
        return B.makeSchema({ type: 'string' });
    }
    else if (ctor === Boolean) {
        return B.makeSchema({ type: 'boolean' });
    }
    else if (ctor === Date) {
        return B.makeSchema({ type: 'string', format: 'date-time' });
    }
    else if (ctor === Number) {
        return B.makeSchema({ type: 'number' });
    }
    else {
        return getAttachedSchema(ctor);
    }
}
exports.getSchema = getSchema;
function addProperty(target, key, options, ctor) {
    var constructor = target.constructor;
    attachSchema(constructor, B.makeSchema({
        type: 'object',
        properties: {},
        required: []
    }));
    var schema = getAttachedSchema(constructor);
    var propSchema = getSchema(ctor);
    schema.setProperty(key, propSchema, options.required ? true : false);
    propSchema['$ctor'] = ctor;
}
exports.addProperty = addProperty;
function isOptional(options) {
    return options.optional === true;
}
// this is the decorator function.
function Schema(options) {
    return function (Clazz) {
        return attachSchema(Clazz, B.makeSchema(options));
    };
}
exports.Schema = Schema;
function IntegerSchema(options) {
    return function (Clazz) {
        return attachSchema(Clazz, B.makeSchema(__assign({ type: 'integer' }, options)));
    };
}
exports.IntegerSchema = IntegerSchema;
function NumberSchema(options) {
    return function (Clazz) {
        return attachSchema(Clazz, B.makeSchema(__assign({ type: 'number' }, options)));
    };
}
exports.NumberSchema = NumberSchema;
function BooleanSchema(options) {
    return function (Clazz) {
        return attachSchema(Clazz, B.makeSchema(__assign({ type: 'boolean' }, options)));
    };
}
exports.BooleanSchema = BooleanSchema;
function NullSchema() {
    return function (Clazz) {
        return attachSchema(Clazz, B.makeSchema({ type: 'null' }));
    };
}
exports.NullSchema = NullSchema;
function StringSchema(options) {
    return function (Clazz) {
        return attachSchema(Clazz, B.makeSchema(__assign({ type: 'string' }, options)));
    };
}
exports.StringSchema = StringSchema;
function ArraySchema(options) {
    return function (Clazz) {
        return attachSchema(Clazz, B.makeSchema(__assign({ type: 'array' }, options)));
    };
}
exports.ArraySchema = ArraySchema;
function ObjectSchema(options) {
    return function (Clazz) {
        return attachSchema(Clazz, B.makeSchema(__assign({ type: 'object' }, options)));
    };
}
exports.ObjectSchema = ObjectSchema;
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
function fromJSON(ctor, data) {
    var schema = getSchema(ctor);
    var result = S.validate(schema, data);
    if (result.errors.length > 0) {
        throw new S.ValidationException(result.errors);
    }
    else {
        return schema.fromJSON(data);
    }
}
exports.fromJSON = fromJSON;
//# sourceMappingURL=decorator.js.map