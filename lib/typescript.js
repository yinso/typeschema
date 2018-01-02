"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast = require("./ast");
var pretty_printer_1 = require("./pretty-printer");
var MinLengthConstraintTransformer = /** @class */ (function () {
    function MinLengthConstraintTransformer(constraint, paramName) {
        this.constraint = constraint;
        this.errorName = 'LessThanMinLength';
        this.paramName = paramName;
        this.operator = constraint.inclusive ? '<=' : '<';
    }
    MinLengthConstraintTransformer.prototype.isaTest = function () {
        return ast.binaryExp(this.operator, ast.memberExp(this.paramName, ast.identifier('length')), ast.integerExp(this.constraint.minLength));
    };
    MinLengthConstraintTransformer.prototype.validateTest = function () {
        return ast.ifExp(ast.unaryExp('!', this.isaTest()), ast.funcallExp(ast.memberExp(ast.identifier('err'), ast.identifier('push')), [
            ast.objectExp([
                ast.objectExpKV(ast.identifier('error'), ast.stringExp(this.errorName)),
                ast.objectExpKV(ast.identifier('path'), ast.identifier('path')),
                ast.objectExpKV(ast.identifier('value'), this.paramName)
            ])
        ]));
    };
    return MinLengthConstraintTransformer;
}());
var MaxLengthConstraintTransformer = /** @class */ (function () {
    function MaxLengthConstraintTransformer(constraint, paramName) {
        this.constraint = constraint;
        this.errorName = 'GreaterThanMaxLength';
        this.paramName = paramName;
        this.operator = constraint.inclusive ? '>=' : '>';
    }
    MaxLengthConstraintTransformer.prototype.isaTest = function () {
        return ast.binaryExp(this.operator, ast.memberExp(this.paramName, ast.identifier('length')), ast.integerExp(this.constraint.maxLength));
    };
    MaxLengthConstraintTransformer.prototype.validateTest = function () {
        return ast.ifExp(ast.unaryExp('!', this.isaTest()), ast.funcallExp(ast.memberExp(ast.identifier('err'), ast.identifier('push')), [
            ast.objectExp([
                ast.objectExpKV(ast.identifier('error'), ast.stringExp(this.errorName)),
                ast.objectExpKV(ast.identifier('path'), ast.identifier('path')),
                ast.objectExpKV(ast.identifier('value'), this.paramName)
            ])
        ]));
    };
    return MaxLengthConstraintTransformer;
}());
var PatternConstraintTransformer = /** @class */ (function () {
    function PatternConstraintTransformer(constraint, paramName) {
        this.constraint = constraint;
        this.errorName = 'PatternMismatch';
        this.paramName = paramName;
    }
    PatternConstraintTransformer.prototype._regex = function () {
        return ast.regexExp(this.constraint.pattern, this.constraint.flags);
    };
    PatternConstraintTransformer.prototype.isaTest = function () {
        return ast.funcallExp(ast.memberExp(this._regex(), ast.identifier('test')), [
            this.paramName
        ]);
    };
    PatternConstraintTransformer.prototype.validateTest = function () {
        return ast.ifExp(ast.unaryExp('!', this.isaTest()), ast.funcallExp(ast.memberExp(ast.identifier('err'), ast.identifier('push')), [
            ast.objectExp([
                ast.objectExpKV(ast.identifier('error'), ast.stringExp(this.errorName)),
                ast.objectExpKV(ast.identifier('path'), ast.identifier('path')),
                ast.objectExpKV(ast.identifier('value'), this.paramName)
            ])
        ]));
    };
    return PatternConstraintTransformer;
}());
var ScalarTypeTransformer = /** @class */ (function () {
    function ScalarTypeTransformer(className, _v, innerType, constraints) {
        this.className = className;
        this._v = _v;
        this.innerType = innerType;
        this.arg = ast.identifier('v');
        this.res = ast.identifier('res');
        this.constraints = constraints;
    }
    ScalarTypeTransformer.prototype._inner_ref = function () {
        return ast.memberExp(ast.identifier('this'), this._v);
    };
    ScalarTypeTransformer.prototype._inner = function () {
        return ast.classPropertyDecl(this._v, 'private', 'instance', 'readonly', this.innerType);
    };
    ScalarTypeTransformer.prototype._constructor = function () {
        return ast.methodDecl(ast.identifier('constructor'), 'public', 'instance', 'readonly', [
            ast.parameterDecl(this.arg, this.innerType)
        ], ast.blockExp([
            ast.letExp(this.res, ast.funcallExp(ast.memberExp(this.className, ast.identifier('validate')), [
                this.arg
            ])),
            ast.ifExp(ast.funcallExp(ast.memberExp(this.res, ast.identifier('hasErrors')), []), ast.throwExp(this.res)),
            ast.assignmentExp(this._inner_ref(), this.arg)
        ]));
    };
    ScalarTypeTransformer.prototype._valueOf = function () {
        return ast.methodDecl(ast.identifier('valueOf'), 'public', 'instance', 'readonly', [], ast.blockExp([
            ast.returnExp(this._inner_ref())
        ]), this.innerType);
    };
    ScalarTypeTransformer.prototype._toString = function () {
        return ast.methodDecl(ast.identifier('toString'), 'public', 'instance', 'readonly', [], ast.blockExp([
            ast.returnExp(this._inner_ref())
        ]), ast.scalarTypeExp('string'));
    };
    ScalarTypeTransformer.prototype._toJSON = function () {
        return ast.methodDecl(ast.identifier('toJSON'), 'public', 'instance', 'readonly', [], ast.blockExp([
            ast.returnExp(this._inner_ref())
        ]), ast.refTypeExp(ast.identifier('any')));
    };
    ScalarTypeTransformer.prototype._fromJSON = function () {
        return ast.methodDecl(ast.identifier('fromJSON'), 'public', 'class', 'readonly', [
            ast.parameterDecl(this.arg, ast.refTypeExp(ast.identifier('any')))
        ], ast.blockExp([
            ast.returnExp(ast.newExp(this.className, [this.arg]))
        ]), ast.refTypeExp(this.className));
    };
    ScalarTypeTransformer.prototype._isJSON = function () {
        return ast.methodDecl(ast.identifier('isJSON'), 'public', 'class', 'readonly', [
            ast.parameterDecl(this.arg, ast.refTypeExp(ast.identifier('any')))
        ], ast.blockExp([
            ast.letExp(this.res, ast.funcallExp(ast.memberExp(this.className, ast.identifier('validate')), [
                this.arg
            ])),
            ast.returnExp(ast.unaryExp('!', ast.funcallExp(ast.memberExp(this.res, ast.identifier('hasErrors')), [])))
        ]), ast.scalarTypeExp('boolean'));
    };
    ScalarTypeTransformer.prototype._isBaseJson = function () {
        return ast.binaryExp('==', ast.funcallExp(ast.identifier('typeof'), [this.arg]), ast.stringExp(this.innerType.name));
    };
    ScalarTypeTransformer.prototype._makeConstraintTransformer = function (c) {
        if (ast.isPatternConstraint(c)) {
            return new PatternConstraintTransformer(c, this.arg);
        }
        else if (ast.isMinLengthConstraint(c)) {
            return new MinLengthConstraintTransformer(c, this.arg);
        }
        else if (ast.isMaxLengthConstraint(c)) {
            return new MaxLengthConstraintTransformer(c, this.arg);
        }
        else {
            throw new Error("UnknownConstraint: " + c.type);
        }
    };
    ScalarTypeTransformer.prototype._validateConstraintTests = function () {
        var _this = this;
        var transformers = this.constraints.map(function (c) { return _this._makeConstraintTransformer(c); });
        return transformers.map(function (transformer) { return transformer.validateTest(); });
    };
    ScalarTypeTransformer.prototype._validate = function () {
        return ast.methodDecl(ast.identifier('validate'), 'public', 'class', 'readonly', [
            ast.parameterDecl(this.arg, ast.refTypeExp(ast.identifier('any'))),
            ast.parameterDecl(ast.identifier('path'), ast.scalarTypeExp('string'), ast.stringExp('$')),
            ast.parameterDecl(ast.identifier('err'), ast.refTypeExp(ast.identifier('ValidationResult')), ast.newExp(ast.identifier('ValidationResult'), [])),
        ], ast.blockExp([
            ast.ifExp(ast.unaryExp('!', this._isBaseJson()), ast.blockExp([
                ast.funcallExp(ast.memberExp(ast.identifier('err'), ast.identifier('push')), [
                    ast.objectExp([
                        ast.objectExpKV(ast.identifier('error'), ast.stringExp('TypeMismatch')),
                        ast.objectExpKV(ast.identifier('expected'), ast.stringExp('string')),
                        ast.objectExpKV(ast.identifier('path'), ast.identifier('path')),
                        ast.objectExpKV(ast.identifier('value'), this.arg)
                    ])
                ]),
                ast.returnExp(ast.identifier('err'))
            ]))
        ].concat((this._validateConstraintTests()), [
            ast.returnExp(ast.identifier('err'))
        ])), ast.refTypeExp(ast.identifier('ValidationResult')));
    };
    ScalarTypeTransformer.prototype.transform = function () {
        return ast.classDecl(this.className, [
            this._inner(),
            this._constructor(),
            this._valueOf(),
            this._toString(),
            this._toJSON(),
            this._fromJSON(),
            this._isJSON(),
            this._validate()
        ]);
    };
    return ScalarTypeTransformer;
}());
exports.ScalarTypeTransformer = ScalarTypeTransformer;
function transformStringType(type) {
    var constraints = [];
    if (type.pattern)
        constraints.push(type.pattern);
    if (type.minLength)
        constraints.push(type.minLength);
    if (type.maxLength)
        constraints.push(type.maxLength);
    var transformer = new ScalarTypeTransformer(type.name, ast.identifier('_v'), ast.scalarTypeExp('string'), constraints);
    return transformer.transform();
}
exports.transformStringType = transformStringType;
var Printer = /** @class */ (function () {
    function Printer() {
    }
    Printer.prototype.print = function (node) {
        var doc = this._node(node);
        return pretty_printer_1.layout(doc);
    };
    Printer.prototype._node = function (node) {
        if (ast.isIdentifier(node)) {
            return this._identifier(node);
        }
        else if (ast.isStringExp(node)) {
            return this._string(node);
        }
        else if (ast.isIntegerExp(node)) {
            return this._integer(node);
        }
        else if (ast.isDoubleExp(node)) {
            return this._double(node);
        }
        else if (ast.isBooleanExp(node)) {
            return this._boolean(node);
        }
        else if (ast.isRegexExp(node)) {
            return this._regex(node);
        }
        else if (ast.isObjectExp(node)) {
            return this._object(node);
        }
        else if (ast.isIfExp(node)) {
            return this._if(node);
        }
        else if (ast.isUnaryExp(node)) {
            return this._unary(node);
        }
        else if (ast.isBinaryExp(node)) {
            return this._binary(node);
        }
        else if (ast.isMemberExp(node)) {
            return this._member(node);
        }
        else if (ast.isFuncallExp(node)) {
            return this._funcall(node);
        }
        else if (ast.isNewExp(node)) {
            return this._new(node);
        }
        else if (ast.isBlockExp(node)) {
            return this._block(node);
        }
        else if (ast.isThrowExp(node)) {
            return this._throw(node);
        }
        else if (ast.isClassDecl(node)) {
            return this._class(node);
        }
        else if (ast.isMethodDecl(node)) {
            return this._method(node);
        }
        else if (ast.isClassPropertyDecl(node)) {
            return this._classProperty(node);
        }
        else if (ast.isAssignmentExp(node)) {
            return this._assign(node);
        }
        else if (ast.isLetExp(node)) {
            return this._let(node);
        }
        else if (ast.isReturnExp(node)) {
            return this._return(node);
        }
        else if (ast.isStringTypeExp(node)) {
            return this._stringType(node);
        }
        else if (ast.isScalarTypeExp(node)) {
            return this._scalarType(node);
        }
        else if (ast.isRefTypeExp(node)) {
            return this._refType(node);
        }
        else {
            throw new Error("Unknown Node: " + node.type);
        }
    };
    Printer.prototype._class = function (node) {
        var _this = this;
        return pretty_printer_1.concat.apply(void 0, [pretty_printer_1.flexWS(), pretty_printer_1.text("class " + node.name.name + " {")].concat(node.properties.map(function (prop) { return pretty_printer_1.nest(4, _this._node(prop)); }), [pretty_printer_1.line(), pretty_printer_1.text('}')]));
    };
    Printer.prototype._classProperty = function (node) {
        var typeDoc = ast.isTypeExp(node.propType) ? this._typeDecl(node.propType) : pretty_printer_1.empty();
        return pretty_printer_1.concat(pretty_printer_1.line(), this._visibility(node.visibility), this._propScope(node.scope), this._mutability(node.mutability), this._identifier(node.name), typeDoc, pretty_printer_1.text(';'));
    };
    Printer.prototype._defaultValue = function (exp) {
        return pretty_printer_1.concat(pretty_printer_1.flexWS(), pretty_printer_1.text('='), pretty_printer_1.flexWS(), this._node(exp));
    };
    Printer.prototype._param = function (param) {
        var typeDoc = ast.isTypeExp(param.paramType) ? this._typeDecl(param.paramType) : pretty_printer_1.empty();
        var defaultDoc = ast.isExpression(param.defaultValue) ? this._defaultValue(param.defaultValue) : pretty_printer_1.empty();
        return pretty_printer_1.concat(this._identifier(param.name), typeDoc, defaultDoc);
    };
    Printer.prototype._methodParamList = function (paramlist) {
        var _this = this;
        var inner = paramlist.map(function (param, i) {
            if (i > 0)
                return pretty_printer_1.concat(pretty_printer_1.text(','), _this._param(param));
            else
                return _this._param(param);
        });
        return pretty_printer_1.concat.apply(void 0, [pretty_printer_1.text('(')].concat(inner, [pretty_printer_1.text(')')]));
    };
    Printer.prototype._visibility = function (visibility) {
        return pretty_printer_1.concat(pretty_printer_1.flexWS(), visibility === 'public' ? pretty_printer_1.flexWS() : pretty_printer_1.text(visibility));
    };
    Printer.prototype._propScope = function (scope) {
        return pretty_printer_1.concat(pretty_printer_1.flexWS(), scope === 'class' ? pretty_printer_1.text('static') : pretty_printer_1.flexWS());
    };
    Printer.prototype._mutability = function (mutability) {
        return pretty_printer_1.concat(pretty_printer_1.flexWS(), pretty_printer_1.text(mutability));
    };
    Printer.prototype._method = function (node) {
        var retTypeDoc = ast.isTypeExp(node.returnType) ? this._typeDecl(node.returnType) : pretty_printer_1.flexWS();
        return pretty_printer_1.concat(pretty_printer_1.line(), this._visibility(node.visibility), this._propScope(node.scope), this._identifier(node.name), this._methodParamList(node.paramList), retTypeDoc, this._node(node.body));
    };
    Printer.prototype._assign = function (node) {
        return pretty_printer_1.concat(this._node(node.lhs), pretty_printer_1.text(' = '), this._node(node.exp), pretty_printer_1.text(';'));
    };
    Printer.prototype._let = function (node) {
        return pretty_printer_1.concat(pretty_printer_1.text('let'), this._node(node.lhs), pretty_printer_1.flexWS(), pretty_printer_1.text('='), this._node(node.exp), pretty_printer_1.text(';'));
    };
    Printer.prototype._typeDecl = function (node) {
        return pretty_printer_1.concat(pretty_printer_1.flexWS(), pretty_printer_1.text(':'), this._node(node));
    };
    Printer.prototype._stringType = function (node) {
        return pretty_printer_1.concat(pretty_printer_1.flexWS(), pretty_printer_1.text('string'));
    };
    Printer.prototype._scalarType = function (node) {
        var typeName = node.name === 'integer' || node.name === 'double' ? 'number' : node.name;
        return pretty_printer_1.concat(pretty_printer_1.flexWS(), pretty_printer_1.text(typeName));
    };
    Printer.prototype._refType = function (node) {
        return this._identifier(node.name);
    };
    Printer.prototype._identifier = function (node) {
        return pretty_printer_1.concat(pretty_printer_1.flexWS(), pretty_printer_1.text(node.name));
    };
    Printer.prototype._string = function (node) {
        var value = node.value.replace(/\'/g, "\\'");
        return pretty_printer_1.text("'" + value + "'");
    };
    Printer.prototype._integer = function (node) {
        return pretty_printer_1.text(node.value.toString());
    };
    Printer.prototype._double = function (node) {
        return pretty_printer_1.text(node.value.toString());
    };
    Printer.prototype._boolean = function (node) {
        return pretty_printer_1.text(node.value.toString());
    };
    Printer.prototype._regex = function (node) {
        var value = node.pattern.replace(/\'/g, "\\'");
        return pretty_printer_1.concat(pretty_printer_1.flexWS(), pretty_printer_1.text('/' + value + '/' + node.flags));
    };
    Printer.prototype._objectKV = function (node, i) {
        if (i === void 0) { i = 0; }
        return pretty_printer_1.concat(i > 0 ? pretty_printer_1.text(',') : pretty_printer_1.flexWS(), this._node(node.key), pretty_printer_1.text(':'), this._node(node.value));
    };
    Printer.prototype._object = function (node) {
        var _this = this;
        return pretty_printer_1.concat.apply(void 0, [pretty_printer_1.flexWS(), pretty_printer_1.text('{')].concat((node.keyValList.map(function (kv, i) { return pretty_printer_1.nest(4, pretty_printer_1.concat(pretty_printer_1.line(), _this._objectKV(kv, i))); })), [pretty_printer_1.line(), pretty_printer_1.text('}')]));
    };
    Printer.prototype._if = function (node) {
        var elseBranch = pretty_printer_1.flexWS();
        if (ast.isExpression(node.rhs)) {
            elseBranch = pretty_printer_1.concat(pretty_printer_1.flexWS(), pretty_printer_1.text('else'), ast.isBlockExp(node.rhs) ? this._block(node.rhs) : pretty_printer_1.nest(4, pretty_printer_1.concat(pretty_printer_1.line(), this._node(node.rhs))));
        }
        return pretty_printer_1.concat(pretty_printer_1.text('if ('), this._node(node.cond), pretty_printer_1.text(')'), ast.isBlockExp(node.lhs) ? this._node(node.lhs) : pretty_printer_1.nest(4, pretty_printer_1.concat(pretty_printer_1.line(), this._node(node.lhs))), elseBranch);
    };
    Printer.prototype._return = function (node) {
        return pretty_printer_1.concat(pretty_printer_1.text('return'), (ast.isExpression(node.exp) ? pretty_printer_1.concat(pretty_printer_1.flexWS(), this._node(node.exp)) : pretty_printer_1.empty()), pretty_printer_1.text(';'));
    };
    Printer.prototype._unary = function (node) {
        return pretty_printer_1.concat(pretty_printer_1.text('!'), this._node(node.rhs));
    };
    Printer.prototype._binary = function (node) {
        return pretty_printer_1.concat(pretty_printer_1.text('('), this._node(node.lhs), pretty_printer_1.text(" " + node.operator + " "), this._node(node.rhs), pretty_printer_1.text(')'));
    };
    Printer.prototype._member = function (node) {
        return pretty_printer_1.concat(this._node(node.head), pretty_printer_1.text('.'), this._node(node.key));
    };
    Printer.prototype._funcall = function (node) {
        var _this = this;
        var params = [];
        node.paramList.forEach(function (param, i) {
            if (i > 0) {
                params.push(pretty_printer_1.text(", "));
            }
            params.push(_this._node(node.paramList[i]));
        });
        return pretty_printer_1.concat.apply(void 0, [this._node(node.function), pretty_printer_1.text('(')].concat(params, [pretty_printer_1.text(')')]));
    };
    Printer.prototype._new = function (node) {
        var _this = this;
        var params = [];
        node.paramList.forEach(function (param, i) {
            if (i > 0) {
                params.push(pretty_printer_1.text(", "));
            }
            params.push(_this._node(node.paramList[i]));
        });
        return pretty_printer_1.concat.apply(void 0, [pretty_printer_1.text('new'), pretty_printer_1.flexWS(), this._node(node.function), pretty_printer_1.text('(')].concat(params, [pretty_printer_1.text(')')]));
    };
    Printer.prototype._block = function (node) {
        var _this = this;
        return pretty_printer_1.concat.apply(void 0, [pretty_printer_1.flexWS(), pretty_printer_1.text('{')].concat(node.exps.map(function (item) { return pretty_printer_1.nest(4, pretty_printer_1.concat(pretty_printer_1.line(), _this._node(item))); }), [pretty_printer_1.line(), pretty_printer_1.text('}')]));
    };
    Printer.prototype._throw = function (node) {
        return pretty_printer_1.concat(pretty_printer_1.flexWS(), pretty_printer_1.text('throw'), this._node(node.value), pretty_printer_1.text(';'));
    };
    return Printer;
}());
exports.Printer = Printer;
//# sourceMappingURL=typescript.js.map