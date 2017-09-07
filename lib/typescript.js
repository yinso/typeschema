"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var T = require("./ast");
var handlebars = require("handlebars");
var Promise = require("bluebird");
var fs = require("fs-extra-promise");
var glob = require("glob");
var path = require("path");
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
var TypeScriptPrinter = (function () {
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
            return this._renderDeclareValueType(decl.typeName, decl.typeExp);
        }
        else {
            return this._renderDeclareObjectType(decl.typeName, decl.typeExp);
        }
    };
    TypeScriptPrinter.prototype._renderDeclareValueType = function (name, type) {
        return "\n    export class " + name + " {\n      private readonly _v : " + type.type + ";\n      constructor(v : " + type.type + ") {\n        this._v = v;\n      }\n\n      static fromJSON(v : any) : " + name + " {\n        let res = validate(v);\n        if (res.hasErrors()) {\n          throw res;\n        }\n        return new " + name + "(v);\n      }\n\n      static validate(v : any, path : string = '$') : ValidationResult {\n        let res = new ValidationResult();\n        if (!typeof(v) === '" + type.type + "') {\n          res.push({\n            error: 'Not a " + type.type + "',\n            path : path\n          });\n        }\n        return res;\n      }\n\n      valueOf() : " + type.type + " {\n        return this._v;\n      }\n\n      toString() {\n        return this._v;\n      }\n\n      toJSON() : any {\n        return this._v;\n      }\n    }\n    ";
    };
    TypeScriptPrinter.prototype._renderDeclareObjectType = function (name, type) {
        return "\n    export class " + name + " {\n      " + this._renderObjectTypePropertyDeclarations(type.keyvals) + "\n      constructor( v: " + this._renderObjectTypeConstructorOptions(type) + ") {\n        " + this._renderObjectTypeConstructorAssignment(type) + ";\n      }\n\n      // validate is meant to validate the **JSON*** values of the structure...\n      static validateJSON(v : any) : ValidationResult {\n        let res = new ValidationResult();\n        retun res;\n      }\n\n      static fromJSON(v : any) : " + name + " {\n        if (!(v instanceof Object)) {\n          throw new ERror('Not an object');\n        }\n        throw new Error('Not yet implemented');\n      }\n\n      toJSON() : any {\n        return this;\n      }\n    }";
    };
    TypeScriptPrinter.prototype._renderObjectTypeConstructorOptions = function (type) {
        return "{" + this._renderObjectTypeConstructorKeyVals(type.keyvals) + "}";
    };
    TypeScriptPrinter.prototype._renderObjectTypeConstructorKeyVals = function (keyvals) {
        var _this = this;
        return keyvals.map(function (keyval) { return _this._renderObjectTypeConstructorKeyVal(keyval); }).join(', ');
    };
    TypeScriptPrinter.prototype._renderObjectTypeConstructorKeyVal = function (keyval) {
        return keyval.key + " " + this._renderKeyValOptionality(keyval) + " " + this._renderTypeDefinition(keyval.val);
    };
    TypeScriptPrinter.prototype._renderObjectTypeConstructorAssignment = function (type) {
        var _this = this;
        return type.keyvals.map(function (kv) { return _this._renderObjectTypeConstructorPropertyAssignment(kv); }).join("\n");
    };
    TypeScriptPrinter.prototype._renderObjectTypeConstructorPropertyAssignment = function (kv) {
        return "\n    this." + kv.key + " = v." + kv.key + ";";
    };
    TypeScriptPrinter.prototype._renderObjectTypePropertyDeclarations = function (keyvals) {
        var _this = this;
        return keyvals.map(function (keyval) {
            return _this._renderObjectTypePropertyDeclaration(keyval);
        }).join('');
    };
    TypeScriptPrinter.prototype._renderTypeDefinition = function (type) {
        if (type instanceof T.StringType) {
            return "string";
        }
        else if (type instanceof T.ObjectType) {
            return this._renderObjectTypeDefinition(type);
        }
        else if (type instanceof T.RefType) {
            return this._renderRefType(type);
        }
        else {
            throw new Error("Unknown type!: " + JSON.stringify(type.toSchema(), null, 2));
        }
    };
    TypeScriptPrinter.prototype._renderRefType = function (type) {
        return type.ref;
    };
    TypeScriptPrinter.prototype._renderObjectTypeDefinition = function (type) {
        return "{\n      " + this._renderObjectTypePropertyDeclarations(type.keyvals) + "\n    }";
    };
    TypeScriptPrinter.prototype._renderKeyValOptionality = function (keyval) {
        return keyval.required ? '?:' : ':';
    };
    TypeScriptPrinter.prototype._renderObjectTypePropertyDeclaration = function (keyval) {
        return "\n    readonly " + keyval.key + " " + this._renderKeyValOptionality(keyval) + " " + this._renderTypeDefinition(keyval.val) + ";\n    ";
    };
    return TypeScriptPrinter;
}());
exports.TypeScriptPrinter = TypeScriptPrinter;
var TypeScriptPrinter2 = (function () {
    function TypeScriptPrinter2() {
        // let's 
        this._handlebars = handlebars.create();
        this._handlebars.registerHelper('declare-partial', this.typeDeclarePartial);
        this._handlebars.registerHelper('to-schema', this.typeToSchema);
        this._handlebars.registerHelper('constraint-isa', this.constraintIsa);
        this._handlebars.registerHelper('ctor-param', this._constructorParameters);
    }
    TypeScriptPrinter2.prototype.typeDeclarePartial = function (typeExp) {
        if (typeExp instanceof T.StringType) {
            return 'value-type';
        }
        else {
            return 'object-type';
        }
    };
    TypeScriptPrinter2.prototype.constraintIsa = function (constraint) {
        console.info('***** Constraint.isa', constraint);
        if (constraint instanceof T.Pattern) {
            return 'value-type-pattern';
        }
        else if (constraint instanceof T.MinLength) {
            return 'value-type-minLength';
        }
        else if (constraint instanceof T.MaxLength) {
            return 'value-type-maxLength';
        }
        else {
            throw new Error("Unknown constraint type: " + constraint);
        }
    };
    TypeScriptPrinter2.prototype._constructorParameters = function (typeExp) {
        if (typeExp instanceof T.StringType) {
            return 'ctor-param-string';
        }
        else {
            return 'ctor-param-object';
        }
    };
    TypeScriptPrinter2.prototype.typeToSchema = function (typeExp) {
        return JSON.stringify(typeExp.toSchema(), null, 2);
    };
    TypeScriptPrinter2.prototype.loadTemplates = function () {
        var _this = this;
        return globAsync(path.join(__dirname, '..', 'templates', 'typescript', '**/*.hbs'))
            .then(function (paths) {
            return Promise.map(paths, function (filePath) {
                return fs.readFileAsync(filePath, 'utf8')
                    .then(function (data) {
                    var partialName = path.basename(filePath, path.extname(filePath));
                    var template = _this._handlebars.compile(data);
                    _this._handlebars.registerPartial(partialName, template);
                });
            });
        });
    };
    TypeScriptPrinter2.prototype.render = function (decl) {
        var template = this._handlebars.partials['type-declaration'];
        if (typeof (template) == 'function') {
            return template(decl);
        }
        else {
            throw new Error("Unknown Template: type-declaration: " + template);
        }
    };
    return TypeScriptPrinter2;
}());
//# sourceMappingURL=typescript.js.map