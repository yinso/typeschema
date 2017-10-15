"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var T = require("./ast");
var Promise = require("bluebird");
var glob = require("glob");
function globAsync(pattern) {
    return new Promise(function (resolve, reject) {
        glob(pattern, function (err, matches) {
            if (err) {
                reject(err);
            }
            else {
                resolve(matches);
            }
        });
    });
}
var ValueTypePrinter = /** @class */ (function () {
    function ValueTypePrinter(decl) {
        this.decl = decl;
    }
    ValueTypePrinter.prototype.render = function () {
        return this.renderDeclaration(this.decl.typeName, this.decl.typeExp);
    };
    ValueTypePrinter.prototype.renderDeclaration = function (name, type) {
        return "\n    export class " + name + " {\n      private readonly _v : " + type.type + ";\n      constructor(v : " + type.type + ") {\n        this._v = v;\n      }\n\n      static fromJSON(v : any) : " + name + " {\n        let res = validate(v);\n        if (res.hasErrors()) {\n          throw res;\n        }\n        return new " + name + "(v);\n      }\n\n      static validate(v : any, path : string = '$') : ValidationResult {\n        let res = new ValidationResult();\n        if (!typeof(v) === '" + type.type + "') {\n          res.push({\n            error: 'Not a " + type.type + "',\n            path : path\n          });\n        }\n        return res;\n      }\n\n      valueOf() : " + type.type + " {\n        return this._v;\n      }\n\n      toString() {\n        return this._v;\n      }\n\n      toJSON() : any {\n        return this._v;\n      }\n    }\n    ";
    };
    return ValueTypePrinter;
}());
var ObjectConstructorOptionsPrinter = /** @class */ (function () {
    function ObjectConstructorOptionsPrinter(keyvals) {
        this.keyvals = keyvals;
    }
    ObjectConstructorOptionsPrinter.prototype.render = function () {
        return "{" + this._renderObjectTypeConstructorKeyVals(this.keyvals) + "}";
    };
    ObjectConstructorOptionsPrinter.prototype._renderObjectTypeConstructorKeyVals = function (keyvals) {
        var _this = this;
        return keyvals.map(function (keyval) { return _this._renderObjectTypeConstructorKeyVal(keyval); }).join(', ');
    };
    ObjectConstructorOptionsPrinter.prototype._renderObjectTypeConstructorKeyVal = function (keyval) {
        return keyval.key + " " + this.renderOptionality(keyval) + " " + this.renderTypeDefinition(keyval.val);
    };
    ObjectConstructorOptionsPrinter.prototype.renderOptionality = function (keyval) {
        return keyval.required ? ':' : '?:';
    };
    ObjectConstructorOptionsPrinter.prototype.renderTypeDefinition = function (type) {
        var printer = new TypeScriptPrinter();
        return printer.renderTypeDefinition(type);
    };
    return ObjectConstructorOptionsPrinter;
}());
var ObjectConstructorAssignmentPrinter = /** @class */ (function () {
    function ObjectConstructorAssignmentPrinter(keyvals) {
        this.keyvals = keyvals;
    }
    ObjectConstructorAssignmentPrinter.prototype.render = function () {
        var _this = this;
        return this.keyvals.map(function (kv) { return _this.renderPropertyAssignment(kv); }).join("\n");
    };
    ObjectConstructorAssignmentPrinter.prototype.renderPropertyAssignment = function (kv) {
        if (kv.required) {
            return "\n      if (!v." + kv.key + ") {\n        throw new Error(\"RequiredField: " + kv.key + "\");\n      } else {\n        this." + kv.key + " = v." + kv.key + ";\n      }\n      ";
        }
        else {
            return "\n      if (v." + kv.key + ") {\n        this." + kv.key + " = v." + kv.key + ";\n      }\n      ";
        }
    };
    return ObjectConstructorAssignmentPrinter;
}());
var ObjectPropertyDeclarationPrinter = /** @class */ (function () {
    function ObjectPropertyDeclarationPrinter(keyval) {
        this.keyval = keyval;
    }
    ObjectPropertyDeclarationPrinter.prototype.render = function () {
        var keyval = this.keyval;
        return "\n    readonly " + keyval.key + " " + this.renderOptionality(keyval) + " " + this.renderTypeDefinition(keyval.val) + ";\n    ";
    };
    ObjectPropertyDeclarationPrinter.prototype.renderOptionality = function (keyval) {
        return keyval.required ? ':' : '?:';
    };
    ObjectPropertyDeclarationPrinter.prototype.renderTypeDefinition = function (type) {
        var printer = new TypeScriptPrinter();
        return printer.renderTypeDefinition(type);
    };
    return ObjectPropertyDeclarationPrinter;
}());
var ObjectTypePrinter = /** @class */ (function () {
    function ObjectTypePrinter(decl) {
        this.decl = decl;
    }
    ObjectTypePrinter.prototype.render = function () {
        return this.renderDeclaration(this.decl.typeName, this.decl.typeExp);
    };
    ObjectTypePrinter.prototype.renderDeclaration = function (name, type) {
        return "\n    export class " + name + " {\n      " + this.renderPropertyDeclarations(type.keyvals) + "\n      constructor( v: " + this.renderConstructorOptions(type) + ") {\n        if (!(v instanceof Object)) {\n          throw new Error(\"InvalidParameter: must be object\");\n        }\n        " + this.renderConstructorAssignment(type) + "\n      }\n\n      // validate is meant to validate the **JSON*** values of the structure...\n      static validateJSON(v : any) : ValidationResult {\n        let res = new ValidationResult();\n        if (!(v instanceof Object)) {\n          // add the basic structure information... v must be an object.\n        }\n        return res;\n      }\n\n      static fromJSON(v : any) : " + name + " {\n        if (!(v instanceof Object)) {\n          throw new Error('Not an object');\n        }\n        throw new Error('Not yet implemented');\n      }\n\n      toJSON() : any {\n        return this;\n      }\n    }";
    };
    ObjectTypePrinter.prototype.renderPropertyDeclarations = function (keyvals) {
        return keyvals.map(function (keyval) {
            var printer = new ObjectPropertyDeclarationPrinter(keyval);
            return printer.render();
        }).join('');
    };
    ObjectTypePrinter.prototype.renderConstructorOptions = function (type) {
        var printer = new ObjectConstructorOptionsPrinter(type.keyvals);
        return printer.render();
    };
    ObjectTypePrinter.prototype.renderConstructorAssignment = function (type) {
        var printer = new ObjectConstructorAssignmentPrinter(type.keyvals);
        return printer.render();
    };
    return ObjectTypePrinter;
}());
var TypeScriptPrinter = /** @class */ (function () {
    function TypeScriptPrinter() {
    }
    TypeScriptPrinter.prototype.loadTemplates = function () {
        return Promise.resolve();
    };
    TypeScriptPrinter.prototype.render = function (map) {
        var _this = this;
        var decls = map.getDeclarations();
        return decls.map(function (decl) { return _this.renderDeclaration(decl); }).join("\n");
    };
    TypeScriptPrinter.prototype.renderDeclaration = function (decl) {
        if (decl.typeExp instanceof T.StringType) {
            var printer = new ValueTypePrinter(decl);
            return printer.render();
        }
        else {
            var printer = new ObjectTypePrinter(decl);
            return printer.render();
        }
    };
    TypeScriptPrinter.prototype.renderTypeDefinition = function (type) {
        if (type instanceof T.StringType) {
            return "string";
        }
        else if (type instanceof T.ObjectType) {
            return this.renderObjectTypeDefinition(type);
        }
        else if (type instanceof T.RefType) {
            return this.renderRefType(type);
        }
        else {
            throw new Error("Unknown type!: " + JSON.stringify(type.toSchema(), null, 2));
        }
    };
    TypeScriptPrinter.prototype.renderRefType = function (type) {
        return type.ref;
    };
    TypeScriptPrinter.prototype.renderObjectTypeDefinition = function (type) {
        var printer = new ObjectConstructorOptionsPrinter(type.keyvals);
        return printer.render();
    };
    return TypeScriptPrinter;
}());
exports.TypeScriptPrinter = TypeScriptPrinter;
//# sourceMappingURL=typescript.js.map