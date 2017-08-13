"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var S = require("./schema");
var N = require("./number");
var I = require("./integer");
var T = require("./string");
var A = require("./array");
var O = require("./object");
var U = require("./null");
var B = require("./boolean");
var AO = require("./any-of");
function isIntegerDefinition(data) {
    return data.hasOwnProperty('type') && data['type'] === 'integer';
}
function isNullDefinition(data) {
    return data.hasOwnProperty('type') && data['type'] === 'null';
}
function isNumberDefinition(data) {
    return data.hasOwnProperty('type') && data['type'] === 'number';
}
function isBooleanDefinition(data) {
    return data.hasOwnProperty('type') && data['type'] === 'boolean';
}
function isStringDefinition(data) {
    return data.hasOwnProperty('type') && data['type'] === 'string';
}
function isArrayDefinition(data) {
    return data.hasOwnProperty('type') && data['type'] === 'array';
}
function isObjectDefinition(data) {
    return data.hasOwnProperty('type') && data['type'] === 'object';
}
function isAnyOfDefinition(data) {
    return data.hasOwnProperty('anyOf');
}
function isEnumOnlyDefinition(data) {
    return data.hasOwnProperty('enum') && !data.hasOwnProperty('type');
}
function makeSchema(data) {
    if (isAnyOfDefinition(data)) {
        return new AO.AnyOfSchema(data.anyOf.map(makeSchema));
    }
    else if (isIntegerDefinition(data)) {
        return makeIntegerSchema(data);
    }
    else if (isNullDefinition(data)) {
        return makeNullSchema(data);
    }
    else if (isNumberDefinition(data)) {
        return makeNumberSchema(data);
    }
    else if (isBooleanDefinition(data)) {
        return makeBooleanSchema(data);
    }
    else if (isStringDefinition(data)) {
        return makeStringSchema(data);
    }
    else if (isArrayDefinition(data)) {
        return makeArraySchema(data);
    }
    else if (isObjectDefinition(data)) {
        return makeObjectSchema(data);
    }
    else if (isEnumOnlyDefinition(data)) {
        return makeEnumSchema(data);
    }
    else {
        throw new Error("Invaild Json Schema");
    }
}
exports.makeSchema = makeSchema;
function makeEnumSchema(data) {
    return new S.EnumConstraint(data.enum);
}
function makeNumberSchema(data) {
    var options = {};
    if (data.enum) {
        options.enum = new S.EnumConstraint(data.enum);
    }
    if (data.multipleOf) {
        options.multipleOf = new N.MultipleOfConstraint(data.multipleOf);
    }
    if (data.minimum) {
        options.minimum = new N.MinimumConstraint(data.minimum, data.exclusiveMinimum || false);
    }
    if (data.maximum) {
        options.maximum = new N.MaximumConstraint(data.maximum, data.exclusiveMaximum || false);
    }
    return new N.NumberSchema(options);
}
function makeIntegerSchema(data) {
    var options = {};
    if (data.enum) {
        options.enum = new S.EnumConstraint(data.enum);
    }
    if (data.multipleOf) {
        options.multipleOf = new N.MultipleOfConstraint(data.multipleOf);
    }
    if (data.minimum) {
        options.minimum = new N.MinimumConstraint(data.minimum, data.exclusiveMinimum || false);
    }
    if (data.maximum) {
        options.maximum = new N.MaximumConstraint(data.maximum, data.exclusiveMaximum || false);
    }
    return new I.IntegerSchema(options);
}
function makeNullSchema(data) {
    return new U.NullSchema();
}
function makeBooleanSchema(data) {
    var options = {};
    if (data.enum) {
        options.enum = new S.EnumConstraint(data.enum);
    }
    return new B.BooleanSchema(options);
}
function makeStringSchema(data) {
    var options = {};
    if (data.enum) {
        options.enum = new S.EnumConstraint(data.enum);
    }
    if (data.minLength) {
        options.minLength = new T.MinLength(data.minLength);
    }
    if (data.maxLength) {
        options.maxLength = new T.MaxLength(data.maxLength);
    }
    if (data.pattern) {
        options.pattern = new T.Pattern(data.pattern);
    }
    if (data.format) {
        options.format = new T.Format(data.format);
    }
    return new T.StringSchema(options);
}
function makeArraySchema(data) {
    var options = {};
    if (data.enum) {
        options.enum = new S.EnumConstraint(data.enum);
    }
    if (data.items) {
        options.items = new A.ItemsConstraint(makeSchema(data.items));
    }
    if (data.minItems) {
        options.minItems = new T.MinLength(data.minItems);
    }
    if (data.maxItems) {
        options.maxItems = new T.MaxLength(data.maxItems);
    }
    return new A.ArraySchema(options);
}
function makeObjectSchema(data) {
    var options = {};
    if (data.enum) {
        options.enum = new S.EnumConstraint(data.enum);
    }
    if (data.properties) {
        options.properties = makePropertySchemas(data.properties);
    }
    if (data.required) {
        options.required = new O.RequiredConstraint(data.required);
    }
    return new O.ObjectSchema(options);
}
function makePropertySchemas(props) {
    var schemaMap = {};
    for (var key in props) {
        if (props.hasOwnProperty(key)) {
            schemaMap[key] = makeSchema(props[key]);
        }
    }
    return new O.PropertiesConstraint(schemaMap);
}
//# sourceMappingURL=builder.js.map