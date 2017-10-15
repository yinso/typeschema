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
var StringTypePrinter = /** @class */ (function () {
    function StringTypePrinter(decl) {
        this.name = decl.typeName;
        this.exp = decl.typeExp;
    }
    StringTypePrinter.prototype.render = function () {
        return this.renderDeclaration();
    };
    StringTypePrinter.prototype.renderIsBaseJson = function (param) {
        return "typeof(" + param + ") === '" + this.exp.type + "'";
    };
    StringTypePrinter.prototype.renderCallIsBaseJson = function (param) {
        if (this.exp.isPlainType()) {
            return this.renderIsBaseJson(param);
        }
        else {
            return this.name + ".isJSON(" + param + ")";
        }
    };
    StringTypePrinter.prototype.renderValidateJson = function (param, pathParam, errParam) {
        return "\n    if (!" + this.renderIsBaseJson(param) + ") {\n      " + errParam + ".push({\n        error: 'Not a " + this.exp.type + "',\n        value: " + param + ",\n        path : " + pathParam + "\n      });\n    }";
    };
    StringTypePrinter.prototype.renderCallValidateJson = function (param, pathParam, errParam) {
        if (this.exp.isPlainType()) {
            return this.renderValidateJson(param, pathParam, errParam);
        }
        else {
            return "\n      " + this.name + ".validateJSON(" + param + ", " + pathParam + ", " + errParam + ");\n      ";
        }
    };
    StringTypePrinter.prototype.renderDeclaration = function () {
        var name = this.name;
        var type = this.exp;
        return "\n    export class " + name + " {\n      private readonly _v : " + type.type + ";\n      constructor(v : " + type.type + ") {\n        this._v = v;\n      }\n\n      static fromJSON(v : any) : " + name + " {\n        let res = " + name + ".validateJSON(v);\n        if (res.hasErrors()) {\n          throw res;\n        }\n        return new " + name + "(v);\n      }\n\n      static isJSON(v: any) : boolean {\n        return " + this.renderIsBaseJson('v') + ";\n      }\n\n      static validateJSON(v : any, path : string = '$', err = new ValidationResult()) : ValidationResult {\n        " + this.renderValidateJson('v', 'path', 'err') + "\n        return err;\n      }\n\n      valueOf() : " + type.type + " {\n        return this._v;\n      }\n\n      toString() {\n        return this._v;\n      }\n\n      toJSON() : any {\n        return this._v;\n      }\n    }\n    ";
    };
    return StringTypePrinter;
}());
var ValueTypePrinter = /** @class */ (function () {
    function ValueTypePrinter(decl) {
        this.decl = decl;
    }
    ValueTypePrinter.prototype.render = function () {
        return this.renderDeclaration(this.decl.typeName, this.decl.typeExp);
    };
    ValueTypePrinter.prototype.renderDeclaration = function (name, type) {
        return "\n    export class " + name + " {\n      private readonly _v : " + type.type + ";\n      constructor(v : " + type.type + ") {\n        this._v = v;\n      }\n\n      static fromJSON(v : any) : " + name + " {\n        let res = validate(v);\n        if (res.hasErrors()) {\n          throw res;\n        }\n        return new " + name + "(v);\n      }\n\n      static validate(v : any, path : string = '$', err = new ValidationResult()) : ValidationResult {\n        if (!typeof(v) === '" + type.type + "') {\n          err.push({\n            error: 'Not a " + type.type + "',\n            path : path\n          });\n        }\n        return err;\n      }\n\n      valueOf() : " + type.type + " {\n        return this._v;\n      }\n\n      toString() {\n        return this._v;\n      }\n\n      toJSON() : any {\n        return this._v;\n      }\n    }\n    ";
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
var ObjectValidationJSONPrinter = /** @class */ (function () {
    function ObjectValidationJSONPrinter(keyval) {
        this.keyval = keyval;
    }
    ObjectValidationJSONPrinter.prototype.render = function () {
        var keyval = this.keyval;
        // let's see if 
        return "\n    readonly " + keyval.key + " " + this.renderOptionality(keyval) + " " + this.renderTypeDefinition(keyval.val) + ";\n    ";
    };
    ObjectValidationJSONPrinter.prototype.renderOptionality = function (keyval) {
        return keyval.required ? ':' : '?:';
    };
    ObjectValidationJSONPrinter.prototype.renderTypeDefinition = function (type) {
        var printer = new TypeScriptPrinter();
        return printer.renderTypeDefinition(type);
    };
    return ObjectValidationJSONPrinter;
}());
var ObjectIsJsonPrinter = /** @class */ (function () {
    function ObjectIsJsonPrinter(keyval) {
        this.keyval = keyval;
    }
    ObjectIsJsonPrinter.prototype.render = function () {
        var keyval = this.keyval;
        // let's see if 
        return "\n    readonly " + keyval.key + " " + this.renderOptionality(keyval) + " " + this.renderTypeDefinition(keyval.val) + ";\n    ";
    };
    ObjectIsJsonPrinter.prototype.renderOptionality = function (keyval) {
        return keyval.required ? ':' : '?:';
    };
    ObjectIsJsonPrinter.prototype.renderTypeDefinition = function (type) {
        var printer = new TypeScriptPrinter();
        return printer.renderTypeDefinition(type);
    };
    return ObjectIsJsonPrinter;
}());
var ObjectTypePrinter = /** @class */ (function () {
    function ObjectTypePrinter(decl) {
        this.decl = decl;
        this.name = decl.typeName;
        this.type = decl.typeExp;
    }
    ObjectTypePrinter.prototype.render = function () {
        return this.renderDeclaration(this.decl.typeName, this.decl.typeExp);
    };
    ObjectTypePrinter.prototype.renderIsBaseJson = function (param) {
        return "typeof(" + param + ") === 'object'";
    };
    ObjectTypePrinter.prototype.renderIsJsonKeyVals = function (param) {
        return this.type.keyvals.map(function (kv) {
            var printer = new StringTypePrinter(new T.TypeDeclaration(kv.key, kv.val));
            return "\n      if (" + (kv.required ? '' : param + "." + kv.key + " && ") + "!" + printer.renderCallIsBaseJson(param + '.' + kv.key) + ") { // " + (param + '.' + kv.key) + " is " + (kv.required ? 'required' : 'optional') + "\n        return false;\n      }\n      ";
        }).join('\n');
    };
    ObjectTypePrinter.prototype.renderValidateBaseJson = function (param, pathParam, errorParam) {
        return "\n    if (!(" + param + " instanceof Object)) {\n      " + errorParam + ".push({\n        error: 'Not an Object',\n        value: " + param + ",\n        path: " + (pathParam === '' ? "''" : pathParam) + "\n      });\n    }\n    ";
    };
    ObjectTypePrinter.prototype.renderValidateJsonKeyVals = function (param, pathParam, errorParam) {
        return this.type.keyvals.map(function (kv) {
            var printer = new StringTypePrinter(new T.TypeDeclaration(kv.key, kv.val));
            return "\n      " + (kv.required ? '' : param + "." + kv.key + " && ") + printer.renderCallValidateJson(param + '.' + kv.key, pathParam === '' ? "''" : pathParam + " + '." + kv.key + "'", errorParam) + " // " + (param + '.' + kv.key) + " is " + (kv.required ? 'required' : 'optional') + "\n      ";
        }).join('\n');
    };
    ObjectTypePrinter.prototype.renderDeclaration = function (name, type) {
        return "\n    export class " + name + " {\n      " + this.renderPropertyDeclarations(type.keyvals) + "\n      // constructors expect the values are already of the proper-type.\n      constructor( v: " + this.renderConstructorOptions(type) + ") {\n        if (!(v instanceof Object)) {\n          throw new Error(\"InvalidParameter: must be object\");\n        }\n        " + this.renderConstructorAssignment(type) + "\n      }\n\n      static isJSON(v: any) : boolean {\n        if (!" + this.renderIsBaseJson('v') + ")\n          return false;\n        // add the test for each of the keyvals!!!\n        " + this.renderIsJsonKeyVals('v') + "\n        return true;\n      }\n\n      // validate is meant to validate the **JSON*** values of the structure...\n      static validateJSON(v : any, path = '$', err = new ValidationResult()) : ValidationResult {\n        " + this.renderValidateBaseJson('v', 'path', 'err') + "\n        // add the validation for each of the keyvals!!!\n        " + this.renderValidateJsonKeyVals('v', 'path', 'err') + "\n        return err;\n      }\n\n      // converts the JSON value into the appropriate class.\n      static fromJSON(v : any) : " + name + " {\n        let err = new ValidationResult();\n        " + this.renderValidateBaseJson('v', '', 'err') + "\n        if (err.hasErrors())\n          throw err;\n        let json = {};\n        return new " + name + "(json);\n      }\n\n      toJSON() : any {\n        return this;\n      }\n    }";
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