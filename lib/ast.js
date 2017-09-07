"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
function regexEqual(x, y) {
    return (x instanceof RegExp) && (y instanceof RegExp) &&
        (x.source === y.source) && (x.global === y.global) &&
        (x.ignoreCase === y.ignoreCase) && (x.multiline === y.multiline);
}
var Pattern = (function () {
    function Pattern(regex) {
        this.regexp = regex;
        this.name = 'pattern';
    }
    Pattern.prototype.equals = function (v) {
        console.log('Pattern.equals', (v instanceof Pattern), v.regexp, this.regexp);
        return (v instanceof Pattern) && regexEqual(v.regexp, this.regexp);
    };
    Pattern.prototype.toSchema = function () {
        return {
            pattern: this.regexp.source
        };
    };
    return Pattern;
}());
exports.Pattern = Pattern;
var MinLength = (function () {
    function MinLength(minLength) {
        this.minLength = minLength;
        this.name = 'minLength';
    }
    MinLength.prototype.equals = function (v) {
        return (v instanceof MinLength) && v.minLength === this.minLength;
    };
    MinLength.prototype.toSchema = function () {
        return {
            minLength: this.minLength
        };
    };
    return MinLength;
}());
exports.MinLength = MinLength;
var MaxLength = (function () {
    function MaxLength(maxLength) {
        this.maxLength = maxLength;
        this.name = 'maxLength';
    }
    MaxLength.prototype.equals = function (v) {
        return (v instanceof MaxLength) && v.maxLength === this.maxLength;
    };
    MaxLength.prototype.toSchema = function () {
        return {
            maxLength: this.maxLength
        };
    };
    return MaxLength;
}());
exports.MaxLength = MaxLength;
var RefType = (function () {
    function RefType(ref) {
        this.type = '$ref';
        this.ref = ref;
    }
    RefType.prototype.toSchema = function () {
        return {
            $ref: this.ref
        };
    };
    RefType.prototype.equals = function (v) {
        return (v instanceof RefType) && v.ref === this.ref;
    };
    return RefType;
}());
exports.RefType = RefType;
var StringType = (function () {
    function StringType(constraints) {
        if (constraints === void 0) { constraints = []; }
        this.type = 'string';
        this.constraints = constraints.concat().sort(function (a, b) { return a.name.localeCompare(b.name); });
    }
    StringType.prototype.equals = function (v) {
        return (v instanceof StringType) && this._constraintEquals(v.constraints || []);
    };
    StringType.prototype._constraintEquals = function (constraints) {
        if (this.constraints.length !== constraints.length)
            return false;
        for (var i = 0; i < this.constraints.length; ++i) {
            // what about orders??? assume sorted.
            if (!this.constraints[i].equals(constraints[i])) {
                return false;
            }
        }
        return true;
    };
    StringType.prototype.toSchema = function () {
        return util.extend.apply(util, [{ type: 'string' }].concat(this.constraints.map(function (c) { return c.toSchema(); })));
    };
    return StringType;
}());
exports.StringType = StringType;
var ObjectTypeKeyVal = (function () {
    function ObjectTypeKeyVal(key, val, required) {
        this.key = key;
        this.val = val;
        this.required = required;
    }
    ObjectTypeKeyVal.prototype.equals = function (v) {
        if (!(v instanceof ObjectTypeKeyVal))
            return false;
        if (v.key !== this.key)
            return false;
        if (v.required != this.required)
            return false;
        return this.val.equals(v.val);
    };
    return ObjectTypeKeyVal;
}());
exports.ObjectTypeKeyVal = ObjectTypeKeyVal;
var ObjectType = (function () {
    function ObjectType(keyvals) {
        if (keyvals === void 0) { keyvals = []; }
        this.type = 'object';
        this.keyvals = keyvals;
    }
    ObjectType.prototype.equals = function (v) {
        return (v instanceof ObjectType) && this.keyValsEquals(v);
    };
    ObjectType.prototype.keyValsEquals = function (v) {
        if (v.keyvals.length !== this.keyvals.length)
            return false;
        // get sorted keys...
        var sorted = this.sortedKeyVals;
        var vSorted = v.sortedKeyVals;
        for (var i = 0; i < sorted.length; ++i) {
            if (!sorted[i].equals(vSorted[i]))
                return false;
        }
        return true;
    };
    Object.defineProperty(ObjectType.prototype, "sortedKeyVals", {
        get: function () {
            return this.keyvals.concat().sort(function (a, b) { return a.key.localeCompare(b.key); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectType.prototype, "required", {
        get: function () {
            var result = [];
            this.keyvals.forEach(function (kv) {
                if (kv.required) {
                    result.push(kv.key);
                }
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectType.prototype, "properties", {
        get: function () {
            var result = {};
            this.keyvals.forEach(function (kv) {
                result[kv.key] = kv.val.toSchema();
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    ObjectType.prototype.toSchema = function () {
        return {
            type: 'object',
            required: this.required,
            properties: this.properties
        };
    };
    return ObjectType;
}());
exports.ObjectType = ObjectType;
var TypeDeclaration = (function () {
    function TypeDeclaration(typeName, typeExp) {
        this.typeName = typeName;
        this.typeExp = typeExp;
    }
    TypeDeclaration.prototype.equals = function (v) {
        console.log('TypeDeclaration.equals', (v instanceof TypeDeclaration), v.typeName === this.typeName, this.typeExp.equals(v.typeExp));
        return (v instanceof TypeDeclaration) && v.typeName === this.typeName && this.typeExp.equals(v.typeExp);
    };
    return TypeDeclaration;
}());
exports.TypeDeclaration = TypeDeclaration;
var TypeMap = (function () {
    function TypeMap() {
        this._map = new Map();
    }
    TypeMap.prototype.declare = function (name, type) {
        if (this.has(name)) {
            throw new Error("Duplicate type name: " + name);
        }
        this._map.set(name, type);
    };
    TypeMap.prototype.has = function (name) {
        return this._map.has(name);
    };
    TypeMap.prototype.get = function (name) {
        var res = this._map.get(name);
        if (!res)
            throw new Error("Unknown type name: " + name);
        return res;
    };
    TypeMap.prototype.getDecl = function (name) {
        return new TypeDeclaration(name, this.get(name));
    };
    TypeMap.prototype.getDeclarations = function () {
        var res = [];
        this._map.forEach(function (type, name) {
            res.push(new TypeDeclaration(name, type));
        });
        return res;
    };
    Object.defineProperty(TypeMap.prototype, "length", {
        get: function () {
            return this._map.size;
        },
        enumerable: true,
        configurable: true
    });
    return TypeMap;
}());
exports.TypeMap = TypeMap;
//# sourceMappingURL=ast.js.map